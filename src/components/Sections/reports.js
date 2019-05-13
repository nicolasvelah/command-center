import React, { Component } from 'react'
import Chart from 'react-google-charts'
import moment from 'moment'
import { DatePickerInput } from 'rc-datepicker'
//import axios from 'axios'
//import { getUser } from '../services/auth'

import 'moment/locale/es.js'
import 'rc-datepicker/lib/style.css'
import '../../assets/css/reports.css'

export default class Reports extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: moment().format('YYYY-MM-DDT23:59:59.719Z'),
      firstDate: moment()
        .startOf('month')
        .format('YYYY-MM-DDT00:00:00.719Z'),
    }
  }
  onChange = async (jsDate, type) => {
    console.log(jsDate + ' / ' + type)
    if (type === 'from') {
      await this.setState({
        firstDate: moment(jsDate).format('YYYY-MM-DDT00:00:20.719Z'),
      })
    } else {
      await this.setState({
        date: moment(jsDate).format('YYYY-MM-DDT23:59:59.719Z'),
      })
    }

    return true
  }
  render() {
    return (
      <div className="reports">
        <h1>Monitoreo</h1>
        <div className="filters">
          Pais / Ciudad / Todo --- Mensual / Semana / Anual --- Por categoria /
          Por servicio --- Por estado de la orden y tiempo --- zona vs pedidos y
          cantidad de proveedores --- SOS tipo de siniestros (Muertos - Heridos
          - Rescatados) Para esto hey que vor como se recolecta esta data en la
          orden desde cc.
        </div>
        <div className="filters">
          <div className="inputContainer">
            <span>Desde:</span>
            <DatePickerInput
              onChange={jsDate => this.onChange(jsDate, 'from')}
              value={this.state.firstDate}
              className="my-custom-datepicker-component"
            />
          </div>
          <div className="inputContainer">
            <span>Hasta:</span>
            <DatePickerInput
              onChange={jsDate => this.onChange(jsDate, 'to')}
              value={this.state.date}
              className="my-custom-datepicker-component"
            />
          </div>
          <div className="inputContainer">
            <span>Pais:</span>
            <input />
            Agregar
          </div>
          <div className="inputContainer">
            <span>Ciudad:</span>
            <input />
            Agregar
          </div>
        </div>
        <div className="rowReports">
          <div className="itemReports">
            <h3>Ecuador</h3>
            <div className="contentReportMap">
              <Chart
                width={'400px'}
                height={'247px'}
                chartType="GeoChart"
                data={[
                  ['Country', 'Orders'],
                  ['Mexico', 300],
                  ['Ecuador', 500],
                ]}
                options={{
                  region: 'EC',
                  colorAxis: { colors: ['#ccefb6', '#368900'] },
                  datalessRegionColor: '#fcd3a2',
                  defaultColor: '#f5f5f5',
                }}
                // Note: you will need to get a mapsApiKey for your project.
                // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
                mapsApiKey="YOUR_KEY_HERE"
                rootProps={{ 'data-testid': '1' }}
              />
            </div>
          </div>
          <div className="itemReports">
            <h3>Mexico</h3>
            <div className="contentReportMap">
              <Chart
                width={'400px'}
                height={'247px'}
                chartType="GeoChart"
                data={[['Country', 'Orders'], ['Mexico', 50], ['Ecuador', 500]]}
                options={{
                  region: 'MX',
                  colorAxis: { colors: ['#ccefb6', '#368900'] },
                  datalessRegionColor: '#fcd3a2',
                  defaultColor: '#f5f5f5',
                }}
                // Note: you will need to get a mapsApiKey for your project.
                // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
                mapsApiKey="YOUR_KEY_HERE"
                rootProps={{ 'data-testid': '1' }}
              />
            </div>
          </div>
          <div className="itemReports">
            <h3>Peru</h3>
            <div className="contentReportMap">
              <Chart
                width={'400px'}
                height={'247px'}
                chartType="GeoChart"
                data={[
                  ['Country', 'Orders'],
                  ['Mexico', 300],
                  ['Peru', 400],
                  ['Ecuador', 500],
                ]}
                options={{
                  region: 'PE',
                  colorAxis: { colors: ['#ccefb6', '#368900'] },
                  datalessRegionColor: '#fcd3a2',
                  defaultColor: '#f5f5f5',
                }}
                // Note: you will need to get a mapsApiKey for your project.
                // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
                mapsApiKey="YOUR_KEY_HERE"
                rootProps={{ 'data-testid': '1' }}
              />
            </div>
          </div>
        </div>
        <div className="rowReports">
          <div className="itemReports">
            <h3>Charts</h3>
            <div className="contentReport">
              <Chart
                width={'700px'}
                height={'400px'}
                chartType="Bar"
                loader={<div>Loading Chart</div>}
                data={[
                  [
                    'Mes',
                    'SOS',
                    'Acompañamiento Seguro',
                    'Asistencia Vial',
                    'Asistencia de hogar',
                    'Operador',
                  ],
                  ['Enero 2019', 1000, 400, 200, 1000, 400],
                  ['Febrero 2019', 1170, 460, 250, 1000, 400],
                  ['Marzo 2019', 660, 1120, 300, 1000, 400],
                ]}
                options={{
                  // Material design options
                  chart: {
                    title: 'Ordenes por categoria',
                  },
                }}
                // For tests
                rootProps={{ 'data-testid': '2' }}
              />
            </div>
            <div className="contentReport">
              <Chart
                width={'700px'}
                height={'400px'}
                chartType="Bar"
                loader={<div>Loading Chart</div>}
                data={[
                  [
                    'Mes',
                    'SOS',
                    'Acompañamiento Seguro',
                    'Asistencia Vial',
                    'Asistencia de hogar',
                    'Operador',
                  ],
                  ['Enero 2019', 1, 2, 3, 4, 5],
                  ['Febrero 2019', 3, 4, 2, 3, 2],
                  ['Marzo 2019', 3, 3, 4, 5, 3],
                ]}
                options={{
                  // Material design options
                  chart: {
                    title: 'Promedio satisfaccion cliente - Rate',
                  },
                }}
                // For tests
                rootProps={{ 'data-testid': '2' }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
