import React, { Component } from 'react'
//import GoogleMapReact from 'google-map-react'
//import { inject, observer } from 'mobx-react'
//import { fitBounds } from 'google-map-react/utils'
//import CMarker from './CMarker'
//import CMarkerClientServicePointer from './CMarkerClientServicePointer'
//import Autocomplete from 'react-google-autocomplete'
//import io from 'socket.io-client'
//import styled from 'styled-components'
import axios from 'axios'
//import { getUser } from '../../services/auth'
import { getDistanceInMeters, colorGenerator } from '../../services/helpers'

import ProviderSearchFilter from '../Tools/ProviderSearchFilter'
import ProviderItemSearchFilter from '../Tools/ProviderItemSearchFilter'
import { renderToStaticMarkup } from 'react-dom/server'
import { divIcon } from 'leaflet'
//import L from 'leaflet/'

//import "leaflet-geotiff"
//import "leaflet-geotiff/leaflet-geotiff-plotty"
//import "leaflet-geotiff/leaflet-geotiff-vector-arrows"

//import { render } from 'react-dom'

import {
  Marker,
  Popup,
  TileLayer,
  CircleMarker,
  FeatureGroup,
  Circle,
  Polyline,
} from 'react-leaflet/es/'
import MapLeaflet from 'react-leaflet/es/Map'

import 'react-leaflet-fullscreen/dist/styles.css'
import FullscreenControl from 'react-leaflet-fullscreen'

import '../../assets/css/map.css'

/*
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
  background-color: rgb(0, 174, 239);
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
*/
const WAIT_INTERVAL = 1000

//@inject('mapStore')
//@observer
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
      m: 35000,
      ProvidersActiveServices: [],
      service: null,
      ActiveSortProv: 'distance',
      activeProvider: null,
      destinyData: {
        time: null,
        km: null,
      },
      providersOrigins: [],
      zoomLevel: null,
      waypoints: [],
      polyline: [],
      drawRoute: false,
      drawRoutePoints: [],
    }
    this.calculateAndDisplayRoute = this.calculateAndDisplayRoute.bind(this)
    this.centerActor = this.centerActor.bind(this)
    this.updateActiveSortProv = this.updateActiveSortProv.bind(this)

    this.RefItemSearchFilter = new Map()
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

    const ProvidersActiveServices = await this.selectConstructor(
      this.props.ProvidersActiveServices
    )

    if (this.props.route) {
      //console.log('Route', this.props.route)
      this.toGeoJSON(this.props.route)
      //console.log('Route Converted', routeConverted)

      //const routeLeaflet = L.Polyline.fromEncoded(this.props.route).getLatLngs()
      const routeConverted2 = this.decode(this.props.route, 5)
      //console.log('Leaflet Route Converted', routeConverted2)
      this.setState({ polyline: routeConverted2 })
    }

    this.setState({
      unmount: false,
      ProvidersActiveServices,
      service: this.props.service,
      zoomLevel: this.map.leafletElement.getZoom(),
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
      zoom: 16,
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
    //this.props.updateProvider({ distance }, provider.id)
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
    //console.log('options -', options)
    let resp = []
    options.map(item => {
      //console.log('item -', item)
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
  calculateAndDisplayRoute = async (lat, lng, id, destiny) => {
    const google = (window.google = window.google ? window.google : {})

    /*if (this.directionsDisplay !== null) {
      this.directionsDisplay.setMap(null)
    }*/
    const directionsService = new google.maps.DirectionsService()
    let colorLine = '#00aeef'
    let strokeWeight = 4
    if (!destiny) {
      colorLine = colorGenerator()
      strokeWeight = 6
    }

    var polylineOptionsActual = new google.maps.Polyline({
      strokeColor: colorLine,
      strokeOpacity: 0.8,
      strokeWeight: strokeWeight,
    })
    this.directionsDisplay = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: polylineOptionsActual,
    })
    this.directionsDisplay.setMap(this.state.map)

    const context = this
    await google.maps.event.addListener(
      this.directionsDisplay,
      'directions_changed',
      function() {
        context.computeTotalDistance(
          context.directionsDisplay.directions,
          id,
          colorLine
        )
        if (!destiny) {
          context.setProviderOriginAdress(
            context.directionsDisplay.directions,
            colorLine,
            lat,
            lng,
            id
          )
        }
      }
    )

    let destinyCords = {
      lat: Number(this.props.lat),
      lng: Number(this.props.len),
    }
    if (destiny) {
      destinyCords = {
        lat: Number(this.props.serviceDestination.position.latitude),
        lng: Number(this.props.serviceDestination.position.longitude),
      }
    }
    //console.log('PUNTOSSSS:', destinyCords)
    const data = [{ lat: Number(lat), lng: Number(lng) }, destinyCords]
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
          //console.log('Directions request failed due to ', status)
        }
      }
    )
  }
  setProviderOriginAdress = async (result, colorLine, lat, lng, id) => {
    let { providersOrigins } = this.state
    const destinyData = await this.computeTotalDistance(result, 'prov', null)
    let from = 0
    var myroute = result.routes[0]
    for (var i = 0; i < myroute.legs.length; i++) {
      from = myroute.legs[i].start_address
    }

    providersOrigins.push({
      color: colorLine,
      address: from,
      lat,
      lng,
      id,
      destinyData,
    })
    this.setState({ providersOrigins })
  }
  computeTotalDistance(result, id, colorRoute) {
    var total = 0
    var time = 0
    var sec = 0
    //var from = 0
    //var to = 0
    var myroute = result.routes[0]
    for (var i = 0; i < myroute.legs.length; i++) {
      total += myroute.legs[i].distance.value
      time += myroute.legs[i].duration.text
      sec += myroute.legs[i].duration.value
      //from = myroute.legs[i].start_address
      //to = myroute.legs[i].end_address
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
    if (id === 'prov') {
      this.props.updateProvider({ time: time, km: Math.round(total) }, id)
      return { time: time, km: Math.round(total) }
    } else if (id !== null) {
      this.props.updateProvider(
        {
          time: time,
          timeColorClass: classNameEl,
          km: Math.round(total),
          colorRoute,
        },
        id
      )
      if (document.getElementById('ProviderRouteDataButton_' + id)) {
        document.getElementById('ProviderRouteDataButton_' + id).style.display =
          'none'
      }

      if (document.getElementById('providerItem_' + id)) {
        document
          .getElementById('providerItem_' + id)
          .getElementsByClassName('ProviderRouteData')[0].style.display =
          'block'
      }
    } else {
      this.setState({ destinyData: { time: time, km: Math.round(total) } })
    }
  }
  updateActiveSortProv = ActiveSortProv => {
    this.setState({ ActiveSortProv })
  }
  setActiveProvider = activeProvider => {
    this.setState({ activeProvider })
  }
  favioriteInRef(id) {
    /*Array.from(this.RefItemSearchFilter.values())
      .filter(node => node != null)
      .forEach(node => {
        //console.log('In ARRAY node.props.item.id', node)
        //console.log('In ARRAY id', id)
        if (node.props.item.id === id) {
          //console.log('Entro', id)
          node.setFavorite(id)
        }
      })*/
  }

  metersToPixels(latPosition, metres) {
    var metresPerPixel =
      (40075016.686 * Math.abs(Math.cos((latPosition * Math.PI) / 180))) /
      Math.pow(2, this.state.zoomLevel + 8)

    const converterTo = (metres / 9.6) * metresPerPixel
    return converterTo
  }

  getMapZoom() {
    console.log('Zooom Level', this.map.leafletElement.getZoom())
    this.setState({ zoomLevel: this.map.leafletElement.getZoom() })
    return this.map && this.map.leafletElement.getZoom()
  }

  drawRoute = async (
    initialPointLat,
    initialPointLng,
    finalPointLat,
    finalPointLng
  ) => {
    let resConverted = []
    try {
      //const urlTest = `https://router.project-osrm.org/route/v1/driving/-78.501134,-0.20668;-78.4987360239029,-0.20671740030507826`
      const urlTest = `https://router.project-osrm.org/route/v1/driving/${initialPointLng},${initialPointLat};${finalPointLng},${finalPointLat}`
      //console.log('Url ', urlTest)
      const response = await axios.get(urlTest)

      resConverted = this.toGeoJSON(response.data.routes[0].geometry)

      return resConverted
    } catch (error) {
      console.log(error)
      return null
    }
  }

  toGeoJSON = function(str) {
    var index = 0,
      lat = 0,
      lng = 0,
      coordinates = [],
      shift = 0,
      result = 0,
      byte = null,
      latitude_change,
      longitude_change,
      factor = Math.pow(10, 0 || 5)

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {
      // Reset shift, result, and byte
      byte = null
      shift = 0
      result = 0

      do {
        byte = str.charCodeAt(index++) - 63
        result |= (byte & 0x1f) << shift
        shift += 5
      } while (byte >= 0x20)

      latitude_change = result & 1 ? ~(result >> 1) : result >> 1

      shift = result = 0

      do {
        byte = str.charCodeAt(index++) - 63
        result |= (byte & 0x1f) << shift
        shift += 5
      } while (byte >= 0x20)

      longitude_change = result & 1 ? ~(result >> 1) : result >> 1

      lat += latitude_change
      lng += longitude_change

      coordinates.push([lat / factor, lng / factor])
    }

    return coordinates
  }

  decode = function(encoded, precision) {
    var len = encoded.length
    var index = 0
    var latlngs = []
    var lat = 0
    var lng = 0

    precision = Math.pow(10, -(precision || 5))

    while (index < len) {
      var b
      var shift = 0
      var result = 0
      do {
        b = encoded.charCodeAt(index++) - 63
        result |= (b & 0x1f) << shift
        shift += 5
      } while (b >= 0x20)
      var dlat = result & 1 ? ~(result >> 1) : result >> 1
      lat += dlat

      shift = 0
      result = 0
      do {
        b = encoded.charCodeAt(index++) - 63
        result |= (b & 0x1f) << shift
        shift += 5
      } while (b >= 0x20)
      var dlng = result & 1 ? ~(result >> 1) : result >> 1
      lng += dlng

      latlngs.push([lat * precision, lng * precision])
    }

    return latlngs
  }

  drawRouteSearchFilter = async (
    initialPointLat,
    initialPointLng,
    finalPointLat,
    finalPointLng
  ) => {
    const resConverted = await this.drawRoute(
      initialPointLat,
      initialPointLng,
      finalPointLat,
      finalPointLng
    )

    if (resConverted !== null) {
      this.setState({ drawRoutePoints: resConverted, drawRoute: true })
    }
  }

  customMarker = (text, type) => {
    let iconMarkup
    if (type === 'origin') {
      iconMarkup = renderToStaticMarkup(
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            width: 60,
            height: 20,
            position: 'absolute',
            top: '-20px',
            right: '-25px',
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(169,247,121, 0.7)',
              borderRadius: '5px',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <i style={{ padding: 5 }}>{text}</i>
          </div>
          <div
            style={{
              margin: 'auto',
              width: 0,
              height: 0,
              borderTop: '5px solid rgba(169,247,121.7)',
              borderRight: '10px solid transparent',
              borderLeft: '10px solid transparent',
            }}
          />
        </div>
      )
    } else if (type === 'client') {
      iconMarkup = renderToStaticMarkup(
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            width: 30,
            height: 30,
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            backgroundColor: 'rgba(0,0,0, 0.5)',
            borderRadius: '50%',
            border: '1px solid #ffff',
            textAlign: 'center',
          }}
        >
          <i style={{ padding: 5 }}>{text}</i>
        </div>
      )
    }
    const customMarkerIcon = divIcon({
      html: iconMarkup,
    })
    return customMarkerIcon
  }

  render() {
    const { center, zoom } = this.state
    const customMarkerIconOrigin = this.customMarker('Origen', 'origin')
    const customMarkerIconDestiny = this.customMarker('Destino', 'origin')

    if (this.props.drawRoute) {
      this.drawRouteSearchFilter(
        this.props.providerInChat.lat,
        this.props.providerInChat.lng,
        this.props.lat,
        this.props.len
      )
      this.props.changeStateMap()
    }

    return !this.state.unmount ? (
      <div className="map-container-traking-Main">
        {this.props.searchProviderMode ? (
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
              ActiveSortProv={this.state.ActiveSortProv}
            />

            <div className="avalibleProviders">
              {this.props.providers
                ? this.props.providers
                    .filter(item => {
                      const resp = this.providerFiltering(item)
                      item.distance = resp.distance
                      //console.log('item.favorite', item.favorite)
                      return resp.response
                    })
                    .sort((a, b) => {
                      if (this.state.ActiveSortProv === 'coneccion') {
                        return a.connected === b.connected
                          ? 0
                          : a.connected
                          ? -1
                          : 1
                      } else if (this.state.ActiveSortProv === 'inService') {
                        return b.inService === a.inService
                          ? 0
                          : b.inService
                          ? -1
                          : 1
                      } else if (this.state.ActiveSortProv === 'rate') {
                        return b.info.rate - a.info.rate
                      } else if (this.state.ActiveSortProv === 'favorite') {
                        return a.favorite === b.favorite
                          ? 0
                          : a.favorite
                          ? -1
                          : 1
                      } else if (this.state.ActiveSortProv === 'distance') {
                        return a.distance - b.distance
                      } else {
                        return b.id - a.id
                      }
                    })
                    .map(item => (
                      <ProviderItemSearchFilter
                        key={item.id}
                        ref={c => this.RefItemSearchFilter.set(item.id, c)}
                        item={item}
                        centerActor={this.centerActor}
                        calculateAndDisplayRoute={this.calculateAndDisplayRoute}
                        addRemoveFavorite={this.props.addRemoveFavorite}
                        orderId={this.props.orderId}
                        favorite={item.favorite}
                        updateProvidersFavorite={
                          this.props.updateProvidersFavorite
                        }
                        setActiveProvider={this.setActiveProvider}
                        activeProvider={this.state.activeProvider}
                        asignProvider={this.props.asignProvider}
                        activeProviderNotification={
                          this.props.activeProviderNotification
                        }
                        activeProviderChat={this.props.activeProviderChat}
                        activeProviderCall={this.props.activeProviderCall}
                        originLat={this.props.lat}
                        originLng={this.props.len}
                        drawRoute={this.drawRouteSearchFilter}
                      />
                    ))
                : null}
            </div>
          </div>
        ) : null}
        <div className="map-container-traking">
          {/*<Autocomplete
            onPlaceSelected={this.handlerLocalization}
            types={[]}
            componentRestrictions={{ country: 'ec' }}
            className="mapSearch"
            placeholder="Introduce una ubicación (Opcional)"
          />*/}
          {center.lat !== null && center.lng !== null ? (
            <MapLeaflet
              ref={ref => {
                this.map = ref
              }}
              center={[center.lat, center.lng]}
              zoom={zoom}
            >
              <FullscreenControl position="bottomright" />
              <Circle
                center={[this.props.lat, this.props.len]}
                radius={this.metersToPixels(this.props.lat, this.state.m)}
              />
              <Marker
                position={[this.props.lat, this.props.len]}
                icon={customMarkerIconOrigin}
                boxZoom={true}
              >
                <Popup>
                  <span>:{this.props.address}</span>
                </Popup>
              </Marker>
              {/*Punto de destino Modificable desde cc*/}
              {this.props.serviceDestination ? (
                <Marker
                  position={[
                    this.props.serviceDestination.position.latitude,
                    this.props.serviceDestination.position.longitude,
                  ]}
                  icon={customMarkerIconDestiny}
                >
                  <Popup className="popup-destination">
                    <span>{this.props.serviceDestination.address}</span>
                  </Popup>
                </Marker>
              ) : (
                ''
              )}
              }{/*Cliente en vivo con WS*/}
              {this.props.clientGLData !== '' &&
              this.props.clientGLData !== null ? (
                <FeatureGroup color="purple">
                  <Popup>
                    {this.props.clientGLData.info.name}{' '}
                    {this.props.clientGLData.info.lastName}
                  </Popup>
                  <Marker
                    position={[
                      this.props.clientDataLat,
                      this.props.clientDataLng,
                    ]}
                    className="icon-client"
                    icon={this.customMarker(
                      `${this.props.clientGLData.info.name.charAt(
                        0
                      )}${this.props.clientGLData.info.lastName.charAt(0)}`,
                      'client'
                    )}
                  />
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="<b>Tiempo de llegada:</b>"
                  />
                </FeatureGroup>
              ) : (
                ''
              )}
              {/*Proveedores en vivo*/}
              {this.props.providers
                ? this.props.providers
                    .filter(item => {
                      const resp = this.providerFiltering(item)
                      item.distance = resp.distance
                      if (resp.response) {
                        item.classNameLocation = 'inTheRadio'
                      } else {
                        item.classNameLocation = 'outTheRadio'
                      }
                      return true
                    })
                    .map(
                      provider =>
                        provider.lat !== undefined &&
                        provider.lng !== undefined && (
                          <CircleMarker
                            fillColor={
                              provider.classNameLocation === 'inTheRadio' &&
                              this.state.activeProvider === provider.id
                                ? 'blue'
                                : 'red'
                            }
                            fillOpacity={1}
                            radius={10}
                            key={provider.id}
                            center={[provider.lat, provider.lng]}
                          >
                            <Popup>
                              Proveedor {provider.id}
                              <br />
                              {provider.info.name} {provider.info.lastName}
                              <br />
                              <span>{provider.info.description}</span>
                              <br />
                              <span style={{ color: '#ddd' }}>
                                {provider.info.services.category}
                              </span>
                            </Popup>
                          </CircleMarker>
                        )
                    )
                : null}
              {this.state.providersOrigins
                ? this.state.providersOrigins.map(providerOriginAddress => (
                    <Marker
                      key={providerOriginAddress.id}
                      position={[
                        providerOriginAddress.lat,
                        providerOriginAddress.lng,
                      ]}
                      color={providerOriginAddress.color}
                    >
                      <Popup>providerOriginAddress</Popup>
                    </Marker>
                  ))
                : ''}
              {this.props.route && (
                <Polyline
                  color="#00FFFF"
                  weight={10}
                  opacity={0.5}
                  positions={this.state.polyline}
                />
              )}
              {this.state.drawRoute && (
                <Polyline
                  color="#00FFFF"
                  weight={6}
                  positions={this.state.drawRoutePoints}
                  opacity={0.9}
                />
              )}
            </MapLeaflet>
          ) : (
            ''
          )}
          {/* 
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
            onGoogleApiLoaded={async ({ map, maps }) => {
              await this.setmap(map)
              if (this.props.serviceDestination) {
                this.calculateAndDisplayRoute(
                  this.props.lat,
                  this.props.len,
                  null,
                  true
                )
              }
            }}
          >
            {/*Punto de Encuentro Modificable desde cc/}
            <CMarkerClientServicePointer
              lat={this.props.lat}
              lng={this.props.len}
              id={'solicitud_' + this.props.userId}
              address={this.props.address}
              color="#53a93f"
              preText="Origen del servicio:"
              destinyData={this.state.destinyData}
            />
            {/*Punto de destino Modificable desde cc/ this.props
              .serviceDestination ? (
              <CMarkerClientServicePointer
                lat={this.props.serviceDestination.position.latitude}
                lng={this.props.serviceDestination.position.longitude}
                id={'solicitudDestino_' + this.props.userId}
                address={this.props.serviceDestination.address}
                color="#00aeef"
                preText="Destino:"
                destinyData={this.state.destinyData}
              />
            ) : (
              ''
            )}
            {/*Cliente en vivo con WS*}
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
            {/*Proveedores en vivo/}
            {this.props.providers
              ? this.props.providers
                  .filter(item => {
                    const resp = this.providerFiltering(item)
                    item.distance = resp.distance
                    if (resp.response) {
                      item.classNameLocation = 'inTheRadio'
                    } else {
                      item.classNameLocation = 'outTheRadio'
                    }
                    return true
                  })
                  .map(provider => (
                    <CMarker
                      key={provider.id}
                      lat={provider.lat}
                      lng={provider.lng}
                      clientDataState={provider.connected}
                      isProvider={true}
                      id={provider.id}
                      info={provider.info}
                      donde={'tacker poroviders'}
                      color={'#333'}
                      classNameLocation={provider.classNameLocation}
                      activeProvider={this.state.activeProvider}
                    />
                  ))
              : null}

            {this.state.providersOrigins
              ? this.state.providersOrigins.map(providerOriginAddress => (
                  <CMarkerClientServicePointer
                    key={providerOriginAddress.id}
                    lat={providerOriginAddress.lat}
                    lng={providerOriginAddress.lng}
                    id={'OrigenProvider_' + this.props.userId}
                    address={providerOriginAddress.address}
                    color={providerOriginAddress.color}
                    preText="Origen del Proveedor:"
                    destinyData={providerOriginAddress.destinyData}
                  />
                ))
              : ''}
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
                style={{ background: this.props.color }}
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
              style={{ background: '#53a93f' }}
            >
              <b>Origen</b>
            </Button>
            {this.props.serviceDestination ? (
              <Button
                onClick={e => {
                  e.preventDefault()
                  this.centerActor(
                    this.props.serviceDestination.position.latitude,
                    this.props.serviceDestination.position.longitude
                  )
                }}
              >
                <b>Destino</b>
              </Button>
            ) : (
              ''
            )}
          </ButtonContainer>
        */}
        </div>
      </div>
    ) : null
  }
}
export default MapServiceTacking
