import React, { Component } from 'react'
import MapServiceTacking from './MapServiceTacking'
import Chat from './Chat'
import phone from '../images/phone.svg'
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
    }
  }

  componentDidMount() {}

  sendMenssageByEnter = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      this.sendMenssage(e)
    }
  }
  sendMenssage = async e => {
    console.log('enviando ms')
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
      let userType = '911'
      this.props.addMensages(msm, userType)
      document.getElementById('chat-input').reset()
      this.setState({
        Menssage: '',
      })
      console.log('termiono envio ms')
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

  render() {
    console.log(this.props.task)
    return (
      <div className="taskContent">
        {typeof this.props.task !== 'undefined' &&
        this.props.task !== null &&
        this.props.task.length > 0 ? (
          <div>
            <div className="row">
              <div className="client column">
                <div className="flex">
                  <div className="data">
                    <h2 className="title-tool">
                      <span className="callButton">
                        <img src={phone} alt="Call client" />{' '}
                      </span>
                      Cliente{' '}
                    </h2>
                    <div>
                      <b>Nombre:</b>{' '}
                      <span className="actorNameC">
                        {this.props.task[0].client.name +
                          ' ' +
                          this.props.task[0].client.lastName}
                      </span>
                    </div>
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
                      <b>Cumpleaños:</b> {this.props.task[0].client.birthday}
                    </div>
                    <div>
                      <b>Phone:</b> {this.props.task[0].client.phone}
                    </div>
                    <br />
                    <br />
                    <h2 className="title-tool">
                      <span className="callButton">
                        <img src={phone} alt="Call client" />{' '}
                      </span>
                      Operador{' '}
                    </h2>
                    <div>
                      <b>Nombre:</b>{' '}
                      <span className="actorNameC">
                        {this.props.task[0].operator.name +
                          ' ' +
                          this.props.task[0].operator.lastName}
                      </span>
                    </div>
                    <Chat
                      setMenssage={this.setMenssage}
                      sendMenssage={this.sendMenssage}
                      sendMenssageByEnter={this.sendMenssageByEnter}
                      isClientTo={false}
                      userId={this.props.task[0].operator.id}
                      messagesTask={this.props.messagesTask['911']}
                      id="chat-911"
                      idInput="input"
                    />
                  </div>
                  <div className="mapContainer">
                    <div
                      className={
                        this.state.showHideMap
                          ? 'trakingMap mapActive'
                          : 'trakingMap'
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
                </div>
              </div>
            </div>

            <br />
            <br />
          </div>
        ) : (
          ''
        )}
      </div>
    )
  }
}
