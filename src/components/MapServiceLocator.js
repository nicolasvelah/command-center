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
  font-family: Arial, Helvetica, sans-serif;
  font-weight: normal;
  position: absolute;
  bottom: 20px;
  left: 20px;
  zindex: 1;
`

const token = getUser().token

class MapServiceLocator extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: 2,
      clients: [],
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
  async componentDidMount() {
    //Geolocalizacion
    const { userId } = this.state
    this.google = window.google = window.google ? window.google : {}

    await this.getClients() //get a client list with the last know location

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
  }
  //GEOLOCALIZATION
  async getClients() {
    try {
      const res = await axios({
        method: 'POST',
        url: 'https://websockets.it-zam.com/api/v1/clients',
        headers: {
          jwt: token,
        },
      })
      let users = null
      let lat = null
      let lng = null
      const context = this
      res.data.map(user => {
        if (user.id === context.props.userId) {
          users = user
          lat = user.lat
          lng = user.lng
        }
        return user
      })
      await this.setState({
        clients: [users],
        center: {
          lat: lat,
          lng: lng,
        },
        pointer: {
          lat: lat,
          lng: lng,
        },
      })
      this.props.setLocation(lat, lng)
    } catch (error) {
      console.error(error)
    }
  }
  onSockedId = id => {
    console.log('connected with socketID', id)
  }
  onClientLocation = data => {
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
    this.setState({
      clients: tmpClients,
      center: {
        lat: client.lat,
        lng: client.lng,
      },
      pointer: {
        lat: client.lat,
        lng: client.lng,
      },
    })
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
        pointer: {
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
    const { clients, center, zoom } = this.state
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
          bootstrapURLKeys={{
            key: 'AIzaSyCW_VtwnO2cCNOYEGkd3tigdoCxeRxAnU4',
          }}
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
              info={client.info}
            />
          ))}
          <CMarkerSelector
            key={20}
            id={20}
            lat={this.state.pointer.lat}
            lng={this.state.pointer.lng}
          />
        </GoogleMapReact>

        <Button onClick={this.centerClients}>
          <b>CENTRAR CLIENTES</b>
        </Button>
      </div>
    )
  }
}

export default MapServiceLocator
