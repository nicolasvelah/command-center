import React, { Component } from 'react'
import {
  Marker,
  Popup,
  TileLayer,
  CircleMarker,
  FeatureGroup,
  Circle,
  Polyline,
  Map,
} from 'react-leaflet'
import axios from 'axios'
import { getDistanceInMeters, colorGenerator } from '../../services/helpers'
import ProviderSearchFilter from '../Tools/ProviderSearchFilter'
import ProviderItemSearchFilter from '../Tools/ProviderItemSearchFilter'
import { renderToStaticMarkup } from 'react-dom/server'
import { divIcon } from 'leaflet'
import '../../assets/css/map.css'

export default class MyMap extends Component {
  render() {
    const { options } = this.props

    if (typeof window !== 'undefined') {
      return <Map {...options}>{/* Map code goes here */}</Map>
    }
    return null
  }
}
