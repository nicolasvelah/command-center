import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'
//import { fitBounds } from 'google-map-react/utils'
import CMarker from './CMarker'
import CMarkerClientServicePointer from './CMarkerClientServicePointer'
import Autocomplete from 'react-google-autocomplete'
//import io from 'socket.io-client'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
//import axios from 'axios'
//import { getUser } from '../../services/auth'
//import { updateMapData } from '../../services/wsConect'

import '../../assets/css/map.css'

const ButtonContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 1;
`
const Button = styled.button`
  padding: 3px 5px;
  border-radius: 3px;
  border: none;
  font-size: 11px;
  background-color: #4e86d8;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  font-family: 'Yantramanav', sans-serif;
  font-weight: normal;
  margin-right: 5px;
  position: realtive;
`
const StateContainer = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1;
  color: #333;
  background-color: rgba(255, 255, 255, 0.6);
  width: 100%;
  .conected {
    color: green;
  }
  .diconected {
    color: red;
  }
`

@observer
@inject('mapStore')
class MapServiceTacking extends Component {
  constructor(props) {
    super(props)
    this.state = {
      unmount: false,
      center: {
        lat: -0.1865934,
        lng: -78.4480523,
      },
      zoom: 14,
    }
  }

  async componentDidMount() {
    let country = this.props.country
    if (country !== null) {
      country = country.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      })
    } else {
      country = 'Ecuador'
    }
    this.setState({ unmount: false })
  }

  componentWillUnmount() {
    this.setState({ unmount: true })
  }

  centerActor = async (lat, lng) => {
    await this.setState({
      center: {
        lat: null,
        lng: null,
      },
    })
    this.setState({
      center: {
        lat: Number(lat),
        lng: Number(lng),
      },
    })
  }

  render() {
    const { center, zoom } = this.state

    return !this.state.unmount ? (
      <div className="map-container-traking">
        <Autocomplete
          onPlaceSelected={this.handlerLocalization}
          types={[]}
          componentRestrictions={{ country: 'ec' }}
          className="mapSearch"
          placeholder="Introduce una ubicación (Opcional)"
        />
        <StateContainer>
          <span
            className={
              this.props.clientDataState || this.props.clientDataState === null
                ? 'conected'
                : 'diconected'
            }
          >
            <b>Cliente:</b>{' '}
            {this.props.clientDataState || this.props.clientDataState === null
              ? 'conectado'
              : 'desconectado'}
          </span>
          {' / '}
          <span
            className={
              this.props.providerDataState ||
              this.props.providerDataState === null
                ? 'conected'
                : 'diconected'
            }
          >
            <b>Proveedor:</b>{' '}
            {this.props.providerDataState ? 'conectado' : 'desconectado'}
          </span>
        </StateContainer>
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
          {/*Punto de Encuentro Modificable desde cc*/}
          <CMarkerClientServicePointer
            lat={this.props.lat}
            lng={this.props.len}
            id={'solicitud_' + this.props.userId}
            address={this.props.address}
          />

          {/*Cliente en vivo con WS*/}
          {this.props.clientGLData !== '' &&
          this.props.clientGLData !== null ? (
            <CMarker
              lat={this.props.clientDataLat}
              lng={this.props.clientDataLng}
              clientDataState={this.props.clientDataState}
              id={this.props.clientGLData.id}
              isProvider={false}
              info={this.props.clientGLData.info}
              donde={'tacker cliente'}
              color={this.props.color}
            />
          ) : (
            ''
          )}

          {/*Proveedor en vivo con WS*/}
          {this.props.providerData !== null &&
          this.props.providerData !== '' ? (
            <CMarker
              lat={this.props.providerDataLat}
              lng={this.props.providerDataLng}
              clientDataState={this.props.providerDataState}
              isProvider={true}
              id={this.props.providerData.id}
              info={this.props.providerData.info}
              donde={'tacker poroviders'}
              color={'#000'}
            />
          ) : (
            ''
          )}

          {/*Aqui va Destino Modificable desde CC*/}
        </GoogleMapReact>
        <ButtonContainer>
          {this.props.clientGLData !== null &&
          this.props.clientGLData !== '' ? (
            <Button
              onClick={e => {
                e.preventDefault()
                this.centerActor(
                  this.props.clientGLData.lat,
                  this.props.clientGLData.lng
                )
              }}
            >
              <b>Cliente</b>
            </Button>
          ) : (
            ''
          )}
          {this.props.providerData !== null &&
          this.props.providerData !== '' ? (
            <Button
              onClick={e => {
                e.preventDefault()
                this.centerActor(
                  this.props.providerData.lat,
                  this.props.providerData.lng
                )
              }}
            >
              <b>Proveedor</b>
            </Button>
          ) : (
            ''
          )}
          <Button
            onClick={e => {
              e.preventDefault()
              this.centerActor(this.props.lat, this.props.len)
            }}
          >
            <b>Punto de encuentro</b>
          </Button>
          {typeof this.props.destinyLat !== 'undefined' ? (
            <Button
              onClick={e => {
                e.preventDefault()
                this.centerActor(this.props.destinyLat, this.props.destinyLen)
              }}
            >
              <b>Destino</b>
            </Button>
          ) : (
            ''
          )}
        </ButtonContainer>
      </div>
    ) : null
  }
}

export default MapServiceTacking
