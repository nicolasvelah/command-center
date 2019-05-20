import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'
//import { fitBounds } from 'google-map-react/utils'
import CMarker from './CMarker'
import CMarkerClientServicePointer from './CMarkerClientServicePointer'
import Autocomplete from 'react-google-autocomplete'
//import io from 'socket.io-client'
import styled from 'styled-components'
//import axios from 'axios'
//import { getUser } from '../../services/auth'
import { updateMapData } from '../../services/wsConect'
import { inject, observer } from 'mobx-react'
import '../../assets/css/map.css'

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
@observer
@inject('mapStore')
class MapServiceTacking extends Component {
  constructor(props) {
    super(props)
    this.state = {
      clients: [],
      providers: [],
      center: {
        lat: -0.1865934,
        lng: -78.4480523,
      },
      zoom: 14,
    }
  }

  async componentDidMount() {
    const country = this.props.country
    console.log('pais: ', country)
    const SocketData = updateMapData(
      this.props.socket,
      this.props.appId,
      this.props.country,
      this.props.mapStore
    )

    console.log('SocketData', SocketData)
    console.log('this.props.mapStore', this.props.mapStore.clientsWS)
  }

  render() {
    const { clients, providers, center, zoom } = this.state
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
          {typeof clients !== undefined
            ? clients.map((client, index) =>
                client !== null && client !== '' ? (
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
              )
            : ''}
          {this.props.providerId !== 0 && providers.length > 0
            ? providers.map((provider, index) =>
                provider !== null && provider !== '' ? (
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
