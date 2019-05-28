import axios from 'axios'
import io from 'socket.io-client'
import { getUser } from '../services/auth'
import { get } from './Storage'

export const conectSocket = async (token, userId) => {
  try {
    const APP_ID = 1
    const country = await getLocationByIP(token)
    const wsToken = await getWsAccessToken(
      userId,
      APP_ID,
      false,
      country,
      token
    )
    const socket = await io(process.env.WS_URL, {
      query: {
        token: wsToken,
      },
    })
    return socket
  } catch (err) {
    console.log(err.message)
    return false
  }
}
var mapStoreLocal = null
export const updateMapData = (socket, APP_ID, country, mapStore) => {
  //console.log('updateMapData mapStore', mapStore)
  mapStoreLocal = mapStore
  //console.log('updateMapData socket', socket)
  //console.log('updateMapData APP_ID', APP_ID)
  //console.log('updateMapData country', country)
  socket.on(`onClientLocation-app-${APP_ID}-${country}`, onClientLocation)
  socket.on(
    `onClientDisconnected-app-${APP_ID}-${country}`,
    onClientDisconnected
  )

  socket.on(`onProviderLocation-app-${APP_ID}-${country}`, onProviderLocation)
  socket.on(`onProviderInService-app-${APP_ID}-${country}`, onProviderInService)
  socket.on(
    `onProviderDisconnected-app-${APP_ID}-${country}`,
    onProviderDisconnected
  )
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
const getWsAccessToken = async (userId, appId, isClient, country, token) => {
  const data = {
    appId,
    isClient,
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
const onProviderLocation = async data => {
  const activeTasks = get('activeTasks')
  let isAndActiveTask = false
  activeTasks.map(item => {
    if (item.task.providerId === data.id) {
      isAndActiveTask = true
    }
    return item
  })
  if (isAndActiveTask) {
    await mapStoreLocal.setProvider(data)
  }
}
const onProviderDisconnected = async data => {
  const { id } = data
  await mapStoreLocal.disconectProvider(id)
}
const onProviderInService = async (data, providers) => {
  /*const { id, inService } = data

  var tmp = providers
  const index = tmp.findIndex(o => o.id === id)
  if (index !== -1) {
    tmp[index].inService = inService
  }
  tmp = await this.filterProviders(tmp, this.props.providerId)
  return tmp*/
}

export const findUserById = async (userId, isClient) => {
  try {
    const result = await axios.post(
      `${process.env.WS_URL}/api/v1/find-user`,
      {
        userId,
        isClient,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          jwt: getUser().token,
        },
      }
    )
    return result
  } catch (err) {
    console.log(err.message)
    return ['Error']
  }
}
