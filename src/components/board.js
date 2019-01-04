import React, { Component } from 'react'
import '../assets/css/board.css'
import { getUser } from '../services/auth'
import { Link } from 'gatsby'
import axios from 'axios'

import vialIcon from '../images/car.svg'
import defaultIcon from '../images/default.svg'
import arrowDownIcon from '../images/arrow-down.svg'

export default class Board extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tasks: [],
    }
  }
  state = {
    tasks: [
      {
        id: 'uno',
        status: 'backlog',
        service: {
          name: 'Grúa',
          description: '',
          category: 'vial',
          provider: {
            busnessName: 'Taller las lolas',
            description: '',
            rate: '',
            user: {
              email: 'nicolasvelah19@gmail.com',
              id: 11,
              lastName: 'Vela',
              name: 'Nicolás',
              phone: '0996011099',
              type: 'administrator',
            },
          },
        },
        client: {
          name: 'Nicolas',
          lastName: 'Vela',
          idCard: '',
          birthday: '',
          email: '',
          phone: '',
          bloodType: '',
          vehicles: {
            1: {
              brand: '',
              model: '',
              year: '',
              distributor: '',
              color: '',
              vin: '',
              registrationNumber: '',
              insuranceCarrier: {
                name: '',
                broker: '',
                policyNumber: '',
                coverage: '',
                startDatePolicy: '',
                endDatePolicy: '',
              },
            },
          },
        },
        cssClasses: 'vial priority oprator',
        priority: 1,
        comments: {},
        operator: null,
        createAt: '',
        asignetAt: null,
        incorseAt: null,
        closeAt: null,
      },
      {
        id: 'dos',
        status: 'asigned',
        service: {
          name: '',
          description: '',
          category: 'vial',
          provider: {
            busnessName: '',
            description: '',
            rate: '',
            user: {
              email: 'nicolasvelah19@gmail.com',
              id: 11,
              lastName: 'Vela',
              name: 'Nicolás',
              phone: '0996011099',
              type: 'administrator',
            },
          },
        },
        client: {
          name: '',
          lastName: '',
          idCard: '',
          birthday: '',
          email: '',
          phone: '',
          bloodType: '',
          vehicles: {
            1: {
              brand: '',
              model: '',
              year: '',
              distributor: '',
              color: '',
              vin: '',
              registrationNumber: '',
              insuranceCarrier: {
                name: '',
                broker: '',
                policyNumber: '',
                coverage: '',
                startDatePolicy: '',
                endDatePolicy: '',
              },
            },
          },
        },
        cssClasses: 'servicenameslug priority oprator',
        priority: 1,
        comment: {
          0: {
            userName: '',
            userId: 12,
            comment: '',
          },
          1: {
            userName: '',
            userId: 12,
            comment: '',
          },
        },
        operator: {
          email: 'nicolasvelah19@gmail.com',
          id: 12,
          lastName: 'Gela',
          name: 'Vicolás',
          phone: '0996011099',
          type: 'administrator',
        },
      },
      {
        id: 'tres',
        status: 'complete',
        service: {
          name: '',
          description: '',
          category: 'vial',
          provider: {
            busnessName: '',
            description: '',
            rate: '',
            user: {
              email: 'nicolasvelah19@gmail.com',
              id: 11,
              lastName: 'Vela',
              name: 'Nicolás',
              phone: '0996011099',
              type: 'administrator',
            },
          },
        },
        client: {
          name: '',
          lastName: '',
          idCard: '',
          birthday: '',
          email: '',
          phone: '',
          bloodType: '',
          vehicles: {
            1: {
              brand: '',
              model: '',
              year: '',
              distributor: '',
              color: '',
              vin: '',
              registrationNumber: '',
              insuranceCarrier: {
                name: '',
                broker: '',
                policyNumber: '',
                coverage: '',
                startDatePolicy: '',
                endDatePolicy: '',
              },
            },
          },
        },
        cssClasses: 'servicenameslug priority oprator',
        priority: 1,
        comment: {
          0: {
            userName: '',
            userId: 12,
            comment: '',
          },
          1: {
            userName: '',
            userId: 12,
            comment: '',
          },
        },
        operator: {
          email: 'nicolasvelah19@gmail.com',
          id: 12,
          lastName: 'Vela',
          name: 'Nicolás',
          phone: '0996011099',
          type: 'administrator',
        },
      },
    ],
  }
  componentDidMount() {
    this.getMyTasks()
  }
  getMyTasks = async () => {
    const tasks = await axios.post(
      `${process.env.API_URL}/getOrders`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': getUser().token,
        },
      }
    )
    this.setState({
      tasks: tasks,
    })
  }
  onDragOver = ev => {
    ev.preventDefault()
  }
  onDragStart = (ev, id) => {
    ev.dataTransfer.setData('text/plain', id)
  }
  onDrop = (ev, cat) => {
    let id = ev.dataTransfer.getData('text')
    let tasks = this.state.tasks.filter(task => {
      if (task.id === id) {
        task.status = cat
      }
      return task
    })
    this.setState({
      ...this.state,
      tasks,
    })
  }
  render() {
    console.log(this.state.tasks)
    var tasks = {
      backlog: [],
      asigned: [],
      live: [],
      standby: [],
      complete: [],
    }
    this.state.tasks.forEach(t => {
      let printTask = true
      if (t.operator !== null) {
        if (getUser().type === 'operator' && getUser().id !== t.operator.id) {
          printTask = false
        }
      }
      if (printTask) {
        let icon = defaultIcon
        if (t.service.category === 'vial') {
          icon = vialIcon
        }
        tasks[t.status].push(
          <div
            key={t.id}
            onDragStart={e => this.onDragStart(e, t.id)}
            draggable
            className={'draggable task ' + t.cssClasses}
          >
            <div className="task-header">
              <div className="category-icon">
                <img src={icon} alt={t.service.category} />
              </div>
              <h3>{t.service.category}</h3>
              <div className="operator">
                {t.operator !== null ? (
                  <div>
                    {t.operator.name.charAt(0) + t.operator.lastName.charAt(0)}
                    <div className="dropdownOperatorData">
                      <b>Nombre:</b>{' '}
                      {t.operator.name + ' ' + t.operator.lastName} <br />
                      <b>Email:</b> {t.operator.email} <br />
                      <b>Teléfono:</b> {t.operator.phone}
                      <br />
                      <b>Tipo:</b> {t.operator.type}
                      <br />
                    </div>
                  </div>
                ) : (
                  <Link to="" className="btn-nbg">
                    Asignar <img src={arrowDownIcon} alt="Asignar" />
                  </Link>
                )}
              </div>
            </div>
            <p className="task-data">
              <b>Servicio:</b> {t.service.name} <br />
              <b>Cliente:</b> {t.client.name + ' ' + t.client.lastName} <br />
              <b>Proveedor:</b> {t.service.provider.busnessName} <br />
            </p>
            <div className="task-footer">p</div>
          </div>
        )
      }
    })
    return (
      <div className="board">
        {getUser().type !== 'operator' ? (
          <div
            className="backlog b-column"
            onDragOver={e => this.onDragOver(e)}
            onDrop={e => {
              this.onDrop(e, 'backlog')
            }}
          >
            <span className="column-header">Backlog</span>
            {tasks.backlog}
          </div>
        ) : (
          <div />
        )}
        <div
          className="asigned b-column"
          onDragOver={e => this.onDragOver(e)}
          onDrop={e => this.onDrop(e, 'asigned')}
          style={getUser().type === 'operator' ? { width: '31%' } : {}}
        >
          <span className="column-header">Asignados</span>
          {tasks.asigned}
        </div>
        <div
          className="incurse  b-column"
          style={getUser().type === 'operator' ? { width: '31%' } : {}}
        >
          <span className="column-header">En curso</span>
          <div
            className="live b-row"
            onDragOver={e => this.onDragOver(e)}
            onDrop={e => this.onDrop(e, 'live')}
          >
            <span className="column-header">En Vivo</span>
            {tasks.live}
          </div>
          <div
            className="standby b-row"
            onDragOver={e => this.onDragOver(e)}
            onDrop={e => this.onDrop(e, 'standby')}
          >
            <span className="column-header">En espera</span>
            {tasks.standby}
          </div>
          <div
            className="standby b-row"
            onDragOver={e => this.onDragOver(e)}
            onDrop={e => this.onDrop(e, 'standby')}
          >
            <span className="column-header">Sin respuesta</span>
            {tasks.standby}
          </div>
        </div>
        <div
          className="complete b-column"
          onDragOver={e => this.onDragOver(e)}
          onDrop={e => this.onDrop(e, 'complete')}
          style={getUser().type === 'operator' ? { width: '31%' } : {}}
        >
          <span className="column-header">Resueltos</span>
          {tasks.complete}
        </div>
      </div>
    )
  }
}
