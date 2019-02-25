import React, { Component } from 'react'
import axios from 'axios'
import { getUser } from '../services/auth'
//import Chart from 'react-google-charts'
import '../assets/css/operators.css'
import flag from '../images/flag.svg'
import star from '../images/star-full.svg'

export default class Operators extends Component {
  constructor(props) {
    super(props)
    this.state = {
      operators: [],
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
    let { operators } = this.state
    operators = await operators.map(async item => {
      try {
        const data = await axios.post(
          `${process.env.API_URL}/getOperatorsTasks/` + item.id,
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
        return item
      } catch (err) {
        console.log(err.message)
        return 'error'
      }
    })
    operators = await Promise.all(operators)

    console.log('data.data.users XXXXXX operators', operators)
    this.setState({ operators })

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
              </div>
            </div>
          ))}
        </div>
        {/* <div className="operatorsCharts">
          <h2>Reportes de rendimiento</h2>
          <Chart
            width={'500px'}
            height={'300px'}
            chartType="Bar"
            loader={<div>Loading Chart</div>}
            data={[
              ['Year', 'Sales', 'Expenses', 'Profit'],
              ['2014', 1000, 400, 200],
              ['2015', 1170, 460, 250],
              ['2016', 660, 1120, 300],
              ['2017', 1030, 540, 350],
            ]}
            options={{
              // Material design options
              chart: {
                title: 'Company Performance',
                subtitle: 'Sales, Expenses, and Profit: 2014-2017',
              },
            }}
            // For tests
            rootProps={{ 'data-testid': '2' }}
          />
          </div>*/}
      </div>
    )
  }
}
