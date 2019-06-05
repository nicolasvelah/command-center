import React, { Component } from 'react'
import { getUser, logout, isLoggedIn, logoutLocal } from '../../services/auth'
import { navigate } from 'gatsby'

import { askForPermissioToReceiveNotifications } from '../../services/push-notification'
import { ToastContainer } from 'react-toastify'
import TaskItem from './TaskItem'
import ChatContainer from './ChatContainer'
import { save, get } from '../../services/Storage'
import { inject, observer } from 'mobx-react'
import {
  operatorsAll,
  MsmNewTask,
  messagesAll,
  notesAll,
  getAllTasks,
  updateStatus,
  updateChatState,
} from '../../services/helpers'
//import Filter from './Filter'
import { conectSocket, updateMapData } from '../../services/wsConect'
import Loading from '../Tools/Loading'

import 'react-toastify/dist/ReactToastify.css'
import '../../assets/css/board.css'
@inject('mapStore')
@observer
class Board extends Component {
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
      openChat: [],
      isLoading: false,
      chatTopPosition: '-37px',
      whoFocusItem: null,
      socket: null,
      globalMapAppID: null,
      globalMapCountry: null,
    }
    this.getNotes = this.getNotes.bind(this)
    this.chageProvider = this.chageProvider.bind(this)
    this.addMensages = this.addMensages.bind(this)
    this.addNote = this.addNote.bind(this)
    this.getOperators = this.getOperators.bind(this)
    this.update911state = this.update911state.bind(this)
    this.updateLocalTask = this.updateLocalTask.bind(this)
    this.onDragStart = this.onDragStart.bind(this)
    this.activateTask = this.activateTask.bind(this)
    this.updateGlobalMapVars = this.updateGlobalMapVars.bind(this)
    this.addRemoveFavorite = this.addRemoveFavorite.bind(this)

    this.RefChatContainer = new Map()
  }

  async componentDidMount() {
    if (getUser().type === '911') {
      navigate(`/app/911`)
    } else if (getUser().type === 'provider') {
      logout()
    }
    const token = await getUser().token
    const userId = await getUser().userId
    let { socket } = this
    socket = await conectSocket(token, userId)

    await this.setState({
      socket,
    })
    //Tasks
    //console.log('init traer ordenes en did mount ')
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
          context.getMyTasks()
          if (typeof context.state.curTask[0] !== 'undefined') {
            //console.log('entro para traer mensajes')
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
    //console.log('GET   ---====', get('activeTasks'))
    await this.setState({
      activeTasks: get('activeTasks'),
    })
  }

  updateGlobalMapVars = async (globalMapAppID, globalMapCountry) => {
    if (globalMapCountry === null && this.state.globalMapCountry !== null) {
      //Este caso se da cuando alguien pone el punto del servicio en lugares remotos como el oceano o la amazonia....
      //Por lo que determino un pais para mantener la coneccion a los web sockets...
      globalMapCountry = this.state.globalMapCountry
    } else if (this.state.globalMapCountry === null) {
      globalMapCountry = 'Ecuador'
    }
    if (
      globalMapCountry !== this.state.globalMapCountry ||
      globalMapAppID !== this.state.globalMapAppID
    ) {
      await this.setState({
        globalMapAppID,
        globalMapCountry,
      })
      await updateMapData(
        this.state.socket,
        this.state.globalMapAppID,
        this.state.globalMapCountry,
        this.props.mapStore
      )
    }
  }
  //FIREBASE NOTIFICATIONS TRIEGER
  startNotifications(messaging) {
    const context = this
    messaging.onMessage(function(payload) {
      if (isLoggedIn()) {
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
            MsmNewTask(payload.data.title)
          }
        }
      }
    })
  }

  //PROVIDER
  chageProvider = () => {
    this.setState({
      chageProviderVal: true,
    })
  }
  providerState = (id, type) => {
    const { tasks } = this.state
    var index = tasks
      .map(function(x) {
        return x.id
      })
      .indexOf(id)
    //console.log('tasks[index]', tasks[index])

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
  chatNotifications = async id => {
    const ExistsInActivatedTasks = await this.checkExistsInActivatedTasks(
      Number(id)
    )

    console.log('ExistsInActivatedTasks.status', ExistsInActivatedTasks)
    if (ExistsInActivatedTasks[0].exist) {
      this.addNewMessage(id)
    } else {
      this.notificationMessages(id, 'provider')
    }
  }
  checkExistsInActivatedTasks = async id => {
    let exist = false
    let status = null
    await this.state.activeTasks.filter(item => {
      if (item.task.id === id) {
        exist = true
        status = item.task.status.name
      }
      return item
    })
    return [{ exist, status }]
  }
  addNewMessage = async id => {
    const messages = await this.getMessages(id)

    let { activeTasks } = this.state
    let task = null
    let chatSelector = 0
    activeTasks = await activeTasks.map(item => {
      if (item.task.id === Number(id)) {
        task = item.task
        if (
          item.task.messagesAll.client.length === messages.data.client.length
        ) {
          chatSelector = 1
        }
        item.task.messagesAll = messages.data
      }
      return item
    })
    await this.setState({ activeTasks })
    await save('activeTasks', activeTasks)
    //console.log('task=========', task)
    if (task.status.name === 'live') {
      let prov = ''
      if (chatSelector === 1) {
        prov = 'prov_'
      }
      var element = document.getElementById('scroll_' + prov + id)
      element.scrollTop = element.scrollHeight - element.clientHeight
    } else {
      this.notificationMessages(id, 'provider')
    }
  }

  whoFocus = id => {
    //console.log('focussssssss', id)
    this.setState({
      whoFocusItem: id,
    })
  }
  //NOTIFICATIONS ICON ALERT CONTROL
  notificationMessages = (id, type) => {
    document.getElementById('taskid_' + id).classList.add('haveNotification')
    document.getElementById('taskid_' + id).classList.add('not_' + type)

    const nodeValue = document
      .getElementById('taskid_' + id)
      .getElementsByClassName('notificationNumber')
    //console.log('nodeValue', nodeValue)
    if (nodeValue.length > 0) {
      const numberMsm = Number(nodeValue[0].innerHTML) + 1
      nodeValue[0].innerHTML = numberMsm
    }
    return ''
  }
  notificationOff = async (id, type) => {
    document.getElementById('taskid_' + id).classList.remove('haveNotification')
    document.getElementById('taskid_' + id).classList.remove('not_' + type)
    const nodeValue = document
      .getElementById('taskid_' + id)
      .getElementsByClassName('notificationNumber')
    if (nodeValue.length > 0) {
      nodeValue[0].innerHTML = 0
    }
    await updateChatState(id)
    await this.getMyTasks()
    return ''
  }

  //CHAT
  getMessages = async id => {
    const messages = await messagesAll(id)
    //console.log('messages ------------- ', messages)
    await this.setState({
      messagesTask: messages.data,
    })
    return messages
  }
  addMensages = (msm, type) => {}
  openChat = async (id, column) => {
    let { openChat } = this.state
    let includesThis = true

    openChat = openChat.filter(item => {
      let itemResp = item
      if (item === id) {
        includesThis = false
        itemResp = null
      }
      return itemResp
    })

    if (includesThis) {
      openChat.push(id)
    }

    await this.trigerColumn(column, id)

    this.setState({ openChat })

    return true
  }
  chatTopPositionTriger = async () => {
    let { chatTopPosition } = this.state
    chatTopPosition = '-37px'
    let activetask = get('activeTasks')
    await activetask.filter(item => {
      if (item.task.status.name === 'live') {
        chatTopPosition = '-188px'
      }
      return item
    })
    this.setState({ chatTopPosition })
  }

  //NOTES
  getNotes = async id => {
    const notes = notesAll(id)
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

  //ORDERS TRIGERS
  addRemoveFavorite = async (orderID, providerId, favorite) => {
    let activetask = get('activeTasks')
    activetask = activetask.map(item => {
      if (item.task.id === orderID) {
        if (!item.task.favorites) {
          item.task.favorites = []
        }
        if (item.task.favorites.length < 0 && favorite) {
          item.task.favorites.push(providerId)
        } else {
          if (!item.task.favorites.includes(providerId) && favorite) {
            item.task.favorites.push(providerId)
          } else if (item.task.favorites.includes(providerId) && !favorite) {
            item.task.favorites = item.task.favorites.filter(fav => {
              let resp = true
              if (fav === providerId) {
                resp = false
              }
              return resp
            })
            //console.log('item.task.favorites', item.task.favorites)
          }
        }
      }
      return item
    })
    await save('activeTasks', activetask)
  }
  updateActivateTask = async (column, id) => {
    let activetask = get('activeTasks', column)
    let task = null
    if (column === 'provider') {
      await this.getMyTasks()
      await this.state.tasks.map(item => {
        if (item.id === id) {
          task = item
        }
        return item
      })
    }
    activetask = await activetask.filter(item => {
      if (item.task.id === id) {
        item.task.status.name = column
        if (task !== null) {
          const messagesAll = item.task.messagesAll
          item.task = task
          item.task.messagesAll = messagesAll
          item.task.messagesAll.providerDivicion = {
            idLastMSM:
              item.task.messagesAll.provider[
                item.task.messagesAll.provider.length - 1
              ],
            user: item.task.provider,
          }
        }
      }
      return item
    })
    await save('activeTasks', activetask)

    await this.setState({ activeTasks: activetask })
    //console.log('PreARRAY')
    if (task !== null) {
      Array.from(this.RefChatContainer.values())
        .filter(node => node != null)
        .forEach(node => {
          //console.log('In ARRAY node.props.item.id', node.props.item.id)
          //console.log('In ARRAY id', id)
          if (node.props.item.id === id) {
            //console.log('Entro', id)
            node.updatechageProviderVal()
          }
        })
    }
  }
  activateTask = async (id, icon) => {
    try {
      let { activeTasks } = this.state

      let includesThis = false
      let statusS = null
      let task = null
      let execute = false

      activeTasks = activeTasks.filter((item, i) => {
        if (item.task.id === id) {
          includesThis = true
          statusS = item.task.status.name
          item.task.status.name = 'live'
          task = item
          if (icon !== null) {
            item.icon = icon
          }

          //index = i
        }
        return item
      })
      if (!includesThis) {
        //index = activeTasks.length
        await this.state.tasks.filter((item, index) => {
          if (item.id === id) {
            task = item
          }
          return item
        })
      }
      task.icon = icon

      if (!includesThis) {
        if (task.status.name !== 'complete') {
          const messages = await this.getMessages(task.id)
          //await this.getNotes(task.id)

          task.messagesAll = messages.data
          activeTasks.push({ task })
          execute = true
        } else {
          alert(
            'Las tareas en la columna de resuelto no pueden ser gestionadas. Debes reabrirla para poder gestionarla.'
          )
          execute = false
        }
      } else if (statusS !== 'live') {
        execute = true
      }

      if (execute) {
        //console.log('execute', execute)
        await this.openChat(id, 'live')

        await save('activeTasks', activeTasks)

        await this.setState({
          activeTasks,
        })

        await Array.from(this.RefChatContainer.values())
          .filter(node => node != null)
          .forEach(node => {
            if (node.props.item.id === id) {
              //console.log('Nodooo ', node)
              node.wrappedInstance.haveToOpenChat('live', 'board')
            }
          })

        //console.log('activeTasks ------------', activeTasks)
        //const scrollWidthValue = (index - 1) * 420
      }
      this.notificationOff(id, 'provider')
    } catch (err) {
      console.log('error', err.message)
    }
  }
  desactivateTask = async id => {
    //console.log('dasactivar' + id)
    try {
      const result = window.confirm(
        'Si cierras la tarea solicitaras Rate del servicio al cliente y liberaras las aplicaciones de los actores. ¿Quiéres cerrar la tarea?'
      )

      if (result) {
        const { activeTasks } = this.state
        console.log('des activeTasks', activeTasks)
        const activeTasksFilter = activeTasks.filter((item, index) => {
          let itemRet = item
          console.log('item.task.id', item.task.id)
          if (item.task.id === id) {
            itemRet = null
          }
          return itemRet
        })
        console.log(' des activeTasksFilter', activeTasksFilter)

        await this.trigerColumn('complete', id)
        //await save('activeTasks', activeTasksFilter)

        await this.setState({
          activeTasks: activeTasksFilter,
        })
      }
    } catch (err) {
      console.log('error', err.message)
    }
  }

  //COLUMN OR STATUS TRIGER
  trigerColumn = async (col, id) => {
    try {
      /*console.log('col', col)
      console.log('id', id)*/
      await this.updateActivateTask(col, id)
      await updateStatus(id, col)

      let { tasks } = this.state

      tasks = await tasks.filter(item => {
        if (item.id === id) {
          item.status.name = col
        }
        return item
      })

      await this.setState({
        tasks,
      })
    } catch (err) {
      console.error('Error', err.message)
    }
  }

  update911state = async id => {
    //console.log('id del 911 user:', id)
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

  //TASKS
  getMyTasks = async () => {
    try {
      const decryptedData = await getAllTasks()
      //console.log('tasks ', decryptedData)

      this.setState({
        tasks: decryptedData.tasks,
      })
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

  onDrop = async (ev, cat) => {
    ev.preventDefault()

    let id = ev.dataTransfer.getData('text')

    let result = true
    if (cat === 'complete') {
      result = window.confirm(
        'Si cierras la tarea solicitaras Rate del servicio al cliente y liberaras las aplicaciones de los actores. ¿Quiéres cerrar la tarea?'
      )
    }
    if (result) {
      let reopen = false
      let idNumber = null
      let operator = null
      let service = null
      await this.state.tasks.filter(task => {
        if ('id_' + task.id === id) {
          idNumber = task.id
          operator = task.assignedTo
          service = task.service.categories.name
          if (task.status.name === 'complete') {
            reopen = true
          }
        }
        return task
      })
      if (cat === 'backlog' && operator !== null) {
        alert(
          'Esta columna es solo para tareas que no tengan asiganado un operador.'
        )

        return
      }
      let reopenconfirm = true
      if (reopen) {
        reopenconfirm = window.confirm('¿Estás segur@ de lo que haces?')
      }
      id = id.split('_')
      id = Number(id[1])
      if (reopenconfirm) {
        this.trigerColumn(cat, idNumber)

        if (cat === 'complete') {
          await this.desactivateTask(id)
        }
      }
      if (cat !== 'complete') {
        let icon = service
        icon =
          icon
            .toString()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w]+/g, '')
            .replace(/^-+/, '')
            .replace(/-+$/, '') + '.svg'
        await this.activateTask(id, icon)
      }

      Array.from(this.RefChatContainer.values())
        .filter(node => node != null)
        .forEach(node => {
          if (node.props.item.id === id) {
            //console.log('Nodooo ', node)
            node.wrappedInstance.haveToOpenChat(cat, 'board')
          }
        })
    }
    this.setState({
      dragStard: false,
    })
  }
  Delivery = async () => {
    this.setState({
      isLoading: true,
    })

    const promises = this.state.tasks.map(async item => {
      if (item.status.name === 'complete') {
        try {
          await updateStatus(item.id, 'delivered')
          this.getMyTasks()
        } catch (err) {
          console.log(err)
        }
      }
      return item
    })

    await Promise.all(promises)
    this.setState({
      isLoading: false,
    })

    return
  }
  updateLocalTask = async (id, cat) => {
    //console.log('local update cat -----------', cat)
    //console.log('local update id -----------', id)
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
    //console.log('Post state', this.state.tasks)
    return idNumber
  }
  //FILTROS
  handleFilterChange = option => {
    if (option) {
      this.setState({ filterOption: option.value })
    } else {
      this.setState({ filterOption: '' })
    }
  }
  handleFilterOperatorChange = option => {
    //console.log('Dio click: ', option)

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
      const data = await operatorsAll()
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
        return a.priority - b.priority
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
            whoFocusItem={this.state.whoFocusItem}
          />
        )
        return true
      })

    //DASHBOARD
    return (
      <div className={this.state.dragStard ? 'dragging' : ''}>
        {/*<div className="Welcome">Bienvenido {getUser().name}</div>}

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
        )*/}
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
          <div className="asignetOverflow">
            <div
              className="asigned b-column"
              onDragOver={e => this.onDragOver(e)}
              onDrop={e => this.onDrop(e, 'asigned')}
              style={{ width: tasks.asigned.length * 180 + 'px' }}
            >
              <span className="column-header">Asignados</span>
              {tasks.asigned.length > 0 ? (
                tasks.asigned
              ) : (
                <div className="messageAssignetEmpty">
                  <p>
                    Atento!!! en cualquier momento entra una nueva taréa...
                    Podrás verla en esta barra... <br />
                    Suerte :)
                  </p>
                </div>
              )}
            </div>
          </div>
          <div
            className="incurse  b-column"
            style={getUser().type === 'operator' ? {} : {}}
          >
            <span className="column-header">En curso</span>
            <div
              className="notresponse b-row"
              onDragOver={e => this.onDragOver(e)}
              onDrop={e => this.onDrop(e, 'notresponse')}
            >
              <span className="column-header">
                Sin respuesta
                <img
                  src={require('../../images/flag-red.svg')}
                  alt="Sin Respuesta"
                  style={{ width: '20px', margin: '0px 0px 0px 0px' }}
                />
              </span>
              {tasks.notresponse}
            </div>
            <div
              className="standby b-row"
              onDragOver={e => this.onDragOver(e)}
              onDrop={e => this.onDrop(e, 'standby')}
            >
              <span className="column-header">En Espera</span>
              {tasks.standby}
            </div>
            <div
              className="live b-row"
              onDragOver={e => this.onDragOver(e)}
              onDrop={e => this.onDrop(e, 'live')}
            >
              <span className="column-header">En Vivo</span>
              {tasks.live}
            </div>
          </div>
          <div
            className="complete b-column"
            onDragOver={e => this.onDragOver(e)}
            onDrop={e => this.onDrop(e, 'complete')}
            style={getUser().type === 'operator' ? {} : {}}
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
        <div className="chatsBar" id="chatsBar">
          <div
            className="absoluteChatBottom"
            style={{
              top: this.state.chatTopPosition,
              width: this.state.activeTasks.length * 300 + 'px',
            }}
          >
            {this.state.activeTasks
              .sort(function(a, b) {
                return ('' + a.task.status.name).localeCompare(
                  b.task.status.name
                )
              })
              .filter(function(item) {
                return (
                  item.task.status.name !== 'asigned' &&
                  item.task.status.name !== 'complete'
                )
              })
              .map(item => (
                <ChatContainer
                  ref={c => this.RefChatContainer.set(item.task.id, c)}
                  item={item.task}
                  desactivateTask={this.desactivateTask}
                  key={item.task.id}
                  openChatTriger={this.openChat}
                  chatTopPositionTriger={this.chatTopPositionTriger}
                  whoFocus={this.whoFocus}
                  whoFocusItem={this.state.whoFocusItem}
                  addNewMessage={this.addNewMessage}
                  updateActivateTask={this.updateActivateTask}
                  socket={this.state.socket}
                  color={item.task.color}
                  appID={item.task.client.aplicationId}
                  updateGlobalMapVars={this.updateGlobalMapVars}
                  addRemoveFavorite={this.addRemoveFavorite}
                  favoritesProviders={
                    item.task.favorites ? item.task.favorites : null
                  }
                />
              ))}
          </div>
        </div>
        <ToastContainer position="bottom-right" />
        {this.state.isLoading === true ? <Loading /> : ''}
      </div>
    )
  }
}

export default Board
