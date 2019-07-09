import axios from 'axios'
import io from 'socket.io-client'
import { getAccessToken } from '../services/auth'
import { get } from './Storage'

export const conectSocket = async (token, userId, userType, APP_IDs) => {
  try {
    const country = await getLocationByIP(token)
    const wsToken = await getWsAccessToken(
      userId,
      APP_IDs,
      userType,
      country,
      token
    )
    console.log('wsToken', wsToken)
    const socket = await io(process.env.WS_URL, {
      query: {
        token: wsToken,
      },
    })
    console.log('socket', socket)
    return socket
  } catch (err) {
    console.log(err.message)
    return false
  }
}
var mapStoreLocal = null
export const updateMapData = async (socket, APP_ID, country, mapStore) => {
  //console.log('updateMapData mapStore.WSData', mapStore.WSData)
  let newListener = true
  if (mapStore.WSData.length > 0) {
    newListener = false
    //console.log('mapStore.WSData es mayor que 0')
    /*mapStore.WSData.map(item => {
      //console.log('mapStore.WSData BUcle item', item.APP_ID)
      if (item.APP_ID === APP_ID) {
        newListener = false
      }
      return item
    })*/
  }
  if (newListener) {
    console.log(
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Nuevo listener APP_ID: ' +
        APP_ID +
        ' / pais: ' +
        country
    )

    mapStoreLocal = mapStore
    const providers = await getProviders(APP_ID, country)
    const clients = await getClients(APP_ID, country)
    let ProvidersActiveServices = []
    await providers.data.map(provider => {
      provider.info.services.map(service => {
        if (ProvidersActiveServices.indexOf(service.servicio) === -1) {
          ProvidersActiveServices.push(service.servicio)
        }
        return service
      })
      return provider
    })

    let listenerData = {
      APP_ID,
      country,
      ProvidersActiveServices,
      providers: providers.data,
      clients: clients.data,
    }
    mapStore.setWSData(listenerData)

    socket.on(`on-client-location`, onClientLocation)
    socket.on(`on-client-disconnected`, onClientDisconnected)

    socket.on(`on-provider-location`, data =>
      onProviderLocation(data, APP_ID, country)
    )
    socket.on(`on-provider-in-service`, data =>
      onProviderInService(data, APP_ID, country)
    )
    socket.on(`on-provider-disconnected`, data =>
      onProviderDisconnected(data, APP_ID, country)
    )
  }
}

export const onNotification = (
  socket,
  startNotificationsWs,
  chatNotifications,
  getMyTasks,
  providerState
) => {
  socket.on(`on-notification`, data => {
    startNotificationsWs(data, chatNotifications, getMyTasks, providerState)
  })
}

//CONFIG DATA
const getLocationByIP = async token => {
  try {
    const publicIp = require('public-ip')
    const ip = await publicIp.v4()
    const response = await axios({
      url: `${process.env.WS_URL}/api/v1/geo-ip/${ip}`,
      method: 'get',
      headers: {
        jwt: token,
      },
    })
    const { country } = response.data
    return country
  } catch (error) {
    console.log('no se pudo desde el backend')
  }
}
/* ------------------------------------- */
const getWsAccessToken = async (userId, appIds, userType, country, token) => {
  const data = {
    appIds,
    userType,
    user: {
      id: userId,
    },
    country,
  }

  const response = await axios({
    method: 'POST',
    url: `${process.env.WS_URL}/api/v1/ws/get-access-token`,
    headers: {
      jwt: token,
    },
    data,
  })
  return response.data
}

//ON EVENT
//Client
const onClientLocation = async data => {
  const activeTasks = get('activeTasks')
  let isAndActiveTask = false
  activeTasks.map(item => {
    if (item.task.clientId === data.id) {
      isAndActiveTask = true
    }
    return item
  })
  if (isAndActiveTask) {
    await mapStoreLocal.setClients(data)
  }
}
const onClientDisconnected = async data => {
  const { id } = data
  await mapStoreLocal.disconectClient(id)
}

//Provider
const onProviderLocation = async (data, APP_ID, country) => {
  mapStoreLocal.onProviderLocation(data, APP_ID, country)
}
const onProviderDisconnected = async (data, APP_ID, country) => {
  const { id } = data
  await mapStoreLocal.disconectProvider(id, APP_ID, country)
}
const onProviderInService = async (data, APP_ID, country) => {
  await mapStoreLocal.inServiceProvider(data, APP_ID, country)
}

export const findUserById = async (userId, isClient) => {
  try {
    const accessToken = await getAccessToken()
    const result = await axios.post(
      `${process.env.WS_URL}/api/v1/find-user`,
      {
        userId,
        isClient,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          jwt: accessToken,
        },
      }
    )
    return result
  } catch (err) {
    console.log(err.message)
    return ['Error']
  }
}
export const getProviders = async (appId, country) => {
  try {
    const accessToken = await getAccessToken()
    const result = await axios.post(
      `${process.env.WS_URL}/api/v1/providers`,
      {
        appId,
        country,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          jwt: accessToken,
        },
      }
    )
    //const result = { data: [] }
    //console.log('getProviders Result', result)
    return result
  } catch (err) {
    console.log(err.message)
    return ['Error']
  }
}
const getClients = async (appId, country) => {
  try {
    const accessToken = await getAccessToken()
    const result = await axios.post(
      `${process.env.WS_URL}/api/v1/clients`,
      {
        appId,
        country,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          jwt: accessToken,
        },
      }
    )
    return result
  } catch (err) {
    console.log(err.message)
    return ['Error']
  }
}
