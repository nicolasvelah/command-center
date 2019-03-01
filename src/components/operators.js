import React, { Component } from 'react'
import axios from 'axios'
import { getUser } from '../services/auth'
import Chart from 'react-google-charts'
import '../assets/css/operators.css'
import flag from '../images/flag.svg'
import star from '../images/star-full.svg'

export default class Operators extends Component {
  constructor(props) {
    super(props)
    this.state = {
      operators: [],
      totalTasks: [],
    }
  }

  async componentDidMount() {
    await this.getOperators()
  }
  //OPERATORS
  getOperators = async () => {
    try {
      const data = await axios.post(
        `${process.env.API_URL}/getOperators`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': getUser().token,
          },
        }
      )
      console.log('data.data.users XXXXXX', data.data.users)
      await this.setState({ operators: data.data.users })
      this.getOperatorsTasks()

      return data
    } catch (err) {
      console.log(err.message)
      return []
    }
  }
  getOperatorsTasks = async () => {
    let { operators, totalTasks } = this.state
    totalTasks = [{ asignet: 0, incourse: 0, resolve: 0, total: 0 }]
    operators = await operators.map(async item => {
      try {
        const data = await axios.post(
          `${process.env.API_URL}/getOperatorsOrdersCount/` + item.id,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': getUser().token,
            },
          }
        )
        console.log('getOperatorsTasks: ', data.data)
        item.tasks = data.data.tasks

        totalTasks[0].asignet = totalTasks[0].asignet + item.tasks.asignet
        totalTasks[0].incourse = totalTasks[0].incourse + item.tasks.incourse
        totalTasks[0].resolve = totalTasks[0].resolve + item.tasks.resolve
        totalTasks[0].total = totalTasks[0].total + item.tasks.total

        return item
      } catch (err) {
        console.log(err.message)
        return 'error'
      }
    })
    console.log('totalTasks', totalTasks)
    operators = await Promise.all(operators)

    console.log('data.data.users XXXXXX operators', operators)
    this.setState({ operators, totalTasks })

    return operators
  }
  render() {
    return (
      <div>
        <h2 className="operatorsTitle">Mi Equipo</h2>
        <div className="operatorsPage">
          {this.state.operators.map(operator => (
            <div key={operator.id} className="operatorPage">
              <div className="headerOperator">
                <div className="icon">
                  {operator.type === 'supervisor' ? (
                    <div className="parendDropDown">
                      <img src={star} alt="" className="teamLeader" />
                      <div className="dropDown">Lider</div>
                    </div>
                  ) : (
                    ''
                  )}
                  {getUser().email === operator.email ? (
                    <div className="parendDropDown">
                      <img src={flag} alt="" className="teamLeader" />
                      <div className="dropDown">Yo</div>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                <b>{operator.name + ' ' + operator.lastName}</b>
              </div>
              <div className="dataRest">
                <b>Email:</b> {operator.email} <br />
                <b>Teléfono:</b> {operator.phone}
                <br />
                <b>Ordenes:</b>
                <br />
                <div className="operatorsTasks">
                  <div className="taskCounter asignCounter">
                    <div className="taskCounterHead">Asignadas</div>{' '}
                    <div className="taskCounterNumber">
                      {operator.tasks ? operator.tasks.asignet : '0'}
                    </div>
                  </div>
                  <div className="taskCounter incourseCounter">
                    <div className="taskCounterHead">En curso</div>{' '}
                    <div className="taskCounterNumber">
                      {operator.tasks ? operator.tasks.incourse : '0'}
                    </div>
                  </div>
                  <div className="taskCounter resolveCounter">
                    <div className="taskCounterHead">Resueltas</div>{' '}
                    <div className="taskCounterNumber">
                      {operator.tasks ? operator.tasks.resolve : '0'}
                    </div>
                  </div>
                  <div className="taskCounter totalCounter">
                    <div className="taskCounterHead">Total / mes</div>{' '}
                    <div className="taskCounterNumber">
                      {operator.tasks ? operator.tasks.total : '0'}
                    </div>
                  </div>
                </div>
                <div className="operatorGraph">
                  <Chart
                    width={'280px'}
                    height={'200px'}
                    chartType="PieChart"
                    loader={<div>Loading Chart</div>}
                    data={[
                      ['Tareas', 'Cantidad'],
                      [
                        'Asignados',
                        operator.tasks ? operator.tasks.asignet : 0,
                      ],
                      [
                        'En Curso',
                        operator.tasks ? operator.tasks.incourse : 0,
                      ],
                      [
                        'Resueltos',
                        operator.tasks ? operator.tasks.resolve : 0,
                      ],
                    ]}
                    options={{
                      title: 'Tablero de Ordenes',
                      pieHole: 0.2,
                      colors: ['#af2d0e', '#ffc200', '#167711'],
                    }}
                    rootProps={{ 'data-testid': '1' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="operatorsCharts">
          <h2>Reportes de rendimiento</h2>
          <div className="totales">
            Asignados:{' '}
            {this.state.totalTasks.length > 0
              ? this.state.totalTasks[0].asignet
              : ''}{' '}
            / En curso:{' '}
            {this.state.totalTasks.length > 0
              ? this.state.totalTasks[0].incourse
              : ''}{' '}
            / Resuelto:{' '}
            {this.state.totalTasks.length > 0
              ? this.state.totalTasks[0].resolve
              : ''}{' '}
            / Total:{' '}
            {this.state.totalTasks.length > 0
              ? this.state.totalTasks[0].total
              : ' '}
          </div>
          {this.state.totalTasks.length > 0 ? (
            <Chart
              width={'500px'}
              height={'300px'}
              chartType="PieChart"
              loader={<div>Loading Chart</div>}
              data={[
                ['Tareas', 'Cantidad'],
                ['Asignados', this.state.totalTasks[0].asignet],
                ['En Curso', this.state.totalTasks[0].incourse],
                ['Resueltos', this.state.totalTasks[0].resolve],
              ]}
              options={{
                title: 'Tablero de Ordenes',
                is3D: true,
              }}
              rootProps={{ 'data-testid': '1' }}
            />
          ) : (
            ''
          )}
        </div>
      </div>
    )
  }
}
