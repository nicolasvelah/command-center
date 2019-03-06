import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'
import { fitBounds } from 'google-map-react/utils'
import CMarker from './CMarker'
import CMarkerSelector from './CMarkerSelector'
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

class MapServiceLocator extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: 2,
      clients: [],
      client: [],
      providers: [],
      provider: [],
      draggable: true,
      center: {
        lat: -0.1865934,
        lng: -78.4480523,
      },
      pointer: {
        lat: -0.1865934,
        lng: -78.4480523,
      },
      zoom: 14,
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
  async componentDidMount() {
    token = await getUser().token
    //Geolocalizacion
    const { userId } = this.state
    this.google = window.google = window.google ? window.google : {}
    const country = await this.getLocationByIP()

    await this.getClients(country) //get a client list with the last know location
    await this.getProviders(country) //get a provider list with the last know location

    //connect with the websocket
    this.socket = io(process.env.WS_URL, {
      query: {
        user: JSON.stringify({
          id: userId,
          token,
          country,
        }),
      },
    })
    this.socket.on(`user-${userId}-socketId`, this.onSockedId)
    this.socket.on(`onClientLocation-${country}`, this.onClientLocation)
    this.socket.on(`onProviderLocation-${country}`, this.onProviderLocation) //to check gps providers updates
    this.socket.on(`onProviderInService-${country}`, this.onProviderInService) //to check if a provider is in service
    this.socket.on(
      `onProviderDisconnected-${country}`,
      this.onProviderDisconnected
    ) //to check if a provider has disconnected
    //the event onClientDisconnected works just like onProviderDisconnected, please  implement the method onClientDisconnected by yourself
    this.socket.on(`onClientDisconnected-${country}`, this.onClientDisconnected) //to check if a provider has disconnected
  }
  async shouldComponentUpdate() {
    await this.updateMap()
  }
  async updateMap() {
    console.log('Updtae map userId', this.props.userId)
    console.log('Updtae map provider', this.props.providerId)
    console.log(this.state.providers)
    if (typeof this.state.client[0] !== 'undefined') {
      if (this.props.userId !== this.state.client[0].id) {
        const filterC = await this.filterClient(
          this.state.clients,
          this.props.userId
        )
        let users = filterC.user
        let lat = filterC.lat
        let lng = filterC.lng

        await this.setState({
          client: [users],
          center: {
            lat: lat,
            lng: lng,
          },
          pointer: {
            lat: lat,
            lng: lng,
          },
        })
      }
    }
    if (typeof this.state.provider[0] !== 'undefined') {
      if (this.props.providerId !== this.state.provider[0].id) {
        const prov = await this.filterProviders(
          this.state.providers,
          this.props.providerId
        )
        //update the state
        this.setState({ provider: [prov] })
      }
    }
  }
  //GEOLOCALIZATION
  async getClients(country) {
    try {
      const res = await axios({
        method: 'POST',
        url: `${process.env.WS_URL}/api/v1/clients`,
        headers: {
          jwt: token,
        },
        data: {
          country,
        },
      })

      const filterC = await this.filterClient(res.data, this.props.userId)
      let users = filterC.user
      let lat = filterC.lat
      let lng = filterC.lng

      await this.setState({
        clients: res.data,
        client: [users],
        center: {
          lat: lat,
          lng: lng,
        },
        pointer: {
          lat: lat,
          lng: lng,
        },
      })
    } catch (error) {
      console.error(error)
    }
  }
  filterClient = async (users, userId) => {
    let response = {
      lat: null,
      lng: null,
      user: null,
    }

    await users.map(user => {
      if (user.id === userId) {
        response = {
          lat: user.lat,
          lng: user.lng,
          user: user,
        }
      }
      return user
    })
    return response
  }
  async getProviders(country) {
    console.log('this.props.providerId', this.props.providerId)
    try {
      const res = await axios({
        method: 'POST',
        url: `${process.env.WS_URL}/api/v1/providers`,
        headers: {
          jwt: token,
        },
        data: {
          country,
        },
      })
      console.log(res.data)
      await this.setState({ providers: res.data })
    } catch (error) {
      console.error(error)
    }
  }
  onProviderLocation = async data => {
    console.log('this.props.providerId', this.props.providerId)
    if (this.props.providerId !== 0) {
      console.log('Paso data.id ', data.id)
      if (data.id === this.props.providerId) {
        console.log('provider', data)
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
        tmp = await this.filterProviders(
          this.state.providers,
          this.props.providerId
        )
        //update the state
        this.setState({ provider: [tmp] })
      }
    }
  }

  // catch when a provider has disconnected
  onProviderDisconnected = async data => {
    // id : provider id
    const { id } = data

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
    this.setState({ provider: [tmp] })
  }
  filterProviders = async (users, providerId) => {
    let response = null
    await users.map(user => {
      if (user.id === providerId) {
        response = user
      }
      return user
    })
    console.log(response)
    return response
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
    this.setState({ provider: [tmp] })
  }
  onSockedId = id => {
    console.log('connected with socketID', id)
  }
  onClientLocation = async data => {
    if (data.id === this.state.client[0].id) {
      const client = {
        id: data.id,
        info: data.info,
        lat: data.lat,
        lng: data.lng,
      }
      var tmpClients = this.state.client
      const index = tmpClients.findIndex(o => o.userId === data.userId)
      if (index !== -1) {
        //if the user is already on the list
        //just only udate the user by index
        tmpClients[index] = client
      } else {
        //add the client to the list
        tmpClients.push(client)
      }
      //update tne state

      tmpClients = await this.filterClient(
        this.state.clients,
        this.props.userId
      )

      this.setState({
        client: [tmpClients.user],
      })
    }
  }
  centerClients = e => {
    e.preventDefault()
    let bounds = new this.google.maps.LatLngBounds()
    if (this.state.client.length === 0) {
      alert('No hay marcadores para centrar')
      return
    } else if (this.state.client.length === 1) {
      const client = this.state.client[0]
      this.setState({
        center: {
          lat: client.lat,
          lng: client.lng,
        },
        pointer: {
          lat: client.lat,
          lng: client.lng,
        },
      })
      return
    }
    this.state.client.forEach(p => {
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

  onMarkerDragEnd = map => {
    //Si si... optimizar.... :(
    let url = map.mapUrl.split('?')
    url = url[1].split('&')
    url = url[0].split('=')
    url = url[1].split(',')
    this.setState({
      center: {
        lat: Number(url[0]),
        lng: Number(url[1]),
      },
    })
  }

  handlerLocalization = place => {
    this.setState({
      center: {
        lat: place.geometry.viewport.ma.l,
        lng: place.geometry.viewport.fa.l,
      },
      pointer: {
        lat: place.geometry.viewport.ma.l,
        lng: place.geometry.viewport.fa.l,
      },
    })
  }
  onCircleInteraction(childKey, childProps, mouse) {
    // function is just a stub to test callbacks
    this.setState({
      draggable: false,
      pointer: {
        lat: mouse.lat,
        lng: mouse.lng,
      },
    })
    this.props.setLocation(mouse.lat, mouse.lng)
  }
  activeDraggable(childKey, childProps, mouse) {
    this.setState({ draggable: true })
  }

  render() {
    const { client, provider, center, zoom } = this.state
    return (
      <div className="map-container">
        <Autocomplete
          onPlaceSelected={this.handlerLocalization}
          types={[]}
          componentRestrictions={{ country: 'ec' }}
          className="mapSearch"
          placeholder="Introduce una ubicación (Opcional)"
        />
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCW_VtwnO2cCNOYEGkd3tigdoCxeRxAnU4' }}
          center={center}
          zoom={zoom}
          onDrag={this.onMarkerDragEnd}
          yesIWantToUseGoogleMapApiInternals={true}
          draggable={this.state.draggable}
          onChildMouseDown={this.onCircleInteraction}
          onChildMouseUp={this.activeDraggable}
          onChildMouseMove={this.onCircleInteraction}
        >
          {client.map((client, index) => (
            <CMarker
              key={index}
              lat={client.lat}
              lng={client.lng}
              id={client.id}
              info={client.info}
            />
          ))}
          {this.props.providerId !== 0
            ? provider.map((item, index) => (
                <CMarker
                  key={index}
                  lat={item.lat}
                  lng={item.lng}
                  isProvider={true}
                  id={item.id}
                  info={item.info}
                  donde={'tacker poroviders'}
                />
              ))
            : ''}
          <CMarkerSelector
            key={20}
            id={20}
            lat={this.state.pointer.lat}
            lng={this.state.pointer.lng}
          />
        </GoogleMapReact>

        <Button onClick={this.centerClients}>
          <b>CENTRAR CLIENTE</b>
        </Button>
      </div>
    )
  }
}

export default MapServiceLocator
