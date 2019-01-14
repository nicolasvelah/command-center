import React, { Component } from 'react'
import MapServiceTacking from './MapServiceTacking'
import Chat from './Chat'
import phone from '../images/phone.svg'
import circleDown from '../images/circle-down.svg'

import '../assets/css/task.css'

export default class Task extends Component {
  constructor(props) {
    super(props)
    this.state = { showHideMap: true }
  }

  componentDidMount() {}

  showHideMap = () => {
    this.setState({
      showHideMap: !this.state.showHideMap,
      Menssage: '',
    })
  }
  sendMenssage = e => {
    console.log(this.state.Menssage)
  }
  setMenssage = e => {
    this.setState({
      Menssage: e.target.value,
    })
  }

  render() {
    console.log(this.props.task)
    return (
      <div className="taskContent">
        {typeof this.props.task !== 'undefined' &&
        this.props.task !== null &&
        this.props.task.length > 0 ? (
          <div>
            <div className="mapContainer">
              <div
                className={
                  this.state.showHideMap ? 'trakingMap mapActive' : 'trakingMap'
                }
              >
                <MapServiceTacking userId={1} setLocation={this.setLocation} />
              </div>
              <div onClick={this.showHideMap} className="hideShowMap">
                Mapa de actores{' '}
                <img
                  src={circleDown}
                  alt="Mapa"
                  className={this.state.showHideMap ? 'trakingMapIcon' : ''}
                />
              </div>
            </div>
            <h1 className="popUpTitle">{this.props.task[0].service.name}</h1>
            <div className="row">
              <div className="client column">
                <div className="flex">
                  <div className="data">
                    <h2 className="title-tool">
                      Cliente{' '}
                      <span className="callButton">
                        <img src={phone} alt="Call client" />{' '}
                      </span>
                    </h2>
                    <div>
                      <b>Nombre:</b> {this.props.task[0].client.name}
                    </div>
                    <div>
                      <b>Apellido:</b> {this.props.task[0].client.lastName}
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
                  </div>
                  <Chat
                    setMenssage={this.setMenssage}
                    sendMenssage={this.sendMenssage}
                  />
                </div>
              </div>
              <div className="provider column">
                <div className="flex">
                  <div className="data">
                    <h2 className="title-tool">
                      Proveedor{' '}
                      <span className="callButton">
                        <img src={phone} alt="Call client" />{' '}
                      </span>
                    </h2>
                    <div className="data">
                      <div>
                        <b>Nombre:</b> ????
                      </div>
                      <div>
                        <b>Nombre del negocio:</b>{' '}
                        {this.props.task[0].provider.busnessName}
                      </div>
                      <div>
                        <b>Description:</b>{' '}
                        {this.props.task[0].provider.descriptio}
                      </div>
                      <div>
                        <b>Rate:</b> {this.props.task[0].provider.rate}
                      </div>
                      <div>
                        <b>Email:</b> ???
                      </div>
                      <div>
                        <b>Phone:</b> ???
                      </div>
                    </div>
                  </div>
                  <Chat
                    setMenssage={this.setMenssage}
                    sendMenssage={this.sendMenssage}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    )
  }
}
