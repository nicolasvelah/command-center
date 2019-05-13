import React from 'react'
//import ChatNotificationsCounter from './ChatNotificationsCounter'
//import { save, get } from '../../services/Storage'
import Chat from './ChatV2'
import MapServiceTacking from '../Maps/MapServiceTacking'
import star from '../../images/star-full.svg'
import AsignProvider from './AsignProvider'
import plus from '../../images/plus.svg'

export default class ChatContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Menssage: '',
      to: null,
      orderId: null,
      isClientTo: true,
      id911: null,
      openChat: false,
      status: '',
      chageProviderVal: false,
    }
  }
  componentDidMount() {
    console.log('init task contaner')
    this.haveToOpenChat(this.props.item.status.name, 'init')

    if (this.props.item.provider !== null) {
      if (
        this.props.item.provider.user.name === 'N/A' &&
        this.props.item.provider.user.name === 'SIN' &&
        this.props.item.provider.user.name === '911'
      ) {
        this.setState({
          chageProviderVal: true,
        })
      }
    }
  }
  updatechageProviderVal() {
    this.setState({ chageProviderVal: false })
  }

  haveToOpenChat = async (statusInit, from) => {
    let haveToOpen = false

    let { status } = this.state
    const { item } = this.props
    if (from === 'openChat') {
      if (statusInit === 'notresponse') {
        status = 'live'
        haveToOpen = true
      } else if (item.status.name === 'standby') {
        status = 'live'
        haveToOpen = true
      } else if (item.status.name === 'live') {
        status = 'standby'
        haveToOpen = false
      } else if (item.status.name === 'asigned') {
        status = 'live'
        haveToOpen = true
      }
    } else if (from === 'NotAswere') {
      status = 'notresponse'
      if (statusInit !== 'notresponse') {
        status = 'notresponse'
      } else {
        status = statusInit
      }
    } else if (from === 'init') {
      status = item.status.name
      if (status === 'notresponse' || status === 'standby') {
        haveToOpen = false
      } else if (status === 'live') {
        haveToOpen = true
      } else if (status === 'complete') {
        haveToOpen = false
      }
    } else if (from === 'board') {
      status = statusInit
      if (status === 'notresponse' || status === 'standby') {
        haveToOpen = false
      } else if (status === 'live') {
        haveToOpen = true
      } else if (status === 'complete') {
        haveToOpen = false
      }
    } else if (from === 'closeChat') {
      haveToOpen = false
      status = 'complete'
    }

    if (from === 'closeChat') {
      await this.props.desactivateTask(item.id)
    } else {
      await this.props.openChatTriger(item.id, status)
      this.setState({ status, openChat: haveToOpen })
    }
    this.props.chatTopPositionTriger()
  }

  focusChat = id => {
    //let f = document.getElementById(id).focus()
    if (
      this.props.item.status.name === 'live' &&
      this.props.whoFocusItem !== id
    ) {
      //console.log(this.props.whoFocusItem)
      //console.log(id)
      this.props.whoFocus(id)
      this.goBottom('scroll_' + id)
      this.goBottom('scroll_prov_' + id)
    }
  }

  goBottom = id => {
    var element = document.getElementById(id)
    if (element !== null) {
      element.scrollTop = element.scrollHeight - element.clientHeight
    }
  }

  render() {
    const { item } = this.props
    return item.status.name !== 'complete' ? (
      <div
        className={
          (item.message.length > 0
            ? 'chat-container haveNotification not_provider'
            : 'chat-container') +
          (this.props.whoFocusItem === item.id ? ' chatFocus' : ' noChatFocus')
        }
        id={'chatTask_' + item.id}
        onClick={e => this.focusChat(item.id)}
      >
        {item.status.name === 'live' ? (
          <div className="ChatMap">
            <MapServiceTacking
              userId={item.clientId}
              lat={item.lat}
              len={item.len}
              providerId={item.providerId}
              latProvider={item.latProvider}
              lenProvider={item.lenProvider}
              setLocation={this.setLocation}
            />
          </div>
        ) : (
          ''
        )}
        <div className={this.state.status + ' subcontainer '}>
          <div className="ChatHeader">
            <div className="clientDataName">
              <div
                className={'taskVisualTraking'}
                style={{ background: item.color }}
              >
                {item.client.name.charAt(0) + item.client.lastName.charAt(0)}
              </div>
              <div className="clientName">
                <p>
                  {item.client.name.substring(0, 15) +
                    ' ' +
                    item.client.lastName.substring(0, 15) +
                    '...'}
                  <span className="serviceNameChat">
                    {item.service.name.substring(0, 25) + '...'}
                  </span>
                </p>
              </div>
            </div>
            <div className="ChatContainerTools">
              <div
                onClick={e => {
                  e.preventDefault()
                  this.haveToOpenChat(item.status.name, 'openChat')
                }}
                className="openChat"
              >
                <div className="openBar" />
              </div>
              <div
                onClick={async e => {
                  e.preventDefault()
                  this.haveToOpenChat(item.status.name, 'NotAswere')
                }}
                className="NotAswere"
              >
                <img
                  src={require('../../images/flag-red.svg')}
                  alt="Sin Respuesta"
                />
              </div>
              <div
                onClick={e => {
                  e.preventDefault()
                  this.haveToOpenChat(item.status.name, 'closeChat')
                }}
                className="closeChat"
              >
                X
              </div>

              <div className="ChatNotificationsCounter">
                {/*<ChatNotificationsCounter t={item} />*/}
              </div>
            </div>
          </div>
          {this.state.openChat ? (
            <div className="chatTool">
              <div className="ChatClient chatGeneric">
                <div className="ChatInfoMain">
                  <b>Cliente:</b>
                  {' ' + item.client.name + ' ' + item.client.lastName}
                  <div className="ExtraData ExtraDataClient">
                    <b>Email:</b> {item.client.email}
                    <br />
                    <b>Telf:</b> {item.client.phone}
                    <br />
                    <b>Tipo de Sangre:</b> {item.client.bloodType}
                    <br />
                    <b>Cumpleaños:</b> {item.client.birthday}
                    <br />
                    <b>Cédula:</b> {item.client.idCard}
                  </div>
                </div>
                <Chat
                  messagesTask={item.messagesAll.client}
                  divicion={null}
                  sid={item.id}
                  goBottom={this.goBottom}
                  orderId={item.id}
                  isClientTo={true}
                  to={item.client.id}
                  addNewMessage={this.props.addNewMessage}
                />
              </div>
              {!this.state.chageProviderVal ? (
                <div className="ChatProvider chatGeneric">
                  <button
                    onClick={e => {
                      e.preventDefault()
                      console.log(this.state.chageProviderVal)
                      this.setState({ chageProviderVal: true })
                      console.log(this.state.chageProviderVal)
                    }}
                    className="ChangeProviderButton"
                  >
                    <img src={plus} alt="cambiar de proveedor" />
                  </button>
                  <div className="ChatInfoMain">
                    <b>Proveedor:</b>
                    {' ' +
                      item.provider.user.name +
                      ' ' +
                      item.provider.user.lastName}
                    <div className="ExtraData ExtraDataProvider">
                      <b>Negocio:</b> {item.provider.busnessName}
                      <br />
                      <b>Rate:</b>{' '}
                      {((rows, i) => {
                        while (++i <= item.provider.rate - 1) {
                          rows.push(
                            <div className="stars" key={i}>
                              <img src={star} alt="rate" />
                            </div>
                          )
                        }
                        return rows
                      })([], 0, 10)}
                      <br />
                      <b>Email:</b> {item.provider.user.email}
                      <br />
                      <b>Telf:</b> {item.provider.user.phone}
                    </div>
                  </div>
                  <Chat
                    messagesTask={item.messagesAll.provider}
                    divicion={item.messagesAll.providerDivicion}
                    sid={'prov_' + item.id}
                    goBottom={this.goBottom}
                    orderId={item.id}
                    isClientTo={false}
                    to={item.provider.user.id}
                    addNewMessage={this.props.addNewMessage}
                  />
                </div>
              ) : (
                <AsignProvider
                  orderId={item.id}
                  updateActivateTask={this.props.updateActivateTask}
                />
              )}
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    ) : (
      ''
    )
  }
}
