import React, { Component } from 'react'
import { getUser } from '../services/auth'
import { Link } from 'gatsby'

import GoogleMapReact from 'google-map-react'
import { fitBounds } from 'google-map-react/utils'
import CMarker from './CMarker'
import io from 'socket.io-client'
import styled from 'styled-components'
import axios from 'axios'

import vialIcon from '../images/car.svg'
import defaultIcon from '../images/default.svg'
import arrowDownIcon from '../images/arrow-down.svg'
import { askForPermissioToReceiveNotifications } from '../services/push-notification'
import { ToastContainer, toast } from 'react-toastify'

import Modal from './modal'

import 'react-toastify/dist/ReactToastify.css'
import '../assets/css/board.css'

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 3px;
  font-size: 15px;
  background-color: #d3d3d3;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  cursor: pointer;
  &:hover {
    background-color: #c3c3c3;
  }
  &:focus {
    outline: none;
  }
`

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTQ2NDUzOTgzLCJleHAiOjE1NDkxMzIzODN9.xaXGbUOrsLQLBw7-DkeBPyYRsaluNZK4Zh4e8n-ZLSw'

export default class Board extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tasks: [],
      userId: 1223331,
      clients: [],
      center: {
        lat: -0.1865934,
        lng: -78.4480523,
      },
      zoom: 14,
      showModal: false,
      ModalContent: '',
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

    //Geolocalizacion
    const { userId } = this.state
    this.google = window.google = window.google ? window.google : {}

    await this.getClients() //get a client list with the last know location

    //connect with the websocket
    this.socket = io(process.env.WS_URL, {
      query: {
        user: JSON.stringify({
          id: userId,
          token,
        }),
      },
    })
    this.socket.on(`user-${userId}-socketId`, this.onSockedId)
    this.socket.on('onClientLocation', this.onClientLocation)
  }

  //MODAL
  setModal = () => {
    this.setState({ showModal: !this.state.showModal })
  }

  //ALERTS
  MsmNewTask = () => toast('Tienes una nueva solicitud asignada.')

  //TASKS
  getMyTasks = async () => {
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

  //GEOLOCALIZATION
  async getClients() {
    try {
      const res = await axios({
        method: 'POST',
        url: 'https://websockets.it-zam.com/api/v1/clients',
        headers: {
          jwt: token,
        },
      })

      await this.setState({ clients: res.data })
    } catch (error) {
      console.error(error)
    }
  }
  onSockedId = id => {
    console.log('connected with socketID', id)
  }
  onClientLocation = data => {
    //console.log('client', data)

    const client = {
      id: data.id,
      info: data.info,
      lat: data.lat,
      lng: data.lng,
    }
    var tmpClients = this.state.clients
    const index = tmpClients.findIndex(o => o.userId === data.userId)
    if (index !== -1) {
      //if the user is already on the list
      //just only udate the user by index
      tmpClients[index] = client
    } else {
      //add the client to the list
      tmpClients.push(client)
    }
    //update tne state
    this.setState({ clients: tmpClients })
  }
  centerClients = () => {
    let bounds = new this.google.maps.LatLngBounds()

    if (this.state.clients.length === 0) {
      alert('No hay marcadores para centrar')
      return
    } else if (this.state.clients.length === 1) {
      const client = this.state.clients[0]
      this.setState({ center: { lat: client.lat, lng: client.lng } })
      return
    }
    this.state.clients.forEach(p => {
      bounds.extend(new this.google.maps.LatLng(p.lat, p.lng))
    })

    // GET NW, SE BY NE, SW
    const ne = bounds.getNorthEast()
    const sw = bounds.getSouthWest()
    const nw = { lat: ne.lat(), lng: sw.lng() }
    const se = { lat: sw.lat(), lng: ne.lng() }
    const { center, zoom } = fitBounds(
      { se: { lat: se.lat, lng: se.lng }, nw: { lat: nw.lat, lng: nw.lng } },
      { width: 225, height: 777 }
    )

    this.setState({ center, zoom })
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
          onClick={this.setModal}
        >
          <div className="task-header">
            <div className="category-icon">
              <img src={icon} alt={t.service.category} />
            </div>
            <h3>{t.service.category}</h3>
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
            <b>Servicio:</b> {t.service.name} <br />
            <b>Cliente:</b> {t.client.name + ' ' + t.client.lastName} <br />
            <b>Proveedor:</b> {t.provider.busnessName} <br />
          </p>
          <div className="task-footer">p</div>
        </div>
      )
    })

    //DASHBOARD
    const { clients, center, zoom } = this.state
    return (
      <div>
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
        <div style={{ position: 'relative', height: '200px', width: '100%' }}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: 'AIzaSyCW_VtwnO2cCNOYEGkd3tigdoCxeRxAnU4',
            }}
            center={center}
            zoom={zoom}
          >
            {clients.map((client, index) => (
              <CMarker
                key={index}
                lat={client.lat}
                lng={client.lng}
                id={client.id}
                info={client.info}
              />
            ))}
          </GoogleMapReact>

          <Button
            onClick={this.centerClients}
            style={{ position: 'absolute', bottom: 0, left: 20, zIndex: 999 }}
          >
            <b>CENTRAR CLIENTES</b>
          </Button>
        </div>
        <ToastContainer />
        <Modal setModal={this.setModal} showModal={this.state.showModal}>
          {this.state.ModalContent}
        </Modal>
      </div>
    )
  }
}
