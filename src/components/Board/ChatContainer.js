import React from 'react'
//import ChatNotificationsCounter from './ChatNotificationsCounter'
//import { save, get } from '../../services/Storage'
import { inject, observer } from 'mobx-react'
import { intercept } from 'mobx'
import styled from 'styled-components'
import { confirmAlert } from 'react-confirm-alert'

import Chat from './ChatV2'
import MapServiceTacking from '../Maps/MapServiceTackingV2 copy'
import { findUserById } from '../../services/wsConect'
import {
  geocodeLatLng,
  changeOrderProvider,
  getMessagesById,
} from '../../services/helpers'
import Svg from '../Tools/svg'

import 'react-confirm-alert/src/react-confirm-alert.css'

const SearchProviderModeMarker = styled.div`
  text-align: right;
  padding: 0px;
  .iconServiceState {
    padding: 4px 4px 0px;
    display: inline-block;
    background: #fff;
    border: 2px solid #53a93f;
    border-bottom: none;
    border-right: none;
  }
  svg {
    width: 30px;
  }
`

const ChatProviderHeader = styled.div`
  line-height: 18px;
  .NameRate {
    display: flex;
    line-height: 24px;
    .stars {
      position: relative;
      .rateProvStart {
        width: 20px;
        height: 20px;
        margin-right: 3px;
      }
      span {
        position: absolute;
        text-align: center;
        margin: 0px 0px 0px 7px;
        font-weight: bold;
      }
    }
  }
  .GetTheRoute {
    margin: 0px;
  }
`
const ComunicationTools = styled.div`
  text-align: right;
  svg {
    max-width: 14px;
  }
`
@inject('mapStore')
@observer
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
    this.updateProvider = this.updateProvider.bind(this)
  }
  async componentDidMount() {
    //GET USER GEOLOCALIZATION DATA
    const clientGLData = await findUserById(this.props.item.clientId, true)
    console.log('++Iniciando haveToOpenChat ++')
    await this.haveToOpenChat(this.props.item.status.name, 'init', 'init')
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
    let { providers, ProvidersActiveServices, providerInChat } = this.state
    await this.props.mapStore.providerWS.map(async data => {
      if (data.appID === this.props.appID) {
        providers = data.providers
        await providers.map(provider => {
          provider.info.services.map(service => {
            if (ProvidersActiveServices.indexOf(service.servicio) === -1) {
              ProvidersActiveServices.push(service.servicio)
            }
            return service
          })
          return provider
        })
      }
      return data
    })
    console.log('INIT ProvidersActiveServices', ProvidersActiveServices)
    //console.log('this.props.item.providerId', this.props.item)
    if (this.props.item.providerId !== 0) {
      await providers.map(provider => {
        //console.log('bucle 2 data.providers - provider', provider)
        if (provider.id === this.props.item.provider.id) {
          providerInChat = provider
        }
        return provider
      })
    }

    await this.setState({
      searchProviderMode,
      clientData: clientGLData.data,
      providers,
      ProvidersActiveServices,
      providerInChat,
    })

    intercept(this.props.mapStore, 'clientIdWS', change => {
      if (context.props.item.clientId === change.newValue.id) {
        /*
        console.log(
          'este actor se esta moviendo:',
          change.newValue.id +
            ' / ' +
            this.props.item.client.name +
            ' ' +
            this.props.item.client.lastName
        )
        console.log('este actor se esta moviendo xx:', change.newValue)
        */

        let { clientData } = this.state
        const location = change.newValue.location.coordinates
        clientData.lat = location[1]
        clientData.lng = location[0]
        clientData.connected = true
        context.updateClient(clientData)
      }
      return change
    }).bind(this)

    intercept(this.props.mapStore, 'clientsDsWS', change => {
      if (context.props.item.clientId === change.newValue) {
        console.log('este cliente se Desconecto:', change.newValue)
        let { clientData } = this.state
        clientData.connected = false
        context.updateClient(clientData)
      }
      return change
    }).bind(this)

    intercept(this.props.mapStore, 'providerDsWS', change => {
      context.updateProvidersDS(change)
      return change
    }).bind(this)

    intercept(this.props.mapStore, 'providerWS', change => {
      change.newValue.map(item => {
        if (item.appID === context.props.appID) {
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
    providers.map(provider => {
      if (provider.id === id) {
        provider.localFavorite = fav
      }
      return provider
    })
    this.setState({ providers })
    if (this.state.providerInChat) {
      if (id === this.state.providerInChat.id) {
        this.setChatFav(fav)
      }
    }
  }

  haveToOpenChat = async (statusInit, from, type) => {
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
      await this.props.desactivateTask(item.id, true)
    } else {
      await this.props.openChatTriger(item.id, status, type)
      this.setState({ status, openChat: haveToOpen })
    }
    this.props.chatTopPositionTriger()
    console.log('haveToOpenChat From: ' + from + ' statusInit: ' + statusInit)
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
      this.props.notificationOff(id, 'provider')
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
    let message = 'Asignar Proveedor?'
    if (this.state.providerInChat) {
      message = `¿Estás segur@ que quieres asignar al proveedor ${this.state
        .providerInChat.info.name +
        ' ' +
        this.state.providerInChat.info.lastName}?`

      if (this.props.item.providerId !== 0) {
        message = `¿Estás segur@ que quieres cambiar de proveedor de ${this
          .props.item.provider.user.name +
          ' ' +
          this.props.item.provider.user.lastName} a ${this.state.providerInChat
          .info.name +
          ' ' +
          this.state.providerInChat.info.lastName}?`
      }
    }
    confirmAlert({
      title: 'Asignara proveedor a esta Historia',
      message,
      buttons: [
        {
          label: 'Si',
          onClick: async () => {
            try {
              await changeOrderProvider(this.props.item.id, providerId)
              this.searchProviderMode(true)
            } catch (err) {
              console.error(err.message)
            }
          },
        },
        {
          label: 'No',
          onClick: () => null,
        },
      ],
      childrenElement: () => <div className="confimationPopUp" />,
      closeOnEscape: true,
      closeOnClickOutside: true,
    })
  }

  activeProviderChat = async providerId => {
    console.log('ejecuta cambio de proveedor')
    try {
      let { providerInChat, providers } = this.state
      const messages = await getMessagesById(this.props.item.id, providerId)
      providers.map(provider => {
        if (provider.id === providerId) {
          providerInChat = provider
          providerInChat.messagesAll = messages.data
        }
        return provider
      })
      console.log('providerInChat salida:', providerInChat)
      this.setState({ providerInChat })
    } catch (err) {
      console.error(err.message)
    }
  }
  activeProviderCall = (name, phone) => {
    confirmAlert({
      title: '',
      message: `¿Deseas llamar al proveedor ${name} al número ${phone}?`,
      buttons: [
        {
          label: 'No llamar',
          onClick: () => null,
        },
        {
          label: 'Llamar',
          onClick: async () => {
            try {
              console.log('Ejecucion de API para llamada IP')
            } catch (err) {
              console.error(err.message)
            }
          },
        },
      ],
      childrenElement: () => <div className="confimationPopUp" />,
      closeOnEscape: true,
      closeOnClickOutside: true,
    })
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
  searchProviderMode = trigger => {
    if (!trigger) {
      confirmAlert({
        title: 'Cambiar de proveedor para esta Historia',
        message:
          'Ya tienes un proveedor asignado a esta historia. ¿Estás seguro que quieres cambiar de proveedor?',
        buttons: [
          {
            label: 'Si',
            onClick: () =>
              this.setState({
                searchProviderMode: !this.state.searchProviderMode,
              }),
          },
          {
            label: 'No',
            onClick: () => null,
          },
        ],
      })
    } else {
      this.setState({
        searchProviderMode: !this.state.searchProviderMode,
      })
    }
  }
  updateProvider = async (values, providerId) => {
    //console.log('updateProvider ' + providerId, values)
    let { providers, providerInChat } = this.state
    await providers.map(provider => {
      if (provider.id === providerId) {
        this.mergeObj(provider, values)
      }
      if (providerInChat) {
        if (providerInChat.id === providerId) {
          this.mergeObj(providerInChat, values)
        }
      }
      return provider
    })
    /*console.log('updateProvider salida' + providerId, providers)
    console.log(
      'updateProvider salida providerInChat' + providerId,
      providerInChat
    )*/
    this.setState({
      providers,
      providerInChat,
    })
  }
  mergeObj = (obj, src) => {
    for (var key in src) {
      if (src.hasOwnProperty(key)) obj[key] = src[key]
    }
    return obj
  }
  setChatFav = async favorite => {
    let { providerInChat, providers } = this.state
    if (providerInChat) {
      providers.map(provider => {
        if (provider.id === providerInChat.id) {
          provider.favorite = favorite
        }
        return provider
      })

      await this.updateProvider({ favorite }, providerInChat.id)
      providerInChat.favorite = favorite
      this.setState({ providerInChat, providers })
      //console.log('setChatFav', providers)
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
        <SearchProviderModeMarker>
          <div
            className="iconServiceState"
            style={
              this.state.searchProviderMode
                ? null
                : { borderRight: '2px solid  #53a93f' }
            }
          >
            <button
              onClick={e => {
                e.preventDefault()
                if (!(this.state.searchProviderMode && item.providerId === 0)) {
                  var triger = true
                  if (!this.state.searchProviderMode) {
                    triger = false
                  }
                  this.searchProviderMode(triger)
                }
              }}
              className="btnicon"
            >
              <Svg
                title={
                  this.state.searchProviderMode
                    ? 'Sin Proveedor'
                    : 'Con Proveedor'
                }
                svgClass="svgIcon"
                svgFill={this.state.searchProviderMode ? '#c62b20' : '#53a93f'}
                viewBox="0 0 512 512"
                svgPathOne_d={
                  this.state.searchProviderMode
                    ? 'M192 368c0-75.617 47.937-140.243 115.016-165.1 8.14-18.269 12.984-38.582 12.984-58.9 0-79.529 0-144-96-144s-96 64.471-96 144c0 49.53 28.751 99.052 64 118.916v26.39c-108.551 8.874-192 62.21-192 126.694h198.653c-4.332-15.265-6.653-31.366-6.653-48z'
                    : 'M480 304l-144 144-48-48-32 32 80 80 176-176z'
                }
                svgPathTow_d={
                  this.state.searchProviderMode
                    ? 'M368 224c-79.529 0-144 64.471-144 144s64.471 144 144 144c79.528 0 144-64.471 144-144s-64.471-144-144-144zM448 384h-160v-32h160v32z'
                    : 'M224 384h160v-57.564c-33.61-19.6-78.154-33.055-128-37.13v-26.39c35.249-19.864 64-69.386 64-118.916 0-79.529 0-144-96-144s-96 64.471-96 144c0 49.53 28.751 99.052 64 118.916v26.39c-108.551 8.874-192 62.21-192 126.694h224v-32'
                }
              />
            </button>
          </div>
        </SearchProviderModeMarker>

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
                  this.haveToOpenChat(item.status.name, 'openChat', 'click')
                }}
                className="openChat"
              >
                <div className="openBar" />
              </div>
              <div
                onClick={async e => {
                  e.preventDefault()
                  this.haveToOpenChat(item.status.name, 'NotAswere', 'click')
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
                  this.haveToOpenChat(item.status.name, 'closeChat', 'click')
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
          {item.status.name === 'live' && this.state.providers.length >= 0 ? (
            <div
              className="ChatMap"
              style={
                this.state.searchProviderMode
                  ? null
                  : { borderRight: '3px solid  #53a93f' }
              }
            >
              {(this.props.socket !== null &&
                this.state.ProvidersActiveServices.length > 0) ||
              (this.state.ProvidersActiveServices.length >= 0 &&
                item.client.aplicationId === 2) ? (
                <MapServiceTacking
                  ref="mapa"
                  userId={item.clientId}
                  appId={item.client.aplicationId}
                  lat={item.serviceOrigin.position.latitude}
                  len={item.serviceOrigin.position.longitude}
                  serviceDestination={item.serviceDestination}
                  socket={this.props.socket}
                  clientGLData={this.state.clientData}
                  clientDataLat={
                    this.state.clientData !== null &&
                    this.state.clientData.lat !== undefined &&
                    this.state.clientData.lat !== null
                      ? this.state.clientData.lat
                      : 0
                  }
                  clientDataLng={
                    this.state.clientData !== null &&
                    this.state.clientData.lng !== undefined &&
                    this.state.clientData.lng !== null
                      ? this.state.clientData.lng
                      : 0
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
                  updateProvidersFavorite={this.updateProvidersFavorite}
                  asignProvider={this.asignProvider}
                  activeProviderNotification={this.activeProviderNotification}
                  activeProviderChat={this.activeProviderChat}
                  activeProviderCall={this.activeProviderCall}
                  searchProviderMode={this.state.searchProviderMode}
                  updateProvider={this.updateProvider}
                />
              ) : (
                ''
              )}
            </div>
          ) : (
            ''
          )}
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
                <ChatProviderHeader className="ChatProvider chatGeneric">
                  <div className="ChatInfoMain">
                    <div className="NameRate">
                      <div className="stars">
                        <span>{this.state.providerInChat.info.rate}</span>
                        <Svg
                          title={'Rate'}
                          svgClass="rateProvStart"
                          svgFill={'#ffc200'}
                          viewBox="0 0 512 512"
                          svgPathOne_d={
                            'M512 198.525l-176.89-25.704-79.11-160.291-79.108 160.291-176.892 25.704 128 124.769-30.216 176.176 158.216-83.179 158.216 83.179-30.217-176.176 128.001-124.769z'
                          }
                        />
                      </div>
                      <b>
                        {this.state.providerInChat.info.name +
                          ' ' +
                          this.state.providerInChat.info.lastName}
                      </b>
                      {this.state.providerInChat.favorite ? (
                        <button
                          onClick={e => {
                            e.preventDefault()
                            /*this.setChatFav(!this.state.providerInChat.favorite)
                            this.refs.mapa.wrappedInstance.favioriteInRef(
                              this.state.providerInChat.id
                            )*/
                          }}
                          className="btnicon btnFavorito"
                        >
                          <Svg
                            title="Favorito"
                            svgClass="svgIcon"
                            viewBox="0 0 512 512"
                            svgFill="#ed1848"
                            svgPathOne_d="M224 416c-4 0-8-1.5-11-4.5l-156-150.5c-2-1.75-57-52-57-112 0-73.25 44.75-117 119.5-117 43.75 0 84.75 34.5 104.5 54 19.75-19.5 60.75-54 104.5-54 74.75 0 119.5 43.75 119.5 117 0 60-55 110.25-57.25 112.5l-155.75 150c-3 3-7 4.5-11 4.5z"
                          />
                        </button>
                      ) : (
                        ''
                      )}
                    </div>

                    {!this.state.providerInChat.time ? (
                      <div
                        id={
                          'ProviderRouteDataButtonChat_' +
                          this.state.providerInChat.id
                        }
                        className="GetTheRoute"
                      >
                        <span
                          onClick={e => {
                            e.preventDefault()
                            
                            this.refs.mapa.wrappedInstance.calculateAndDisplayRoute(
                              this.state.providerInChat.lat,
                              this.state.providerInChat.lng,
                              this.state.providerInChat.id,
                              false
                            )
                          }}
                        >
                          Datos de ruta
                        </span>
                      </div>
                    ) : (
                      <div
                        className={
                          (this.state.providerInChat.timeColorClass
                            ? this.state.providerInChat.timeColorClass
                            : '') + ' ProviderRouteDataMap'
                        }
                        id={
                          'ProviderRouteDataChat_' +
                          this.state.providerInChat.id
                        }
                      >
                        <span className="time">
                          {this.state.providerInChat.time}
                        </span>
                        {' / '}
                        <span className="km">
                          {this.state.providerInChat.km} km
                        </span>
                        {' / '}
                        <span
                          style={{
                            background: this.state.providerInChat.colorRoute,
                            color: '#fff',
                            padding: '2px 5px',
                            fontSize: '9px',
                            fontWeight: 'normal',
                          }}
                        >
                          Ruta
                        </span>
                      </div>
                    )}
                    <div className="ProvMonitor">
                      <Svg
                        title={
                          this.state.providerInChat.connected
                            ? 'conectado'
                            : 'desconectado'
                        }
                        svgClass="conectIcon"
                        viewBox="0 0 512 512"
                        svgFill={
                          this.state.providerInChat.connected
                            ? '#53a93f'
                            : '#c62b20'
                        }
                        svgPathOne_d="M416 368h-96v80h-128v-80h-96v-192h64v-128h64v128h64v-128h64v128h64v192z"
                      />
                      {' / '}
                      <Svg
                        title={
                          this.state.providerInChat.inService
                            ? 'Ocupado'
                            : 'Libre'
                        }
                        svgClass="ocupyIcon"
                        svgFill={
                          this.state.providerInChat.inService
                            ? '#c62b20'
                            : '#53a93f'
                        }
                        viewBox="0 0 512 512"
                        svgPathOne_d={
                          this.state.providerInChat.inService
                            ? 'M256 0c-141.385 0-256 114.615-256 256s114.615 256 256 256 256-114.615 256-256-114.615-256-256-256zM329.372 374.628l-105.372-105.373v-141.255h64v114.745l86.628 86.627-45.256 45.256z'
                            : 'M432 64l-240 240-112-112-80 80 192 192 320-320z'
                        }
                      />
                      {' / '}
                      <b>
                        {/*this.state.providerInChat.distance
                          ? this.state.providerInChat.distance
                        : ''*/}{' '}
                        m de dist.
                      </b>
                    </div>
                    <div>
                      {this.state.providerInChat.info.services.map(service => (
                        <span key={service.serviceId}>
                          <img
                            src={service.icon}
                            alt={service.category}
                            className="cateoryImageProviderItem"
                          />
                          {service.servicio + ', '}
                        </span>
                      ))}
                    </div>
                    <ComunicationTools>
                      <button
                        onClick={e => {
                          e.preventDefault()
                          this.activeProviderCall(
                            this.state.providerInChat.info.name +
                              ' ' +
                              this.state.providerInChat.info.lastName,
                            this.state.providerInChat.info.phone
                          )
                        }}
                        className="btnicon"
                      >
                        <Svg
                          title={'Llamada'}
                          svgClass="svgIcon"
                          svgFill={'#333'}
                          viewBox="0 0 512 512"
                          svgPathOne_d={
                            'M352 320c-32 32-32 64-64 64s-64-32-96-64-64-64-64-96 32-32 64-64-64-128-96-128-96 96-96 96c0 64 65.75 193.75 128 256s192 128 256 128c0 0 96-64 96-96s-96-128-128-96z'
                          }
                        />
                      </button>
                      <button
                        onClick={e => {
                          e.preventDefault()
                          this.activeProviderNotification(
                            this.state.providerInChat.id
                          )
                        }}
                        className="btnicon"
                      >
                        <Svg
                          title={'Notificar'}
                          svgClass="svgIcon"
                          svgFill={'#333'}
                          viewBox="0 0 512 512"
                          svgPathOne_d={
                            'M512.75 400c0-144-128-112-128-224 0-9.28-0.894-17.21-2.524-23.964-8.415-56.509-46.078-101.86-94.886-115.68 0.433-1.974 0.66-4.016 0.66-6.105 0-16.639-14.4-30.251-32-30.251s-32 13.612-32 30.25c0 2.090 0.228 4.132 0.66 6.105-54.735 15.499-95.457 70.649-96.627 136.721-0.020 0.96-0.033 1.932-0.033 2.923 0 112.001-128 80.001-128 224.001 0 38.113 85.295 69.998 199.485 78.040 10.762 20.202 32.028 33.96 56.515 33.96s45.754-13.758 56.515-33.96c114.19-8.042 199.485-39.927 199.485-78.040 0-0.114-0.013-0.228-0.014-0.341l0.764 0.341zM413.123 427.048c-27.115 7.235-59.079 12.438-93.384 15.324-2.852-32.709-30.291-58.372-63.739-58.372s-60.887 25.663-63.739 58.372c-34.304-2.886-66.269-8.089-93.384-15.324-37.315-9.957-55.155-21.095-61.684-27.048 6.529-5.953 24.369-17.091 61.684-27.048 43.386-11.576 99.186-17.952 157.123-17.952s113.737 6.376 157.123 17.952c37.315 9.957 55.155 21.095 61.684 27.048-6.529 5.953-24.369 17.091-61.684 27.048z'
                          }
                        />
                      </button>
                    </ComunicationTools>
                  </div>
                  {this.state.searchProviderMode &&
                  this.state.providerInChat.messagesAll ? (
                    <Chat
                      messagesTask={this.state.providerInChat.messagesAll}
                      sid={'prov_' + item.id}
                      goBottom={this.goBottom}
                      orderId={item.id}
                      isClientTo={false}
                      to={this.state.providerInChat.id}
                      addNewMessage={this.props.addNewMessage}
                    />
                  ) : (
                    <Chat
                      messagesTask={item.messagesAll.provider}
                      sid={'prov_' + item.id}
                      goBottom={this.goBottom}
                      orderId={item.id}
                      isClientTo={false}
                      to={item.provider.user.id}
                      addNewMessage={this.props.addNewMessage}
                    />
                  )}
                </ChatProviderHeader>
              ) : (
                <div className="ProviderNotSelected">
                  Busca el proveedor
                  <br /> en las cartas a la derecha.
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
