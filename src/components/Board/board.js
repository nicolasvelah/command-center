import React, { Component } from 'react'
import { getUser, logout, isLoggedIn, logoutLocal } from '../../services/auth'
import { navigate } from 'gatsby'

import axios from 'axios'

import { askForPermissioToReceiveNotifications } from '../../services/push-notification'
import { ToastContainer, toast } from 'react-toastify'
import TaskItem from './TaskItem'
import ChatContainer from './ChatContainer'
import { save, get } from '../../services/Storage'

import Modal from '../Tools/modal'
import Filter from './Filter'

import 'react-toastify/dist/ReactToastify.css'
import '../../assets/css/board.css'

export default class Board extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tasks: [],
      showModal: false,
      curTask: [],
      dragStard: false,
      messagesTask: [],
      filterOption: '',
      notesTask: [],
      chageProviderVal: false,
      filterByoperator: null,
      operators: [],
      providerState: '',
      messaging: null,
      idClick: null,
      activeTasks: [],
    }
    this.getMessages = this.getMessages.bind(this)
    this.getNotes = this.getNotes.bind(this)
    this.chageProvider = this.chageProvider.bind(this)
    this.addMensages = this.addMensages.bind(this)
    this.addNote = this.addNote.bind(this)
    this.getMyTasks = this.getMyTasks.bind(this)
    this.getOperators = this.getOperators.bind(this)
    this.update911state = this.update911state.bind(this)
    this.updateLocalTask = this.updateLocalTask.bind(this)
    this.onDragStart = this.onDragStart.bind(this)
    this.activateTask = this.activateTask.bind(this)
  }

  async componentDidMount() {
    this._ismounted = true
    if (getUser().type === '911') {
      navigate(`/app/911`)
    } else if (getUser().type === 'provider') {
      logout()
    }
    //Tasks
    console.log('init traer ordenes en did mount ')
    await this.getMyTasks()

    //Push Notifications
    const messaging = await askForPermissioToReceiveNotifications()
    const context = this
    if (messaging !== false) {
      this.startNotifications(messaging)
    } else {
      const messaging2 = await askForPermissioToReceiveNotifications()
      this.startNotifications(messaging2)
    }
    window.addEventListener(
      'focus',
      function(event) {
        if (isLoggedIn()) {
          context.getMyTasks(context.state.curTask)
          if (typeof context.state.curTask[0] !== 'undefined') {
            console.log('entro para traer mensajes')
            context.chatNotifications(context.state.curTask[0].id)
          }
        }
      },
      false
    )
    //OPERADORES
    if (getUser().type !== 'operator') {
      this.getOperators()
    }
    console.log('GET   ---====', get('activeTasks'))
    await this.setState({
      activeTasks: get('activeTasks'),
    })
  }
  startNotifications(messaging) {
    const context = this
    messaging.onMessage(function(payload) {
      console.log('Frond Message received.', payload)
      const notification = JSON.parse(payload.data.content)
      if (notification.type === 'chat') {
        context.chatNotifications(notification.orderId)
      } else if (
        notification.type === 'WORKINPROGRESS' ||
        notification.type === 'WORKFINISHED'
      ) {
        context.providerState(notification.orderId, notification.type)
      } else {
        context.getMyTasks()
        if (notification.type !== 'updateOrder') {
          context.MsmNewTask(payload.data.title)
        }
      }
    })
  }

  componentWillUnmount() {
    this._ismounted = false
  }
  chageProvider = () => {
    this.setState({
      chageProviderVal: true,
    })
  }
  //ALERTS
  MsmNewTask = title => toast(title)
  //WORKSTATES
  providerState = (id, type) => {
    const { tasks } = this.state
    var index = tasks
      .map(function(x) {
        return x.id
      })
      .indexOf(id)
    console.log('tasks[index]', tasks[index])

    if (type === 'WORKINPROGRESS' || type === 'STARTED') {
      type = 'wip'
      tasks[index].appStatus = 'STARTED'
      if (tasks[index].status.name === 'asigned') {
        tasks[index].status.name = 'standby'
      }
    } else if (type === 'WORKFINISHED' || type === 'FINISHED') {
      type = 'wf'
      tasks[index].appStatus = 'FINISHED'
    }

    document.getElementById('taskid_' + id).classList.add(type)

    this.setState({
      providerState: 'WIP',
      tasks,
    })
  }

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

    const nodeValue = document
      .getElementById('taskid_' + id)
      .getElementsByClassName('notificationNumber')
    if (nodeValue.length > 0) {
      const numberMsm = Number(nodeValue[0].innerHTML) + 1
      nodeValue[0].innerHTML = numberMsm
    }
    return ''
  }
  notificationOff = (id, type) => {
    document.getElementById('taskid_' + id).classList.remove('haveNotification')
    document.getElementById('taskid_' + id).classList.remove('not_' + type)
    const nodeValue = document
      .getElementById('taskid_' + id)
      .getElementsByClassName('notificationNumber')
    if (nodeValue.length > 0) {
      nodeValue[0].innerHTML = 0
    }
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
    await this.setState({
      messagesTask: messages.data,
    })
    return messages
  }
  addMensages = (msm, type) => {
    let { messagesTask } = this.state
    console.log('messagesTask ', messagesTask)
    messagesTask[type].push(msm)
    this.setState({
      messagesTask,
    })
  }
  //NOTES
  getNotes = async id => {
    const notes = await axios.post(
      `${process.env.API_URL}/orders/getNotes`,
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
      notesTask: notes.data.notes,
    })
    return notes
  }
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
    await this.getNotes(task[0].id)

    this.notificationOff(task[0].id, 'provider')
    this.setState({
      curTask: task,
      showModal: true,
      chageProviderVal: false,
    })
  }

  activateTask = async id => {
    try {
      const { activeTasks } = this.state

      let includesThis = false
      activeTasks.filter(item => {
        if (item.task.id === id) {
          includesThis = true
        }
        return item
      })

      if (!includesThis) {
        let task = null
        await this.state.tasks.filter(item => {
          if (item.id === id) {
            task = item
          }
          return item
        })

        activeTasks.push({ task })

        save('activeTasks', activeTasks)

        this.setState({
          activeTasks,
        })

        console.log('activeTasks ------------', activeTasks)

        await this.getMessages(task.id)
        await this.getNotes(task.id)

        //this.notificationOff(task.id, 'provider')
      }
    } catch (err) {
      console.log('error', err.message)
    }
  }
  updateChatState = async orderId => {
    try {
      await axios.post(
        `${process.env.API_URL}/updateChatState/` + orderId,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': getUser().token,
          },
        }
      )
      console.log('Exito en updateChatState')
    } catch (error) {
      console.log('Error en updateChatState', error.message)
    }
    return
  }
  update911state = async id => {
    console.log('id del 911 user:', id)
    let { tasks, curTask } = this.state
    await tasks.map((item, index) => {
      if (item.id === curTask[0].id) {
        tasks[index].assignedTo_911 = id
      }
      return item
    })
    curTask[0].assignedTo_911 = id
    this.setState({
      tasks,
      curTask,
    })
  }
  closeModal = async () => {
    await this.updateChatState(this.state.curTask[0].id)
    this.setState({
      curTask: [],
      showModal: false,
    })
  }

  //TASKS
  getMyTasks = async () => {
    console.log('init traer ordenes')
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
      var CryptoJS = require('crypto-js')
      let decryptedData = CryptoJS.AES.decrypt(
        tasks.data,
        process.env.CRYPTO_SECRET
      ).toString(CryptoJS.enc.Utf8)
      decryptedData = JSON.parse(decryptedData)
      console.log('tasks ', decryptedData)
      if (this._ismounted) {
        this.setState({
          tasks: decryptedData.tasks,
        })
      }
    } catch (err) {
      console.log(err)
      logoutLocal()
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
  updateLocalTask = async (id, cat) => {
    console.log('local update cat -----------', cat)
    console.log('local update id -----------', id)
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

    return idNumber
  }
  onDrop = async (ev, cat) => {
    ev.preventDefault()
    let id = ev.dataTransfer.getData('text')

    const idNumber = await this.updateLocalTask(id, cat)

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
  handleFilterChange = option => {
    if (option) {
      this.setState({ filterOption: option.value })
    } else {
      this.setState({ filterOption: '' })
    }
  }
  handleFilterOperatorChange = option => {
    console.log('Dio click: ', option)

    if (option) {
      this.setState({ filterByoperator: option })
      this.setState({ idClick: option })
    } else {
      this.setState({ filterByoperator: null })
      this.setState({ idClick: null })
    }
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
    const context = this
    this.state.tasks
      .sort(function(a, b) {
        return b.priority - a.priority
      })
      .filter(function(c) {
        if (context.state.filterByoperator !== null) {
          return c.operator.id === context.state.filterByoperator
        }
        return c
      })
      .map(t => {
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
          <TaskItem
            key={t.id}
            icon={icon}
            t={t}
            onDragStart={this.onDragStart}
            activateTask={this.activateTask}
          />
        )
        return true
      })

    //DASHBOARD
    return (
      <div className={this.state.dragStard ? 'dragging' : ''}>
        <div className="Welcome">Bienvenido {getUser().name}</div>

        {getUser().type !== 'operator' ? (
          <Filter
            filterOption={this.state.filterOption}
            onFilterChange={this.handleFilterChange}
            handleFilterOperatorChange={this.handleFilterOperatorChange}
            operators={this.state.operators}
            idClick={this.state.idClick}
          />
        ) : (
          ''
        )}
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
              <span className="column-header">Work in progress</span>
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
        <div className="chatsBar">
          {this.state.activeTasks.map(item => (
            <ChatContainer item={item.task} key={item.task.id} />
          ))}
        </div>
        <ToastContainer />
        {this.state.showModal ? (
          <Modal closeModal={this.closeModal} showModal={this.state.showModal}>
            {/*<Task
              task={this.state.curTask}
              messagesTask={this.state.messagesTask}
              getMessages={this.getMessages}
              addMensages={this.addMensages}
              addNote={this.addNote}
              notesTask={this.state.notesTask}
              getMyTasks={this.getMyTasks}
              setModal={this.setModal}
              getNotes={this.getNotes}
              chageProvider={this.chageProvider}
              chageProviderVal={this.state.chageProviderVal}
              update911state={this.update911state}
              updateLocalTask={this.updateLocalTask}
            />*/}
          </Modal>
        ) : (
          ''
        )}
      </div>
    )
  }
}
