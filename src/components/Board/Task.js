import React, { Component } from 'react'
import MapServiceTacking from '../Maps/MapServiceTacking'
import AsignProvider from './AsignProvider'
import Chat from './Chat'
import Notes from '../Sections/Notes'
import phone from '../../images/phone.svg'
import circleDown from '../../images/circle-down.svg'
import axios from 'axios'
import { getUser } from '../../services/auth'
import TaskClientData from './TaskClientData'
import TaskProviderData from './TaskProviderData'
import scrollIntoView from 'scroll-into-view'
import Select from 'react-select'

import '../../assets/css/task.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default class Task extends Component {
  constructor(props) {
    super(props)
    this.state = {
      EmailC: '',
      IdCardC: '',
      BloodTypeC: '',
      BirthdayC: '',
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
      is911: false,
      isLoadingForm: false,
      states: [
        { value: 'backlog', label: 'BACKLOG' },
        { value: 'asigned', label: 'ASIGNADOS' },
        { value: 'live', label: 'EN VIVO' },
        { value: 'standby', label: 'WORK IN PROGRESS' },
        { value: 'notresponse', label: 'SIN RESPUESTA' },
        { value: 'complete', label: 'RESUELTOS' },
      ],
      bloodTypes: [
        { value: 'o+', label: 'o+' },
        { value: 'o-', label: 'o-' },
        { value: 'a+', label: 'a+' },
        { value: 'a-', label: 'o-' },
        { value: 'b+', label: 'b+' },
        { value: 'b-', label: 'b-' },
        { value: 'ab-', label: 'ab-' },
        { value: 'ab+', label: 'ab+' },
      ],
      haveProvider: true,
      providersIdVisibles: [],
    }
    this.setNote = this.setNote.bind(this)
    this.sendNote = this.sendNote.bind(this)
    this.scrollToBottom = this.scrollToBottom.bind(this)
    this.setEmail = this.setEmail.bind(this)
    this.setIdCard = this.setIdCard.bind(this)
    this.sendDataClient = this.sendDataClient.bind(this)
  }

  async componentDidMount() {
    console.log('this.props.task', this.props.task)

    let { haveProvider, have911, id911 } = this.state
    if (this.props.task[0].assignedTo_911 != null) {
      have911 = true
      id911 = this.props.task[0].assignedTo_911
    }
    if (
      this.props.task[0].provider.user.name === 'SIN PROVEEDOR' ||
      this.props.task[0].provider.user.name === 'N/A'
    ) {
      haveProvider = false
    }

    console.log('haveProvider', haveProvider)
    await this.setState({
      have911,
      id911,
      haveProvider,
    })
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
        name: getUser().name + ' ' + getUser().lastName,
        type: getUser().type,
      }
      let userType = '911'
      if (!this.state.is911) {
        userType = 'provider'
        if (this.state.isClientTo) {
          userType = 'client'
        }
      }
      this.props.addMensages(msm, userType)
      console.log('inicai envio 3 userType', userType)
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
  setMenssage = (e, isClientTo, userId, is911, id) => {
    if (typeof e.target !== 'undefined') {
      this.setState({
        Menssage: e.target.value,
        to: userId,
        orderId: this.props.task[0].id,
        isClientTo: isClientTo,
        is911: is911,
      })
    }
    console.log('Mensaje: ', e.target.value.length)
    this.scrollToBottom(id)
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
      console.log(response.data.message)
      this.props.update911state(response.data.message)
      this.setState({
        have911: true,
      })
    } catch (err) {
      console.log(err)
    }
  }
  scrollToBottom = id => {
    scrollIntoView(document.getElementById(id))
    return
  }

  updateState = async option => {
    console.log('opcion', option.value)
    console.log('orderId', this.props.task[0].id)
    console.log('x-access-token', getUser().token)
    try {
      await axios.post(
        `${process.env.API_URL}/orders/updateStatus`,
        {
          statusName: option.value,
          orderId: this.props.task[0].id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': getUser().token,
          },
        }
      )
      this.props.updateLocalTask('id_' + this.props.task[0].id, option.value)
    } catch (err) {
      console.log('error', err)
    }
  }
  setEmail = e => {
    console.log('SetEmail....', e.target.value)
    this.setState({
      EmailC: e.target.value,
    })
  }
  setIdCard = e => {
    console.log('SetIdCard....', e.target.value)
    console.log(e.target)
    this.setState({
      IdCardC: e.target.value,
    })
  }
  setBloodType = e => {
    console.log('SetBloodType....', e.value)
    this.setState({
      BloodTypeC: e.value,
    })
  }
  setBirthday = e => {
    console.log('SetBirthday....', e)
    this.setState({
      BirthdayC: e,
    })
  }

  toastSendDataClient = mensaggeToastSendDataClient =>
    toast(mensaggeToastSendDataClient)

  sendDataClient = async e => {
    this.setState({
      isLoadingForm: true,
    })
    if (this.state.BirthdayC === '') {
      this.state.BirthdayC = this.props.task[0].client.birthday
    }
    if (this.state.EmailC === '') {
      this.state.EmailC = this.props.task[0].client.email
    }
    if (this.state.IdCardC === '') {
      this.state.IdCardC = this.props.task[0].client.idCard
    }

    const birthdayCoverter = new Date(this.state.BirthdayC)
    const dd = birthdayCoverter.getDate()
    const mm = birthdayCoverter.getMonth() + 1
    const yyyy = birthdayCoverter.getFullYear()

    var mmm = ''

    if (mm < 10) {
      mmm = '0' + mm
    } else {
      mmm = mm
    }

    const birthdayCoverterTxt = yyyy + '-' + mmm + '-' + dd

    try {
      await axios.post(
        `${process.env.API_URL}/clients/updateInfo`,
        {
          name: this.props.task[0].client.name,
          lastName: this.props.task[0].client.lastName,
          email: this.state.EmailC,
          idCard: this.state.IdCardC,
          birthday: birthdayCoverterTxt,
          country: 'ECUADOR',
          province: this.props.task[0].client.province,
          city: this.props.task[0].client.city,
          bloodType: this.state.BloodTypeC,
          userId: this.props.task[0].client.id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': getUser().token,
          },
        }
      )
      this.setState({
        isLoadingForm: false,
      })
      this.toastSendDataClient('Datos guardados')
      console.log('***********MES******', mmm)
      return true
    } catch (err) {
      this.toastSendDataClient('Error al guardar datos')
      console.log('***********MES******', mmm)
      console.log(err)
      this.setState({
        isLoadingForm: false,
      })
      return false
    }
  }
  activateProviderTools = () => {
    console.log('activateProviderTools', true)
    this.setState({ haveProvider: true })
  }
  render() {
    console.log(this.props.task)
    console.log('isLoadingForm: ', this.state.isLoadingForm)
    return (
      <div className="taskContent">
        {typeof this.props.task !== 'undefined' &&
        this.props.task !== null &&
        this.props.task.length > 0 ? (
          <div>
            <h1 className="popUpTitle">
              {this.props.task[0].service.name}{' '}
              <span
                className={this.props.task[0].appStatus + ' appStatusModal'}
              >
                {this.props.task[0].appStatus !== null
                  ? this.props.task[0].appStatus
                  : 'SIN PROVEEDOR'}
              </span>
            </h1>
            <div className="taskLocation">
              {this.props.task[0].country} / {this.props.task[0].city}
            </div>
            <div className="taskState">
              <b>Columna:</b>
              <Select
                className="input"
                classNamePrefix="state"
                placeholder="Estado"
                isClearable={false}
                isSearchable={true}
                name="state"
                defaultValue={this.state.states.filter(
                  option => option.value === this.props.task[0].status.name
                )}
                options={this.state.states}
                onChange={this.updateState}
              />
            </div>
            <div>
              {/*!this.state.have911 ? (
                <div className="Tools">
                  <div className="asigne911 btn" onClick={this.asigne911}>
                    Asignar al 911
                  </div>
                </div>
              ) : (
                ''
              )*/}
            </div>

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
                          <span className="actorPhoneC">
                            / {this.props.task[0].client.phone}
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
                        <TaskClientData
                          setEmail={this.setEmail}
                          setIdCard={this.setIdCard}
                          setBloodType={this.setBloodType}
                          setBirthday={this.setBirthday}
                          sendDataClient={this.sendDataClient}
                          task={this.props.task[0]}
                          bloodTypes={this.state.bloodTypes}
                          isLoadingForm={this.state.isLoadingForm}
                        />
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
                      is911={false}
                      scrollToBottom={this.scrollToBottom}
                    />
                  </div>
                  {console.log('Usuario: ', this.props.task[0])}
                  {this.props.task[0].comment === '' ? (
                    ''
                  ) : (
                    <div className="message-client">
                      Mensaje Inicial: "<i>{this.props.task[0].comment}</i>"
                    </div>
                  )}
                </div>
                {this.props.task[0].provider.user.name !== '911' ? (
                  <div className="provider column">
                    <div>
                      {this.props.chageProviderVal === false ? (
                        this.state.haveProvider ? (
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
                                <TaskProviderData task={this.props.task} />
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
                              is911={false}
                              scrollToBottom={this.scrollToBottom}
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
                              activateProviderTools={this.activateProviderTools}
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
                        id="chatsos"
                        idInput="911"
                        is911={true}
                        scrollToBottom={this.scrollToBottom}
                      />
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
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
        <ToastContainer />
      </div>
    )
  }
}
