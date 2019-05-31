import React from 'react'
import Select from 'react-select'
import Svg from './svg'

export default class ProviderSearchFilter extends React.Component {
  render() {
    return (
      <div className="providersSearchFilters">
        <div>
          {'Proveedores a '}
          <input
            id={'metrage_' + this.props.userId}
            className="meterSeter"
            defaultValue={this.props.m}
            onChange={this.props.handleChange}
            onKeyDown={this.props.handleKeyDown}
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
          options={this.props.ProvidersActiveServices}
          onChange={this.props.handleServiceChange}
          defaultValue={this.props.SelectDefaultValue}
        />
        <div className="orderBY">
          <b>Ordenar:</b>{' '}
          <Svg
            title={'Estado de la coneción'}
            svgClass="ocupyIcon"
            viewBox="0 0 512 512"
            svgFill={'#333'}
            svgPathOne_d="M416 368h-96v80h-128v-80h-96v-192h64v-128h64v128h64v-128h64v128h64v192z"
            svgOnClick={this.props.updateActiveSortProv}
            svgOnClickVal="coneccion"
          />
          {' / '}
          <Svg
            title={'En servicio?'}
            svgClass="ocupyIcon"
            svgFill={'#333'}
            viewBox="0 0 512 512"
            svgPathOne_d={
              'M256 0c-141.385 0-256 114.615-256 256s114.615 256 256 256 256-114.615 256-256-114.615-256-256-256zM329.372 374.628l-105.372-105.373v-141.255h64v114.745l86.628 86.627-45.256 45.256z'
            }
            svgOnClick={this.props.updateActiveSortProv}
            svgOnClickVal="inService"
          />
          {' / '}
          <Svg
            title={'Rate'}
            svgClass="ocupyIcon"
            svgFill={'#333'}
            viewBox="0 0 512 512"
            svgPathOne_d={
              'M512 198.525l-176.89-25.704-79.11-160.291-79.108 160.291-176.892 25.704 128 124.769-30.216 176.176 158.216-83.179 158.216 83.179-30.217-176.176 128.001-124.769z'
            }
            svgOnClick={this.props.updateActiveSortProv}
            svgOnClickVal="rate"
          />
          {' / '}
          <Svg
            title="Favorito"
            svgClass="ocupyIcon"
            viewBox="0 0 512 512"
            svgFill="#333"
            svgPathOne_d="M224 416c-4 0-8-1.5-11-4.5l-156-150.5c-2-1.75-57-52-57-112 0-73.25 44.75-117 119.5-117 43.75 0 84.75 34.5 104.5 54 19.75-19.5 60.75-54 104.5-54 74.75 0 119.5 43.75 119.5 117 0 60-55 110.25-57.25 112.5l-155.75 150c-3 3-7 4.5-11 4.5"
            svgOnClick={this.props.updateActiveSortProv}
            svgOnClickVal="favorite"
          />
          {' / '}
          <b onClick={e => this.props.updateActiveSortProv('distance')}>
            dist.
          </b>
        </div>
      </div>
    )
  }
}
