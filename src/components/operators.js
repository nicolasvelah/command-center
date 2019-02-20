import React, { Component } from 'react'
import axios from 'axios'
import { getUser } from '../services/auth'
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

  componentDidMount() {
    this.getOperators()
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
      this.setState({ operators: data.data.users })
      return data
    } catch (err) {
      console.log(err.message)
      return []
    }
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
                <div className="operatorsTasks">
                  <div>
                    <b>Asignadas:</b> 0
                  </div>
                  <div>
                    <b>En curso:</b> 0
                  </div>
                  <div>
                    <b>Resueltos:</b> 0
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}
