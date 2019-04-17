import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'
import { fitBounds } from 'google-map-react/utils'
import CMarker from './CMarker'
import CMarkerClientServicePointer from './CMarkerClientServicePointer'
import Autocomplete from 'react-google-autocomplete'
import io from 'socket.io-client'
import styled from 'styled-components'
import axios from 'axios'
import { getUser } from '../services/auth'
import '../assets/css/map.css'

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 3px;
  font-size: 15px;
  background-color: #4e86d8;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  font-family: 'Yantramanav', sans-serif;
  font-weight: normal;
  position: absolute;
  bottom: 20px;
  left: 20px;
  zindex: 1;
`

let token = getUser().token
const APP_ID = 1

class MapServiceTacking extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: 2,
      clients: [],
      providers: [],
      draggable: true,
      center: {
        lat: -0.1865934,
        lng: -78.4480523,
      },
      zoom: 14,
      address: '',
    }
    this.onCircleInteraction = this.onCircleInteraction.bind(this)
    this.activeDraggable = this.activeDraggable.bind(this)
  }
  getLocationByIP = async () => {
    try {
      const publicIp = require('public-ip')
      const ip = await publicIp.v4()
      const response = await axios({
        url: `${process.env.WS_URL}/api/v1/geo-ip/${ip}`,
        method: 'get',
        headers: {
          jwt: token,
        },
      })
      const { country } = response.data
      console.log('geoapi', response.data)
      return country
    } catch (error) {
      console.log('no se pudo desde el backend')
      //alert(error.message);
    }
  }
  getWsAccessToken = async country => {
    const { userId } = this.state
    const data = {
      appId: APP_ID,
      isClient: false,
      user: {
        id: userId,
      },
      country,
    }

    const response = await axios({
      method: 'POST',
      url: `${process.env.WS_URL}/api/v1/ws/get-access-token`,
      headers: {
        jwt: token,
      },
      data,
    })

    //return a token from ws api
    return response.data
  }
  async componentDidMount() {
    token = await getUser().token
    //Geolocalizacion
    const { userId } = this.state
    this.google = window.google = window.google ? window.google : {}
    this.geocodeLatLng(this.props.lat, this.props.len)
    const country = await this.getLocationByIP()
    const wsToken = await this.getWsAccessToken(country)
    await this.getClients() //get a client list with the last know location
    await this.getProviders() //get a provider list with the last know location

    //connect with the websocket
    this.socket = io(process.env.WS_URL, {
      query: {
        wsToken,
      },
    })

    this.socket.on(`user--${userId}`, this.onSockedId)
    this.socket.on(
      `onClientLocation-app-${APP_ID}-${country}`,
      this.onClientLocation
    )
    this.socket.on(
      `onProviderLocation-app-${APP_ID}-${country}`,
      this.onProviderLocation
    ) //to check gps providers updates
    this.socket.on(
      `onProviderInService-app-${APP_ID}-${country}`,
      this.onProviderInService
    ) //to check if a provider is in service
    this.socket.on(
      `onProviderDisconnected-app-${APP_ID}-${country}`,
      this.onProviderDisconnected
    ) //to check if a provider has disconnected
    //the event onClientDisconnected works just like onProviderDisconnected, please  implement the method onClientDisconnected by yourself
    this.socket.on(
      `onClientDisconnected-app-${APP_ID}-${country}`,
      this.onClientDisconnected
    ) //to check if a provider has disconnected
  }
  //GEOLOCALIZATION
  async findUser(userId, isClient) {
    console.log('find userId-------------------', userId)
    try {
      const user = await axios({
        method: 'POST',
        url: `${process.env.WS_URL}/api/v1/find-user`,
        headers: {
          jwt: token,
        },
        data: {
          userId,
          isClient,
        },
      })
      console.log('find user-------------------', user)
      return user
    } catch (error) {
      console.error(error)
    }
  }
  async getClients() {
    try {
      const user = await this.findUser(this.props.userId, true)
      console.log('Cliente-------------------', user.data)
      await this.setState({
        clients: [user.data],
        center: {
          lat: Number(this.props.lat),
          lng: Number(this.props.len),
        },
      })
    } catch (error) {
      console.error(error)
    }
  }

  onSockedId = id => {
    console.log('connected with socketID', id)
  }
  async getProviders() {
    if (this.props.providerId !== 0) {
      try {
        const user = await this.findUser(this.props.providerId, false)
        console.log('Provider-------------------', user.data)
        if (user.data !== null) {
          await this.setState({ providers: [user.data] })
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  onSockedId = id => {
    //console.log('connected with socketID', id)
  }
  onClientLocation = async data => {
    if (data.id === this.state.clients[0].id) {
      const client = {
        id: data.id,
        info: data.info,
        lat: data.lat,
        lng: data.lng,
      }
      var tmpClients = this.state.clients
      const index = tmpClients.findIndex(o => o.id === client.id)
      if (index !== -1) {
        //if the user is already on the list
        //just only udate the user by index
        tmpClients[index] = client
      } else {
        //add the client to the list
        tmpClients.push(client)
      }
      //update tne state

      tmpClients = await this.filterClient(tmpClients, data.id)

      this.setState({
        clients: [tmpClients.user],
      })
    }
  }
  onProviderLocation = async data => {
    if (typeof this.state.providers[0] !== 'undefined') {
      if (data.id === this.state.providers[0].id) {
        //console.log('provider', data)
        const provider = {
          id: data.id,
          info: data.info,
          lat: data.lat,
          lng: data.lng,
        }
        var tmp = this.state.providers
        const index = tmp.findIndex(o => o.id === provider.id)
        if (index !== -1) {
          //if the user is already on the list
          //just only udate the user by index
          tmp[index] = provider
        } else {
          //add the provider to the list
          tmp.push(provider)
        }
        tmp = await this.filterProviders(tmp, this.props.providerId)
        //update the state
        this.setState({ providers: [tmp] })
      }
    }
  }

  // catch when a provider has disconnected
  onProviderDisconnected = async data => {
    // id : provider id
    const { id } = data
    console.log('client disconnected', id)
    //update the providers arrays
    var tmp = this.state.providers
    const index = tmp.findIndex(o => o.id === id)
    if (index !== -1) {
      //if the user is already on the list
      //just only udate the user by index
      tmp[index].connected = false
    }
    tmp = await this.filterProviders(tmp, this.props.providerId)
    //update the state
    this.setState({ providers: [tmp] })
  }

  // catch when the inService status of a one provider has changed
  onProviderInService = async data => {
    //console.log('onProviderInService', data)
    // id : provider id
    // inService: it can be a stringNumber or a null, if the value is null the provider is available to new orders
    const { id, inService } = data

    //update the providers arrays
    var tmp = this.state.providers
    const index = tmp.findIndex(o => o.id === id)
    if (index !== -1) {
      //if the user is already on the list
      //just only udate the user by index
      tmp[index].inService = inService
    }
    tmp = await this.filterProviders(tmp, this.props.providerId)
    //update the state
    this.setState({ providers: [tmp] })
  }
  centerClients = async e => {
    e.preventDefault()
    await this.setState({
      center: {
        lat: null,
        lng: null,
      },
    })
    let bounds = new this.google.maps.LatLngBounds()
    if (this.state.clients.length === 0) {
      alert('No hay marcadores para centrar')
      return
    } else if (this.state.clients.length === 1) {
      const client = this.state.clients[0]
      this.setState({
        center: {
          lat: client.lat,
          lng: client.lng,
        },
      })
      console.log('this.state.center: ', this.state.center)
      return
    }
    this.state.clients.forEach(p => {
      bounds.extend(new this.google.maps.LatLng(p.lat, p.lng))
    })
    // GET NW, SE BY NE, SW
    const ne = bounds.getNorthEast()
    const sw = bounds.getSouthWest()
    const nw = { lat: ne.lat(), lng: sw.lng() }
    const se = { lat: sw.lat(), lng: ne.lng() }
    const { center, zoom } = fitBounds(
      { se: { lat: se.lat, lng: se.lng }, nw: { lat: nw.lat, lng: nw.lng } },
      { width: 225, height: 777 }
    )
    this.setState({ center, zoom })
  }

  onMarkerDragEnd = map => {}

  handlerLocalization = place => {
    this.setState({
      center: {
        lat: place.geometry.viewport.ma.l,
        lng: place.geometry.viewport.fa.l,
      },
    })
  }
  onCircleInteraction(childKey, childProps, mouse) {
    // function is just a stub to test callbacks
    this.setState({
      draggable: false,
    })
  }
  activeDraggable(childKey, childProps, mouse) {
    this.setState({ draggable: true })
  }
  async geocodeLatLng(lat, lng) {
    var latlng = { lat: parseFloat(lat), lng: parseFloat(lng) }
    let geocoder = new this.google.maps.Geocoder()
    const context = this
    return await geocoder.geocode({ location: latlng }, function(
      results,
      status
    ) {
      if (status === 'OK') {
        if (results[0]) {
          console.log('result', results[0].formatted_address)
          context.setState({
            address: results[0].formatted_address,
          })
          return results[0].formatted_address
        } else {
          console.log('Geocoder: No results found')
          return ''
        }
      } else {
        console.log('Geocoder failed due to: ' + status)
        return ''
      }
    })
  }

  render() {
    const { clients, providers, center, zoom } = this.state
    console.log('providers to print', providers)
    console.log('center---------------', center)
    console.log('clientes---------------', clients)
    return (
      <div className="map-container-traking">
        <Autocomplete
          onPlaceSelected={this.handlerLocalization}
          types={[]}
          componentRestrictions={{ country: 'ec' }}
          className="mapSearch"
          placeholder="Introduce una ubicación (Opcional)"
        />
        <GoogleMapReact
          center={center}
          bootstrapURLKeys={{ key: 'AIzaSyCW_VtwnO2cCNOYEGkd3tigdoCxeRxAnU4' }}
          zoom={zoom}
          onDrag={this.onMarkerDragEnd}
          yesIWantToUseGoogleMapApiInternals={true}
          draggable={this.state.draggable}
          onChildMouseDown={this.onCircleInteraction}
          onChildMouseUp={this.activeDraggable}
          onChildMouseMove={this.onCircleInteraction}
        >
          <CMarkerClientServicePointer
            lat={this.props.lat}
            lng={this.props.len}
            id={'solicitud_' + this.props.userId}
            address={this.state.address}
          />
          {clients.map((client, index) =>
            client !== null ? (
              <CMarker
                key={index}
                lat={client.lat}
                lng={client.lng}
                id={client.id}
                isProvider={false}
                info={client.info}
                donde={'tacker cliente'}
              />
            ) : (
              ''
            )
          )}
          {this.props.providerId !== 0 && providers.length > 0
            ? providers.map((provider, index) =>
                provider !== null ? (
                  <CMarker
                    key={index}
                    lat={provider.lat}
                    lng={provider.lng}
                    isProvider={true}
                    id={provider.id}
                    info={provider.info}
                    donde={'tacker poroviders'}
                  />
                ) : (
                  ''
                )
              )
            : ''}
        </GoogleMapReact>

        <Button onClick={this.centerClients}>
          <b>CENTRAR USUARIOS</b>
        </Button>
      </div>
    )
  }
}

export default MapServiceTacking
