import React, { Component } from 'react'
import { getUser, logout } from '../services/auth'
import { navigate } from 'gatsby'

import axios from 'axios'

import notifications from '../images/notifications_none.svg'
import { askForPermissioToReceiveNotifications } from '../services/push-notification'
import { ToastContainer, toast } from 'react-toastify'

import Task911 from './Task911'

import 'react-toastify/dist/ReactToastify.css'
import '../assets/css/911board.css'

export default class Board extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tasks: [],
      curTask: [],
      messagesTask: [],
    }
    this.getMessages = this.getMessages.bind(this)
    this.addMensages = this.addMensages.bind(this)
    this.getMyTasks = this.getMyTasks.bind(this)
  }

  async componentDidMount() {
    if (getUser().type !== '911') {
      navigate(`/app/board`)
    }
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
        if (notification.type !== 'updateOrder') {
          context.MsmNewTask(payload.notification.title)
        }
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
    document.getElementById('taskid_' + id).classList.add('haveNotification')
    document.getElementById('taskid_' + id).classList.add('not_' + type)
    return ''
  }
  notificationOff = (id, type) => {
    document.getElementById('taskid_' + id).classList.remove('haveNotification')
    document.getElementById('taskid_' + id).classList.remove('not_' + type)
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
    console.log('messages ------------- ', messages)
    this.setState({
      messagesTask: messages.data,
    })
    return messages
  }
  addMensages = (msm, type) => {
    console.log(type)
    let { messagesTask } = this.state
    messagesTask[type].push(msm)
    this.setState({
      messagesTask,
    })
  }
  //CONTENT
  setContent = async id => {
    let task = []
    await this.state.tasks.filter(item => {
      if (item.id === id) {
        task.push(item)
      }
      return item
    })

    await this.getMessages(task[0].id)
    this.notificationOff(task[0].id, 'provider')
    this.setState({
      curTask: task,
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
      console.log('tasks', tasks.data.tasks)
      this.setState({
        tasks: tasks.data.tasks,
      })
    } catch (err) {
      console.log(err)
      logout()
    }
    return true
  }

  render() {
    //TASK STATES
    let tasks = {
      asigned: [],
    }

    //TASK ITEMS
    this.state.tasks
      .sort(function(a, b) {
        return b.priority - a.priority
      })
      .map(t => {
        tasks['asigned'].push(
          <div
            key={t.id}
            onClick={e => this.setContent(t.id)}
            id={'taskid_' + t.id}
            className="task911ListItem"
          >
            <div className="task-header">
              <div className="category-icon">
                <img
                  src={require('../images/sos.svg')}
                  alt={t.service.category}
                />
              </div>
              <h3>{t.service.name}</h3>
            </div>
            <p className="task-data">
              <b>Cliente:</b> {t.client.name + ' ' + t.client.lastName} <br />
              <b>Creada el:</b> {t.createdAt} <br />
            </p>
            <div className="task-footer">
              <img
                src={notifications}
                alt="notifications"
                className="notificationIcon notOperator"
              />
            </div>
          </div>
        )
        return true
      })

    //DASHBOARD
    return (
      <div>
        <div className="Welcome">Bienvenido {getUser().name}</div>
        <div className="container911">
          <div className="board911">
            <div className="b-column-911">
              <span className="column-header">Emergencias asignadas</span>
              {tasks.asigned}
            </div>
          </div>
          <div className="task911">
            <Task911
              task={this.state.curTask}
              messagesTask={this.state.messagesTask}
              getMessages={this.getMessages}
              addMensages={this.addMensages}
              getMyTasks={this.getMyTasks}
              setContent={this.setContent}
            />
          </div>
        </div>
        <ToastContainer />
      </div>
    )
  }
}
