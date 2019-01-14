import React, { Component } from 'react'
import { getUser, logout } from '../services/auth'
import { Link } from 'gatsby'

import axios from 'axios'

import vialIcon from '../images/car.svg'
import defaultIcon from '../images/default.svg'
import arrowDownIcon from '../images/arrow-down.svg'
import { askForPermissioToReceiveNotifications } from '../services/push-notification'
import { ToastContainer, toast } from 'react-toastify'

import Modal from './modal'
import Task from './Task'

import 'react-toastify/dist/ReactToastify.css'
import '../assets/css/board.css'

export default class Board extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tasks: [],
      showModal: false,
      curTask: [],
    }
  }

  async componentDidMount() {
    //Tasks
    await this.getMyTasks()

    //Push Notifications
    const messaging = await askForPermissioToReceiveNotifications()
    const context = this
    messaging.onMessage(function(payload) {
      console.log('Frond Message received. ', payload)
      context.getMyTasks()
      context.MsmNewTask()
    })
    window.addEventListener(
      'focus',
      function(event) {
        console.log('Regresaste ')
        context.getMyTasks()
      },
      false
    )
  }

  //MODAL
  setModal = async id => {
    this.setState({})
    let task = []
    await this.state.tasks.filter(item => {
      if (item.id === id) {
        task.push(item)
      }
      return item
    })
    this.setState({
      curTask: task,
      showModal: !this.state.showModal,
    })
  }

  //ALERTS
  MsmNewTask = () => toast('Tienes una nueva solicitud asignada.')

  //TASKS
  getMyTasks = async () => {
    try {
      const tasks = await axios.post(
        `${process.env.API_URL}/orders/getOrders`,
        {},
        {
          headers: {
            'x-access-token': getUser().token,
          },
        }
      )
      this.setState({
        tasks: tasks.data.tasks,
      })
    } catch (err) {
      console.log(err)
      logout()
    }
    return true
  }
  //BOARD ACTIONS
  onDragOver = ev => {
    ev.preventDefault()
  }
  onDragStart = (ev, id) => {
    ev.dataTransfer.setData('text/plain', id)
  }
  onDrop = async (ev, cat) => {
    let id = ev.dataTransfer.getData('text')
    let idNumber = null
    let tasks = await this.state.tasks.filter(task => {
      if ('id_' + task.id === id) {
        task.status.name = cat
        idNumber = task.id
      }
      return task
    })

    this.setState({
      tasks,
    })

    await axios.post(
      `${process.env.API_URL}/orders/updateStatus`,
      {
        statusName: cat,
        orderId: idNumber,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': getUser().token,
        },
      }
    )
  }
  Delivery = async () => {
    await this.state.tasks.map(async item => {
      if (item.status.name === 'complete') {
        await axios.post(
          `${process.env.API_URL}/orders/updateStatus`,
          {
            statusName: 'delivered',
            orderId: item.id,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': getUser().token,
            },
          }
        )
        this.getMyTasks()
      }
      return item
    })
  }

  render() {
    //TASK STATES
    let tasks = {
      backlog: [],
      asigned: [],
      live: [],
      standby: [],
      notresponse: [],
      complete: [],
    }

    //TASK ITEMS
    this.state.tasks.forEach(t => {
      let icon = defaultIcon
      if (t.service.category === 'vial') {
        icon = vialIcon
      }
      tasks[t.status.name].push(
        <div
          key={t.id}
          onDragStart={e => this.onDragStart(e, 'id_' + t.id)}
          draggable
          className={'draggable task ' + t.cssClasses}
          onClick={e => this.setModal(t.id)}
        >
          <div className="task-header">
            <div className="category-icon">
              <img src={icon} alt={t.service.category} />
            </div>
            <h3>{t.service.name}</h3>
            {getUser().type !== 'operator' ? (
              <div className="operator">
                {t.operator !== null ? (
                  <div>
                    <span>
                      {t.operator.name.charAt(0) +
                        t.operator.lastName.charAt(0)}
                    </span>
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
            ) : (
              ''
            )}
          </div>
          <p className="task-data">
            <b>Cliente:</b> {t.client.name + ' ' + t.client.lastName} <br />
            <b>Proveedor:</b> {t.provider.busnessName} <br />
            <b>Creada el:</b> {t.provider.createdAt} <br />
          </p>
        </div>
      )
    })

    //DASHBOARD
    return (
      <div>
        <div className="Welcome">Bienvenido {getUser().name}</div>
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
              className="notresponse b-row"
              onDragOver={e => this.onDragOver(e)}
              onDrop={e => this.onDrop(e, 'notresponse')}
            >
              <span className="column-header">Sin respuesta</span>
              {tasks.notresponse}
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

            {getUser().type !== 'operator' ? (
              <div className="column-footer">
                <button onClick={this.Delivery}>Entregar Resueltos</button>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
        <ToastContainer />
        {this.state.showModal ? (
          <Modal setModal={this.setModal} showModal={this.state.showModal}>
            <Task task={this.state.curTask} />
          </Modal>
        ) : (
          ''
        )}
      </div>
    )
  }
}
