import React, { Component } from 'react'
import 'moment/locale/es.js'
import { DatePickerInput } from 'rc-datepicker'
import Select from 'react-select'

import 'rc-datepicker/lib/style.css'
import '../assets/css/deliveries.css'

const date = '2019-06-26' // or Date or Moment.js
export default class Deliveries extends Component {
  onChange = (jsDate, dateString) => {
    console.log(jsDate)
  }
  render() {
    return (
      <div className="deliveries">
        <h1>Entregas</h1>
        <div className="filters">
          <div className="inputContainer">
            <span>Desde:</span>
            <DatePickerInput
              onChange={this.onChange}
              value={date}
              className="my-custom-datepicker-component"
            />
          </div>
          <div className="inputContainer">
            <span>Hasta:</span>
            <DatePickerInput
              onChange={this.onChange}
              value={date}
              className="my-custom-datepicker-component"
            />
          </div>
          <div className="inputContainer">
            <Select
              className="input"
              classNamePrefix="pais"
              placeholder="Pais"
              isClearable={true}
              isSearchable={true}
              name="category"
              options={[
                { value: 'ec', label: 'Ecuador' },
                { value: 'mx', label: 'Mexico' },
              ]}
            />
          </div>
        </div>
        <div>
          <table>
            <tbody>
              <tr>
                <th>Id</th>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Cliente</th>
                <th>Proveedor</th>
                <th>Operador</th>
                <th>Pais</th>
                <th>Ciudad</th>
                <th>Sector</th>
                <th>Direccion</th>
                <th>Actios</th>
              </tr>
              <tr>
                <td>1</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
