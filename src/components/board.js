import React, { Component } from 'react'
import { getUser, logout } from '../services/auth'
import { Link } from 'gatsby'

import axios from 'axios'

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
      dragStard: false,
      messagesTask: [],
      notesTask: [
        {
          id: 1,
          contend: 'laksdajsd laks jd',
          name: 'Nicolas Vela',
          type: 'operator',
          date: '00/00/0000 00:00',
        },
        {
          id: 2,
          contend: 'laksdajsd laks jd',
          name: 'Ricardo',
          type: 'supervisor',
          date: '00/00/0000 00:00',
        },
      ],
    }
    this.getMessages = this.getMessages.bind(this)
    this.addMensages = this.addMensages.bind(this)
    this.addNote = this.addNote.bind(this)
  }

  async componentDidMount() {
    //Tasks
    await this.getMyTasks()

    //Push Notifications
    const messaging = await askForPermissioToReceiveNotifications()
    const context = this
    messaging.onMessage(function(payload) {
      console.log('Frond Message received. ', payload)
      const notification = JSON.parse(payload.notification.body)
      if (notification.type === 'chat') {
        context.chatNotifications(notification.orderId)
      } else {
        context.getMyTasks()
        context.MsmNewTask(payload.notification.title)
      }
    })
    window.addEventListener(
      'focus',
      function(event) {
        context.getMyTasks(context.state.curTask)
        if (typeof context.state.curTask[0] !== 'undefined') {
          console.log('entro para traer mensajes')
          context.chatNotifications(context.state.curTask[0].id)
        }
      },
      false
    )
  }
  //ALERTS
  MsmNewTask = title => toast(title)

  //CHAT
  chatNotifications = id => {
    if (typeof this.state.curTask[0] !== 'undefined') {
      if (this.state.curTask[0].id === Number(id)) {
        console.log('Si esta activa')
        this.getMessages(id)
      } else {
        console.log('No esta activa')
        this.notificationMessages(id, 'provider')
      }
    } else {
      console.log('No esta activa')
      this.notificationMessages(id, 'provider')
    }
  }
  //NOTIFICATIONS
  notificationMessages = (id, type) => {
    console.log('entra', { id: id, type: type })
    return ''
  }

  //CHAT
  getMessages = async id => {
    const messages = await axios.post(
      `${process.env.API_URL}/getMessages`,
      {
        orderId: id,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': getUser().token,
        },
      }
    )
    this.setState({
      messagesTask: messages.data,
    })
    return messages
  }
  addMensages = (msm, type) => {
    let { messagesTask } = this.state
    messagesTask[type].push(msm)
    this.setState({
      messagesTask,
    })
  }
  //NOTES
  addNote = async msm => {
    let { notesTask } = this.state
    notesTask.push(msm)
    this.setState({
      notesTask,
    })
    return notesTask
  }
  //MODAL
  setModal = async id => {
    let task = []
    await this.state.tasks.filter(item => {
      if (item.id === id) {
        task.push(item)
      }
      return item
    })

    await this.getMessages(task[0].id)

    this.setState({
      curTask: task,
      showModal: true,
    })
  }
  closeModal = () => {
    this.setState({
      curTask: [],
      showModal: false,
    })
  }

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
      console.log(tasks)
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
    this.setState({
      dragStard: true,
    })
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
      dragStard: false,
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
        try {
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
        } catch (err) {
          console.log(err)
        }
      }
      return await item
    })

    return
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
      let icon = t.service.categories.name
      icon =
        icon
          .toString()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w]+/g, '')
          .replace(/^-+/, '')
          .replace(/-+$/, '') + '.svg'

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
              <img
                src={require('../images/' + icon)}
                alt={t.service.category}
              />
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
      <div className={this.state.dragStard ? 'dragging' : ''}>
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
                <button
                  onClick={() => {
                    this.Delivery()
                  }}
                >
                  Entregar
                </button>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
        <ToastContainer />
        {this.state.showModal ? (
          <Modal closeModal={this.closeModal} showModal={this.state.showModal}>
            <Task
              task={this.state.curTask}
              messagesTask={this.state.messagesTask}
              getMessages={this.getMessages}
              addMensages={this.addMensages}
              addNote={this.addNote}
              notesTask={this.state.notesTask}
            />
          </Modal>
        ) : (
          ''
        )}
      </div>
    )
  }
}
