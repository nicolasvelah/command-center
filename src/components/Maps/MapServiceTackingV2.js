import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'
//import { fitBounds } from 'google-map-react/utils'
import CMarker from './CMarker'
import CMarkerClientServicePointer from './CMarkerClientServicePointer'
//import Autocomplete from 'react-google-autocomplete'
//import io from 'socket.io-client'
import styled from 'styled-components'
//import axios from 'axios'
//import { getUser } from '../../services/auth'
import { getDistanceInMeters } from '../../services/helpers'
import ProviderSearchFilter from '../Tools/ProviderSearchFilter'
import ProviderItemSearchFilter from '../Tools/ProviderItemSearchFilter'

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
      ActiveSortProv: 'distance',
    }
    this.calculateAndDisplayRoute = this.calculateAndDisplayRoute.bind(this)
    this.centerActor = this.centerActor.bind(this)
    this.updateActiveSortProv = this.updateActiveSortProv.bind(this)
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
      radius: Number(this.state.m),
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
    /*if (this.directionsDisplay !== null) {
      this.directionsDisplay.setMap(null)
    }*/
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
    var sec = 0
    var from = 0
    var to = 0
    var myroute = result.routes[0]
    for (var i = 0; i < myroute.legs.length; i++) {
      total += myroute.legs[i].distance.value
      time += myroute.legs[i].duration.text
      sec += myroute.legs[i].duration.value
      from = myroute.legs[i].start_address
      to = myroute.legs[i].end_address
    }

    time = time.replace('hours', 'H')
    time = time.replace('mins', 'M')
    total = total / 1000

    let classNameEl = 'semVerde'
    if (Number(sec) > 3600) {
      //1 hora
      classNameEl = 'semRojo'
    } else if (Number(sec) > 1800) {
      //1/2 hora
      classNameEl = 'semAmarillo'
    }
    document
      .getElementById('ProviderRouteData_' + id)
      .classList.add(classNameEl)
    document.getElementById('ProviderRouteDataButton_' + id).style.display =
      'none'
    document
      .getElementById('providerItem_' + id)
      .getElementsByClassName('time')[0].innerHTML = time

    document
      .getElementById('providerItem_' + id)
      .getElementsByClassName('km')[0].innerHTML = Math.round(total) + 'KM'

    document.getElementById('activeDir').innerHTML =
      '<b>Desde:</b> ' + from + ' <br/><b>Hasta:</b> ' + to

    document
      .getElementById('providerItem_' + id)
      .getElementsByClassName('ProviderRouteData')[0].style.display = 'block'
  }
  updateActiveSortProv = ActiveSortProv => {
    this.setState({ ActiveSortProv })
  }

  render() {
    const { center, zoom } = this.state
    console.log('+++++++++++++++++++++props.providers', this.props.providers)
    return !this.state.unmount ? (
      <div className="map-container-traking-Main">
        <div className="providersList">
          <ProviderSearchFilter
            userId={this.props.userId}
            m={this.state.m}
            ProvidersActiveServices={this.state.ProvidersActiveServices}
            handleChange={this.handleChange}
            handleKeyDown={this.handleKeyDown}
            handleServiceChange={this.handleServiceChange}
            SelectDefaultValue={{
              value: this.props.service,
              label: this.props.service,
            }}
            updateActiveSortProv={this.updateActiveSortProv}
          />

          <div className="avalibleProviders">
            {this.props.providers
              .filter(item => {
                const resp = this.providerFiltering(item)
                item.distance = resp.distance
                if (this.props.favoritesProviders !== null) {
                  if (this.props.favoritesProviders.includes(item.id)) {
                    item.favorite = true
                  } else {
                    item.favorite = false
                  }
                } else {
                  item.favorite = false
                }
                return resp.response
              })
              .sort((a, b) => {
                console.log(
                  '~~~~~~~~~~~~~~~~~~this.state.ActiveSortProv',
                  this.state.ActiveSortProv
                )
                if (this.state.ActiveSortProv === 'coneccion') {
                  return a.connected === b.connected ? 0 : a.connected ? -1 : 1
                } else if (this.state.ActiveSortProv === 'inService') {
                  return b.inService === a.inService ? 0 : b.inService ? -1 : 1
                } else if (this.state.ActiveSortProv === 'rate') {
                  return b.info.rate - a.info.rate
                } else if (this.state.ActiveSortProv === 'favorite') {
                  return a.favorite === b.favorite ? 0 : a.favorite ? -1 : 1
                } else if (this.state.ActiveSortProv === 'distance') {
                  return a.distance - b.distance
                } else {
                  return b.id - a.id
                }
              })
              .map(item => {
                return (
                  <ProviderItemSearchFilter
                    key={item.id}
                    item={item}
                    centerActor={this.centerActor}
                    calculateAndDisplayRoute={this.calculateAndDisplayRoute}
                    addRemoveFavorite={this.props.addRemoveFavorite}
                    orderId={this.props.orderId}
                    favorite={item.favorite}
                    updateProvidersFavorite={this.props.updateProvidersFavorite}
                  />
                )
              })}
          </div>
        </div>
        <div className="map-container-traking">
          {/*<Autocomplete
            onPlaceSelected={this.handlerLocalization}
            types={[]}
            componentRestrictions={{ country: 'ec' }}
            className="mapSearch"
            placeholder="Introduce una ubicación (Opcional)"
          />*/}
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
