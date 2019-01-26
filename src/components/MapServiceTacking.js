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

const token = getUser().token

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
    }
    this.onCircleInteraction = this.onCircleInteraction.bind(this)
    this.activeDraggable = this.activeDraggable.bind(this)
  }
  async componentDidMount() {
    //Geolocalizacion
    const { userId } = this.state
    this.google = window.google = window.google ? window.google : {}

    await this.getClients() //get a client list with the last know location
    await this.getProviders() //get a provider list with the last know location

    //connect with the websocket
    this.socket = io(process.env.WS_URL, {
      query: {
        user: JSON.stringify({
          id: userId,
          token,
        }),
      },
    })
    this.socket.on(`user-${userId}-socketId`, this.onSockedId)
    this.socket.on('onClientLocation', this.onClientLocation)
    this.socket.on('onProviderLocation', this.onProviderLocation) //to check gps providers updates
    this.socket.on('onProviderInService', this.onProviderInService) //to check if a provider is in service
    this.socket.on('onProviderDisconnected', this.onProviderInService) //to check if a provider has disconnected
  }
  //GEOLOCALIZATION
  async getClients() {
    try {
      const res = await axios({
        method: 'POST',
        url: `${process.env.WS_URL}/api/v1/clients`,
        headers: {
          jwt: token,
        },
      })

      const filterC = await this.filterClient(res.data, this.props.userId)
      let users = filterC.user
      let lat = filterC.lat
      let lng = filterC.lng

      console.log('Clientes [users]', users)
      await this.setState({
        clients: [users],
        center: {
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
    console.log('Response filter', response)
    return response
  }
  onSockedId = id => {
    //console.log('connected with socketID', id)
  }
  async getProviders() {
    if (this.props.providerId !== 0) {
      try {
        const res = await axios({
          method: 'POST',
          url: `${process.env.WS_URL}/api/v1/providers`,
          headers: {
            jwt: token,
          },
        })

        let users = await this.filterProviders(res.data, this.props.providerId)
        if (users !== null) {
          await this.setState({ providers: [users] })
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
  filterProviders = async (users, providerId) => {
    let response = null
    await users.map(user => {
      if (user.id === providerId) {
        response = user
      }
      return user
    })
    return response
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
  centerClients = e => {
    e.preventDefault()
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

  render() {
    const { clients, providers, center, zoom } = this.state
    console.log('providers to print', providers)
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
          zoom={zoom}
          onDrag={this.onMarkerDragEnd}
          yesIWantToUseGoogleMapApiInternals={true}
          draggable={this.state.draggable}
          onChildMouseDown={this.onCircleInteraction}
          onChildMouseUp={this.activeDraggable}
          onChildMouseMove={this.onCircleInteraction}
        >
          {clients.map((client, index) => (
            <CMarker
              key={index}
              lat={client.lat}
              lng={client.lng}
              id={client.id}
              isProvider={false}
              info={client.info}
              donde={'tacker cliente'}
            />
          ))}
          {this.props.providerId !== 0 && providers.length > 0
            ? providers.map((provider, index) => (
                <CMarker
                  key={index}
                  lat={provider.lat}
                  lng={provider.lng}
                  isProvider={true}
                  id={provider.id}
                  info={provider.info}
                  donde={'tacker poroviders'}
                />
              ))
            : ''}
          <CMarkerClientServicePointer
            lat={this.props.lat}
            lng={this.props.len}
            id={'solicitud_' + this.props.userId}
          />
        </GoogleMapReact>

        <Button onClick={this.centerClients}>
          <b>CENTRAR USUARIOS</b>
        </Button>
      </div>
    )
  }
}

export default MapServiceTacking
