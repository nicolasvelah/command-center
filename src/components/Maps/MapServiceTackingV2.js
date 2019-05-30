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
import { getDistanceInMeters } from '../../services/helpers'
import Select from 'react-select'

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
  display: none;
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
const WAIT_INTERVAL = 1000

class MapServiceTacking extends Component {
  constructor(props) {
    super(props)
    this.state = {
      map: null,
      unmount: false,
      center: {
        lat: -0.1865934,
        lng: -78.4480523,
      },
      zoom: 14,
      m: 5000,
      ProvidersActiveServices: [],
      service: null,
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
    this.setState({
      unmount: false,
      ProvidersActiveServices: this.selectConstructor(
        this.props.ProvidersActiveServices
      ),
      service: this.props.service,
    })
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

  providerFiltering = provider => {
    const distance = getDistanceInMeters(
      {
        latitude: this.props.lat,
        longitude: this.props.len,
      },
      {
        latitude: provider.lat,
        longitude: provider.lng,
      }
    )
    let response = false
    if (distance <= this.state.m) {
      response = true
    }
    let isService = false
    //console.log('---------------------------------~~~~~~~~~~~~~~~~~~~~~')
    provider.info.services.map(service => {
      //console.log('service', service)
      //console.log('this.props.service', this.props.service)
      if (service.servicio === this.state.service) {
        isService = true
      }
      return service
    })
    //console.log('isService', isService)
    if (this.state.service !== 'Todos' && !isService) {
      response = false
    }
    return { response, distance }
  }
  setM = async m => {
    await this.setState({ m })
    this.drawCircle()
  }
  timer = null
  timerTrigger = value => {
    this.setM(value)
  }
  handleChange = e => {
    try {
      //console.log('e.target.value habdelChange', e.target.value)
      clearTimeout(this.timer)

      this.timer = setTimeout(this.timerTrigger(e.target.value), WAIT_INTERVAL)
    } catch (err) {
      console.log('ERROR', err.message)
    }
  }

  setmap = map => {
    this.setState({ map })
    this.drawCircle()
  }
  cityCircle = null
  drawCircle = () => {
    const google = (window.google = window.google ? window.google : {})
    if (this.cityCircle !== null) {
      this.cityCircle.setMap(null)
    }
    this.cityCircle = new google.maps.Circle({
      strokeColor: '#4e86d8',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#4e86d8',
      fillOpacity: 0.3,
      map: this.state.map,
      center: {
        lat: Number(this.props.lat),
        lng: Number(this.props.len),
      },
      radius: this.state.m * 2,
    })
  }
  selectConstructor = options => {
    let resp = []
    options.map(item => {
      resp.push({ label: item, value: item })
      return item
    })
    resp.push({ label: 'Todos', value: 'Todos' })
    return resp
  }
  handleServiceChange = async option => {
    this.setState({
      service: option.value,
    })
  }
  directionsDisplay = null
  calculateAndDisplayRoute(lat, lng, id) {
    const google = (window.google = window.google ? window.google : {})
    if (this.directionsDisplay !== null) {
      this.directionsDisplay.setMap(null)
    }
    const directionsService = new google.maps.DirectionsService()
    this.directionsDisplay = new google.maps.DirectionsRenderer()
    this.directionsDisplay.setMap(this.state.map)
    const context = this
    google.maps.event.addListener(
      this.directionsDisplay,
      'directions_changed',
      function() {
        context.computeTotalDistance(context.directionsDisplay.directions, id)
      }
    )
    const data = [
      { lat: Number(lat), lng: Number(lng) },
      { lat: Number(this.props.lat), lng: Number(this.props.len) },
    ]
    const waypoints = data.map(item => {
      return {
        location: { lat: item.lat, lng: item.lng },
        stopover: true,
      }
    })
    const origin = waypoints.shift().location
    const destination = waypoints.pop().location

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: 'DRIVING',
      },
      (response, status) => {
        if (status === 'OK') {
          this.directionsDisplay.setDirections(response)
        } else {
          console.log('Directions request failed due to ', status)
        }
      }
    )
  }
  computeTotalDistance(result, id) {
    var total = 0
    var time = 0
    var from = 0
    var to = 0
    var myroute = result.routes[0]
    for (var i = 0; i < myroute.legs.length; i++) {
      total += myroute.legs[i].distance.value
      time += myroute.legs[i].duration.text
      from = myroute.legs[i].start_address
      to = myroute.legs[i].end_address
    }
    time = time.replace('hours', 'H')
    time = time.replace('mins', 'M')
    total = total / 1000

    document
      .getElementById('providerItem_' + id)
      .getElementsByClassName('time')[0].innerHTML = time

    document
      .getElementById('providerItem_' + id)
      .getElementsByClassName('km')[0].innerHTML = Math.round(total) + 'KM'

    document.getElementById('activeDir').innerHTML =
      'Desde: ' + from + '/ Hasta: ' + to

    document
      .getElementById('providerItem_' + id)
      .getElementsByClassName('ProviderRouteData')[0].style.display = 'block'
  }
  render() {
    const { center, zoom } = this.state
    console.log('+++++++++++++++++++++props.providers', this.props.providers)
    return !this.state.unmount ? (
      <div className="map-container-traking-Main">
        <div className="providersList">
          <div className="providersSearchFilters">
            <div>
              {'Proveedores a '}
              <input
                id={'metrage_' + this.props.userId}
                className="meterSeter"
                defaultValue={this.state.m}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
              />
              {'m a la redonda'}
            </div>
            <Select
              className="activeserviceInput"
              classNamePrefix="activeservice"
              placeholder="Servicios activos"
              isClearable={false}
              isSearchable={true}
              name="servicios"
              options={this.state.ProvidersActiveServices}
              onChange={this.handleServiceChange}
              defaultValue={{
                value: this.props.service,
                label: this.props.service,
              }}
            />
          </div>
          <div className="avalibleProviders">
            {this.props.providers
              .filter(item => {
                const resp = this.providerFiltering(item)
                item.distance = resp.distance
                return resp.response
              })
              .map(item => {
                return (
                  <div
                    style={{ color: '#333' }}
                    key={item.id}
                    id={'providerItem_' + item.id}
                    className="providerItem"
                    onClick={e => {
                      this.centerActor(item.lat, item.lng)
                      this.calculateAndDisplayRoute(item.lat, item.lng, item.id)
                    }}
                  >
                    {item.info.name + ' ' + item.info.lastName} <br />
                    <div
                      className="ProviderRouteData"
                      style={{ display: 'none' }}
                    >
                      <span className="time" />
                      {' / '}
                      <span className="km" />
                    </div>
                    <span>
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="conectIcon"
                      >
                        <title />
                        <g id="icomoon-ignore" />
                        <path
                          fill={item.connected ? '#53a93f' : '#c62b20'}
                          d="M416 368h-96v80h-128v-80h-96v-192h64v-128h64v128h64v-128h64v128h64v192z"
                        />
                      </svg>
                      <div className="dropDown">
                        {item.connected ? 'conectado' : 'desconectado'}
                      </div>
                    </span>
                    {' / '}
                    {item.inService ? (
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="ocupyIcon"
                      >
                        <title />
                        <g id="icomoon-ignore" />
                        <path
                          fill="#c62b20"
                          d="M256 0c-141.385 0-256 114.615-256 256s114.615 256 256 256 256-114.615 256-256-114.615-256-256-256zM329.372 374.628l-105.372-105.373v-141.255h64v114.745l86.628 86.627-45.256 45.256z"
                        />
                      </svg>
                    ) : (
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="ocupyIcon"
                      >
                        <title />
                        <g id="icomoon-ignore" />
                        <path
                          fill="#53a93f"
                          d="M432 64l-240 240-112-112-80 80 192 192 320-320z"
                        />
                      </svg>
                    )}
                    {' / '}
                    {item.info.rate + ' x '}
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="startIcon"
                    >
                      <title />
                      <g id="icomoon-ignore" />
                      <path
                        fill="#ffc200"
                        d="M512 198.525l-176.89-25.704-79.11-160.291-79.108 160.291-176.892 25.704 128 124.769-30.216 176.176 158.216-83.179 158.216 83.179-30.217-176.176 128.001-124.769z"
                      />
                    </svg>
                    {' / '}
                    {item.distance + 'm'}
                    <br />
                    {' ( '}
                    {item.info.services.map(service => (
                      <span key={service.serviceId}>
                        <img
                          src={service.icon}
                          alt={service.category}
                          className="cateoryImageProviderItem"
                        />
                        {service.servicio + ', '}
                      </span>
                    ))}
                    {' ) '}
                    <button
                      onClick={e => {
                        e.preventDefault()
                      }}
                      className="btn b-verde"
                    >
                      Asignar
                    </button>
                  </div>
                )
              })}
          </div>
        </div>
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
                this.props.clientDataState ||
                this.props.clientDataState === null
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
          </StateContainer>
          <div id="activeDir" />
          <GoogleMapReact
            center={center}
            bootstrapURLKeys={{
              key: 'AIzaSyCW_VtwnO2cCNOYEGkd3tigdoCxeRxAnU4',
            }}
            zoom={zoom}
            onDrag={this.onMarkerDragEnd}
            yesIWantToUseGoogleMapApiInternals={true}
            draggable={this.state.draggable}
            onChildMouseDown={this.onCircleInteraction}
            onChildMouseUp={this.activeDraggable}
            onChildMouseMove={this.onCircleInteraction}
            onGoogleApiLoaded={({ map, maps }) => {
              this.setmap(map)
            }}
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

            {/*Proveedores en vivo*/}
            {this.props.providers
              .filter(item => {
                const resp = this.providerFiltering(item)
                item.distance = resp.distance
                return resp.response
              })
              .map(provider => (
                <CMarker
                  key={provider.id}
                  lat={provider.lat}
                  lng={provider.lng}
                  clientDataState={true}
                  isProvider={true}
                  id={provider.id}
                  info={provider.info}
                  donde={'tacker poroviders'}
                  color={'#000'}
                />
              ))}

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
            {/*this.props.providerData !== null &&
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
          )*/}
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
      </div>
    ) : null
  }
}

export default MapServiceTacking
