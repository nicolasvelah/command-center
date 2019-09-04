import React, { Component } from 'react'
import Chart from 'react-google-charts'
import moment from 'moment'
import { DatePickerInput } from 'rc-datepicker'
//import { getUser } from '../services/auth'
import { getChartsByService } from '../../services/reportData'
import Loading from '../Tools/Loading'

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
      chartDataByService: null,
      chartDataByServiceResult: [],
    }
  }
  async componentDidMount() {
    await this.getChartsByService()
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
    await this.getChartsByService()
    return true
  }
  getChartsByService = async () => {
    const data = await getChartsByService(
      this.state.firstDate,
      this.state.date,
      'month'
    )
    this.setState({
      chartDataByService: data.data.report,
    })

    let getChartsByServiceByMonth = []
    let services = []
    this.state.chartDataByService.map(item => {
      const currItem = {
        Count: item.Count,
        service: item.service.name,
        date: item.createdAt, //moment(item.createdAt).format('DD MM YY'),
      }
      if (services.indexOf(item.service.name) === -1) {
        services.push(item.service.name)
      }
      if (!(currItem.date in getChartsByServiceByMonth)) {
        getChartsByServiceByMonth[currItem.date] = [currItem]
      } else {
        getChartsByServiceByMonth[currItem.date].push(currItem)
      }
      return item
    })
    services = services.sort()

    let chartResult = []

    Object.keys(getChartsByServiceByMonth).map((date, index) => {
      let countPass = 0
      //console.log('key date*****************************************', date)

      getChartsByServiceByMonth[date].map(indexData => {
        /*console.log(
          'indexData------------------------------------------------',
          indexData
        )*/
        services.map((service, indexService) => {
          let keyPass = false
          if (countPass === 0) {
            keyPass = true
          }

          if (indexData.service === service) {
            if (keyPass) {
              if (chartResult[index]) {
                chartResult[index].push(Number(indexData.Count))
              } else {
                chartResult[index] = [Number(indexData.Count)]
              }
            } else {
              chartResult[index][indexService] = Number(indexData.Count)
            }
          } else if (keyPass) {
            if (chartResult[index]) {
              chartResult[index].push(0)
            } else {
              chartResult[index] = [0]
            }
          }

          return service
        })
        if (countPass === getChartsByServiceByMonth[date].length - 1) {
          chartResult[index].unshift(date)
        }
        countPass++

        return indexData
      })
      return date
    })

    services.unshift('Mes')

    chartResult = chartResult
      .sort((a, b) => {
        return new Date(a[0]) - new Date(b[0])
      })
      .map(item => {
        item[0] = moment(item[0]).format('MMMM YYYY')
        return item
      })

    chartResult.unshift(services)
    this.setState({
      chartDataByServiceResult: chartResult,
    })
    //console.log('chartDataByServiceResult', this.state.chartDataByServiceResult)
  }

  render() {
    return (
      <div className="reports">
        <h1>Monitoreo</h1>
        {/*<div className="filters">
          Pais / Ciudad / Todo --- Mensual / Semana / Anual --- Por categoria /
          Por servicio --- Por estado de la orden y tiempo --- zona vs pedidos y
          cantidad de proveedores --- SOS tipo de siniestros (Muertos - Heridos
          - Rescatados) Para esto hey que vor como se recolecta esta data en la
          orden desde cc.
          </div>*/}
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
        </div>
        {/*<div className="rowReports">
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
              </div>*/}
        <div className="rowReports">
          <div className="itemReports">
            <div className="contentReport">
              {this.state.chartDataByServiceResult.length > 0 ? (
                <Chart
                  graphID="chartByService"
                  width={'700px'}
                  height={'600px'}
                  chartType="Bar"
                  loader={<Loading />}
                  data={this.state.chartDataByServiceResult}
                  options={{
                    chart: {
                      title: 'Órdenes por Servicios',
                      subtitle: 'Número de órdenes por servicio y por mes',
                    },
                    chartArea: {
                      width: '85%',
                      height: '85%',
                    },
                    legend: {
                      position: 'top',
                    },
                    enableInteractivity: false,
                  }}
                  rootProps={{ 'data-testid': '1' }}
                />
              ) : null}
            </div>
            {/*<div className="contentReport">
              <Chart
                width={'700px'}
                height={'400px'}
                chartType="Bar"
                loader={
                  <div>
                    <Loading />
                  </div>
                }
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
              </div>*/}
          </div>
        </div>
      </div>
    )
  }
}
