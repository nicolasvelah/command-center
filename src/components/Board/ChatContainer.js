import React from 'react'
//import ChatNotificationsCounter from './ChatNotificationsCounter'
//import { save, get } from '../../services/Storage'
import Chat from './ChatV2'
import MapServiceTacking from '../Maps/MapServiceTackingV2'
import star from '../../images/star-full.svg'
import { findUserById, getProviders } from '../../services/wsConect'
import { geocodeLatLng, changeOrderProvider } from '../../services/helpers'
import { inject, observer } from 'mobx-react'
import { intercept } from 'mobx'

@observer
@inject('mapStore')
class ChatContainer extends React.Component {
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
      searchProviderMode: true,
      providerInChat: null,
      clientData: null,
      address: null,
      country: null,
      city: null,
      providers: [],
      ProvidersActiveServices: [],
    }
    this.updateClient = this.updateClient.bind(this)
    this.haveToOpenChat = this.haveToOpenChat.bind(this)
    this.updateProvidersFavorite = this.updateProvidersFavorite.bind(this)
  }
  async componentDidMount() {
    //GET USER GEOLOCALIZATION DATA
    const clientGLData = await findUserById(this.props.item.clientId, true)
    await this.haveToOpenChat(this.props.item.status.name, 'init')

    let { searchProviderMode } = this.state
    if (this.props.item.provider !== null) {
      if (this.props.item.providerId !== 0) {
        searchProviderMode = false
      }
    }
    const context = this
    //console.log('this.props.item =++++++++++++', this.props.item)
    await geocodeLatLng(
      this.props.item.serviceOrigin.position.latitude,
      this.props.item.serviceOrigin.position.longitude,
      function(data) {
        //console.log('Data de rertorno de google', data)
        if (Array.isArray(data)) {
          const location = data[3].formatted_address.split(',')
          const country = location[1]
          const city = location[0]
          context.setState({
            address: data[0].formatted_address,
            country,
            city,
          })
        } else {
          context.setState({
            address: data,
          })
        }
      }
    )
    let { providers, ProvidersActiveServices } = this.state
    await this.props.mapStore.WSData.map(async item => {
      if (item.APP_ID === this.props.appID) {
        providers = item.providers
        ProvidersActiveServices = item.ProvidersActiveServices
      }
      return item
    })
    if (providers.length <= 0) {
      providers = await getProviders(this.props.appID, 'Ecuador')
      providers = providers.data
      await providers.map(provider => {
        provider.info.services.map(service => {
          ProvidersActiveServices.indexOf(service.servicio) === -1
            ? ProvidersActiveServices.push(service.servicio)
            : console.log(
                '1.Ya existe en la lista ProvidersActiveServices',
                service.servicio
              )
          return service
        })
        return provider
      })
    }

    await this.setState({
      searchProviderMode,
      clientData: clientGLData.data,
      providers,
      ProvidersActiveServices,
    })
    //console.log('providers del etsa camada', providers)
    await intercept(this.props.mapStore, 'clientIdWS', change => {
      if (context.props.item.clientId === change.newValue.id) {
        console.log(
          'este actor se esta moviendo:',
          change.newValue.id +
            ' / ' +
            this.props.item.client.name +
            ' ' +
            this.props.item.client.lastName
        )
        let { clientData } = this.state
        clientData.lat = change.newValue.lat
        clientData.lng = change.newValue.lng
        clientData.connected = true
        context.updateClient(clientData)
      }
      return change
    }).bind(this)

    await intercept(this.props.mapStore, 'clientsDsWS', change => {
      if (context.props.item.clientId === change.newValue) {
        console.log(
          'este cliente se Desconecto:',
          change.newValue.id +
            ' / ' +
            this.props.item.client.name +
            ' ' +
            this.props.item.client.lastName
        )
        let { clientData } = this.state
        clientData.connected = false
        context.updateClient(clientData)
      }
      return change
    }).bind(this)

    await intercept(this.props.mapStore, 'providerDsWS', change => {
      context.updateProvidersDS(change)
      return change
    }).bind(this)

    await intercept(this.props.mapStore, 'WSData', change => {
      change.newValue.map(async item => {
        if (item.APP_ID === context.props.appID) {
          context.updateProviders(item.providers)
          context.updateProvidersActiveServices(item.ProvidersActiveServices)
        }
        return item
      })

      return change
    }).bind(this)
  }

  updateClient(clientData) {
    this.setState({ clientData })
  }
  updateProvidersDS(change) {
    let probresp = this.state.providers.map(item => {
      if (item.id === change.newValue) {
        item.connected = false
      }
      return item
    })
    this.setState({ providers: probresp })
  }
  updateProvidersActiveServices(ProvidersActiveServices) {
    this.setState({ ProvidersActiveServices })
  }
  updateProviders(providers) {
    let probresp = this.state.providers.map(item => {
      providers.map(inProb => {
        if (inProb.id === item.id) {
          if (inProb.connected) {
            item.connected = inProb.connected
          }
          item.info = inProb.info
          item.lat = inProb.lat
          item.lng = inProb.lng
        }
        return inProb
      })

      return item
    })
    this.setState({ providers: probresp })
  }
  updateProvidersFavorite = async (id, fav) => {
    let { providers } = this.state
    providers = providers.map(item => {
      if (item.id === id) {
        item.localFavorite = fav
      }
      return item
    })
    this.setState({ providers })
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
      if (this.props.whoFocusItem !== null) {
        if (document.getElementById('chatTask_' + this.props.whoFocusItem)) {
          document.getElementById(
            'chatTask_' + this.props.whoFocusItem
          ).style.zIndex = '0'
        }
      }
      //console.log(this.props.whoFocusItem)
      //console.log(id)
      this.props.whoFocus(id)
      this.goBottom('scroll_' + id)
      this.goBottom('scroll_prov_' + id)

      this.props.updateGlobalMapVars(this.props.appID, this.state.country)

      document.getElementById('chatTask_' + id).style.zIndex = '2'
    }
  }

  goBottom = id => {
    var element = document.getElementById(id)
    if (element !== null) {
      element.scrollTop = element.scrollHeight - element.clientHeight
    }
  }

  asignProvider = async providerId => {
    console.log(
      'LLego y asigno a ' +
        providerId +
        '  la tarea con id ' +
        this.props.item.id
    )
    try {
      await changeOrderProvider(this.props.item.id, providerId)
    } catch (err) {
      console.error(err.message)
    }
  }

  activeProviderChat = async providerId => {
    try {
      let { providerInChat } = this.state
      this.state.providers.map(provider => {
        if (provider.id === providerId) {
          providerInChat = provider
        }
        return provider
      })
      this.setState({ providerInChat })
    } catch (err) {
      console.error(err.message)
    }
  }
  activeProviderCall = async providerId => {
    try {
      await console.log(
        'LLego y llamo a ' +
          providerId +
          '  la tarea con id ' +
          this.props.item.id
      )
    } catch (err) {
      console.error(err.message)
    }
  }
  activeProviderNotification = async providerId => {
    try {
      await console.log(
        'LLego y notifico a ' +
          providerId +
          '  la tarea con id ' +
          this.props.item.id
      )
    } catch (err) {
      console.error(err.message)
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
        {item.status.name === 'live' && this.state.providers.length > 0 ? (
          <div className="ChatMap">
            {this.props.socket !== null ? (
              <MapServiceTacking
                userId={item.clientId}
                appId={item.client.aplicationId}
                lat={item.serviceOrigin.position.latitude}
                len={item.serviceOrigin.position.longitude}
                serviceDestination={item.serviceDestination}
                socket={this.props.socket}
                clientGLData={this.state.clientData}
                clientDataLat={
                  this.state.clientData !== null ? this.state.clientData.lat : 0
                }
                clientDataLng={
                  this.state.clientData !== null ? this.state.clientData.lng : 0
                }
                clientDataState={
                  this.state.clientData !== null
                    ? this.state.clientData.connected
                    : null
                }
                color={this.props.color}
                address={this.state.address}
                country={this.state.country}
                city={this.state.city}
                providers={this.state.providers}
                ProvidersActiveServices={this.state.ProvidersActiveServices}
                service={item.service.name}
                orderId={item.id}
                addRemoveFavorite={this.props.addRemoveFavorite}
                favoritesProviders={this.props.favoritesProviders}
                updateProvidersFavorite={this.updateProvidersFavorite}
                asignProvider={this.asignProvider}
                activeProviderNotification={this.activeProviderNotification}
                activeProviderChat={this.activeProviderChat}
                activeProviderCall={this.activeProviderCall}
              />
            ) : (
              ''
            )}
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
                Cerrar
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
                  sid={item.id}
                  goBottom={this.goBottom}
                  orderId={item.id}
                  isClientTo={true}
                  to={item.client.id}
                  addNewMessage={this.props.addNewMessage}
                />
              </div>
              {this.state.providerInChat !== null ? (
                <div className="ChatProvider chatGeneric">
                  <div className="ChatInfoMain">
                    <b>Proveedor:</b>
                    {' ' +
                      this.state.providerInChat.info.name +
                      ' ' +
                      this.state.providerInChat.info.lastName}
                    <div className="ExtraData ExtraDataProvider">
                      <b>Negocio:</b>{' '}
                      {this.state.providerInChat.info.busnessName}
                      <br />
                      <b>Rate:</b>{' '}
                      {((rows, i) => {
                        while (++i <= this.state.providerInChat.info.rate) {
                          rows.push(
                            <div className="stars" key={i}>
                              <img src={star} alt="rate" />
                            </div>
                          )
                        }
                        return rows
                      })([], 0, 10)}
                      <br />
                      <b>Email:</b> {this.state.providerInChat.info.email}
                      <br />
                      <b>Telf:</b> {this.state.providerInChat.info.phone}
                    </div>
                  </div>
                  <Chat
                    messagesTask={item.messagesAll.provider}
                    sid={'prov_' + item.id}
                    goBottom={this.goBottom}
                    orderId={item.id}
                    isClientTo={false}
                    to={this.state.providerInChat.id}
                    addNewMessage={this.props.addNewMessage}
                  />
                </div>
              ) : (
                <div className="ProviderNotSelected">
                  Busca a tu proveedor <br /> en las cartas a la derecha.
                </div>
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

export default ChatContainer
