import React, { Component } from 'react'
import MapServiceTacking from './MapServiceTacking'
import AsignProvider from './AsignProvider'
import Chat from './Chat'
import Notes from './Notes'
import phone from '../images/phone.svg'
import circleDown from '../images/circle-down.svg'
import axios from 'axios'
import { getUser } from '../services/auth'

import '../assets/css/task.css'

export default class Task extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showHideMap: true,
      Menssage: '',
      to: null,
      orderId: null,
      isClientTo: true,
      note: '',
      update: false,
      have911: false,
      id911: null,
      showCD: false,
      showPD: false,
    }
    this.setNote = this.setNote.bind(this)
    this.sendNote = this.sendNote.bind(this)
  }

  componentDidMount() {
    if (this.props.task[0].assignedTo_911 != null) {
      this.setState({
        have911: true,
        id911: this.props.task[0].assignedTo_911,
      })
    }
  }

  showHideMap = () => {
    this.setState({
      showHideMap: !this.state.showHideMap,
    })
  }
  sendMenssageByEnter = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      this.sendMenssage(e)
    }
  }
  sendMenssage = async e => {
    console.log('inicai envio')
    if (this.state.Menssage !== '') {
      const result = await axios.post(
        `${process.env.API_URL}/sendMessage`,
        {
          to: this.state.to,
          content: this.state.Menssage,
          orderId: this.state.orderId,
          isClientTo: this.state.isClientTo,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': getUser().token,
          },
        }
      )
      console.log('inicai envio 2')
      const today = new Date()
      const dd = today.getDate()
      const mm = today.getMonth() + 1
      const yyyy = today.getFullYear()
      const hour = today.getHours()
      const minute = today.getMinutes()
      const second = today.getSeconds()
      const msm = {
        date:
          dd + '/' + mm + '/' + yyyy + ' ' + hour + ':' + minute + ':' + second,
        id: 100,
        message: this.state.Menssage,
        name: getUser().name + getUser().lastName,
        type: getUser().type,
      }
      let userType = 'provider'
      if (this.state.isClientTo) {
        userType = 'client'
      }
      this.props.addMensages(msm, userType)
      console.log('inicai envio 3')
      document.getElementById('chat-' + userType).reset()
      console.log('inicai envio 4')
      this.setState({
        Menssage: '',
      })
      return result
    } else {
      return
    }
  }
  setMenssage = (e, isClientTo, userId) => {
    if (typeof e.target !== 'undefined') {
      this.setState({
        Menssage: e.target.value,
        to: userId,
        orderId: this.props.task[0].id,
        isClientTo: isClientTo,
      })
    }
  }

  sendNote = async e => {
    try {
      await axios.post(
        `${process.env.API_URL}/orders/addNote`,
        {
          content: this.state.note,
          orderId: this.state.orderId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': getUser().token,
          },
        }
      )
      const note = {
        id: 100,
        content: this.state.note,
        name: 'Nicolas Vela',
        type: 'operator',
        date: '00/00/0000 00:00',
      }
      this.props.addNote(note)
    } catch (err) {
      console.log(err)
    }
  }
  setNote = e => {
    this.setState({
      note: e.target.value,
      orderId: this.props.task[0].id,
    })
  }
  openClose = id => {
    console.log('id', id)
    switch (id) {
      case 'showCD':
        this.setState({
          showCD: !this.state.showCD,
        })
        break
      case 'showPD':
        this.setState({
          showPD: !this.state.showPD,
        })
        break
      default:
      // code block
    }
  }

  asigne911 = async e => {
    console.log(this.props.task[0].id)
    try {
      const response = await axios.post(
        `${process.env.API_URL}/orders/assignTo911`,
        {
          orderId: this.props.task[0].id,
          country: 'ECUADOR',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': getUser().token,
          },
        }
      )
      console.log(response.data)
      this.setState({
        have911: true,
      })
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    console.log(this.props.task)
    return (
      <div className="taskContent">
        {typeof this.props.task !== 'undefined' &&
        this.props.task !== null &&
        this.props.task.length > 0 ? (
          <div>
            <h1 className="popUpTitle">{this.props.task[0].service.name}</h1>
            <div className="taskState">
              <b>Estado:</b> {this.props.task[0].status.name}
            </div>
            <div>
              {!this.state.have911 ? (
                <div className="asigne911 btn" onClick={this.asigne911}>
                  Asignar al 911
                </div>
              ) : (
                ''
              )}
            </div>

            <div className="row">
              <div className="chatRow">
                <div className="client column">
                  <div className="">
                    <div className="data">
                      <div
                        className="titleHeader"
                        onClick={() => this.openClose('showCD')}
                      >
                        <h2 className="title-tool">
                          <span className="callButton">
                            <img src={phone} alt="Call client" />{' '}
                          </span>
                          <b>Cliente:</b>{' '}
                          <span className="actorNameC">
                            {this.props.task[0].client.name +
                              ' ' +
                              this.props.task[0].client.lastName}
                          </span>
                        </h2>
                        <img
                          src={circleDown}
                          alt="Mapa"
                          className={
                            this.state.showCD
                              ? 'upIcon ddIco'
                              : 'downIcon ddIco'
                          }
                        />
                      </div>
                      <div
                        className={
                          this.state.showCD
                            ? 'dropDownData openDD'
                            : 'dropDownData closeDD'
                        }
                      >
                        <div>
                          <b>Cédula:</b> {this.props.task[0].client.idCard}
                        </div>
                        <div>
                          <b>Tipo de sangre:</b>{' '}
                          {this.props.task[0].client.bloodType}
                        </div>
                        <div>
                          <b>Email:</b> {this.props.task[0].client.email}
                        </div>
                        <div>
                          <b>Cumpleaños:</b>{' '}
                          {this.props.task[0].client.birthday}
                        </div>
                        <div>
                          <b>Phone:</b> {this.props.task[0].client.phone}
                        </div>
                      </div>
                    </div>
                    <Chat
                      setMenssage={this.setMenssage}
                      sendMenssage={this.sendMenssage}
                      sendMenssageByEnter={this.sendMenssageByEnter}
                      isClientTo={true}
                      userId={this.props.task[0].client.id}
                      messagesTask={this.props.messagesTask.client}
                      id="chatClient"
                      idInput="client"
                    />
                  </div>
                </div>
                {this.props.task[0].provider.user.name !== '911' ? (
                  <div className="provider column">
                    <div>
                      {this.props.chageProviderVal === false ? (
                        this.props.task[0].provider.user.name !== 'N/A' ? (
                          <div className="">
                            <div className="data">
                              <button
                                className="btn reasign"
                                onClick={() => this.props.chageProvider()}
                              >
                                Reasignar
                              </button>
                              <div
                                className="titleHeader"
                                onClick={() => this.openClose('showPD')}
                              >
                                <h2 className="title-tool">
                                  <span className="callButton">
                                    <img src={phone} alt="Call client" />{' '}
                                  </span>
                                  <b>Proveedor:</b>{' '}
                                  <span className="actorNameP">
                                    {this.props.task[0].provider.user.name +
                                      ' ' +
                                      this.props.task[0].provider.user.lastName}
                                  </span>
                                </h2>

                                <img
                                  src={circleDown}
                                  alt="Mapa"
                                  className={
                                    this.state.showPD
                                      ? 'upIcon ddIco'
                                      : 'downIcon ddIco'
                                  }
                                />
                              </div>

                              <div
                                className={
                                  this.state.showPD
                                    ? 'dropDownData openDD'
                                    : 'dropDownData closeDD'
                                }
                              >
                                <div>
                                  <b>Nombre del negocio:</b>{' '}
                                  {this.props.task[0].provider.busnessName}
                                </div>
                                <div>
                                  <b>Description:</b>{' '}
                                  {this.props.task[0].provider.descriptio}
                                </div>
                                <div>
                                  <b>Rate:</b>{' '}
                                  {this.props.task[0].provider.rate}
                                </div>
                                <div>
                                  <b>Email:</b>{' '}
                                  {this.props.task[0].provider.user.email}
                                </div>
                                <div>
                                  <b>Phone:</b>{' '}
                                  {this.props.task[0].provider.user.phone}
                                </div>
                              </div>
                            </div>
                            <Chat
                              setMenssage={this.setMenssage}
                              sendMenssage={this.sendMenssage}
                              sendMenssageByEnter={this.sendMenssageByEnter}
                              isClientTo={false}
                              userId={this.props.task[0].provider.user.id}
                              messagesTask={this.props.messagesTask.provider}
                              id="chatProvider"
                              idInput="provider"
                            />
                          </div>
                        ) : (
                          <div className="flex">
                            <div className="data">
                              <AsignProvider
                                orderId={this.props.task[0].id}
                                getMyTasks={this.props.getMyTasks}
                                setModal={this.props.setModal}
                              />
                            </div>
                          </div>
                        )
                      ) : (
                        ''
                      )}
                      {this.props.chageProviderVal === true ? (
                        <div className="">
                          <div className="data">
                            <AsignProvider
                              orderId={this.props.task[0].id}
                              getMyTasks={this.props.getMyTasks}
                              setModal={this.props.setModal}
                            />
                          </div>
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                ) : (
                  ''
                )}
                {this.state.have911 ? (
                  <div className="provider column">
                    <div className="">
                      <div className="data">
                        <h2 className="title-tool">
                          <span className="callButton">
                            <img src={phone} alt="Call client" />{' '}
                          </span>
                          911{' '}
                        </h2>
                      </div>

                      <Chat
                        setMenssage={this.setMenssage}
                        sendMenssage={this.sendMenssage}
                        sendMenssageByEnter={this.sendMenssageByEnter}
                        isClientTo={false}
                        userId={this.state.id911}
                        messagesTask={this.props.messagesTask['911']}
                        id="chat911"
                        idInput="sos"
                      />
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
            <br />
            <br />
            <div className="mapContainer">
              <div onClick={this.showHideMap} className="hideShowMap">
                Mapa de actores{' '}
                <img
                  src={circleDown}
                  alt="Mapa"
                  className={this.state.showHideMap ? 'trakingMapIcon' : ''}
                />
              </div>
              <div
                className={
                  this.state.showHideMap ? 'trakingMap mapActive' : 'trakingMap'
                }
              >
                <MapServiceTacking
                  userId={this.props.task[0].clientId}
                  lat={this.props.task[0].lat}
                  len={this.props.task[0].len}
                  providerId={this.props.task[0].providerId}
                  latProvider={this.props.task[0].latProvider}
                  lenProvider={this.props.task[0].lenProvider}
                  setLocation={this.setLocation}
                />
              </div>
            </div>
            <br />
            <br />
            <div>
              <Notes
                setNote={this.setNote}
                sendNote={this.sendNote}
                notesTask={this.props.notesTask}
              />
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    )
  }
}
