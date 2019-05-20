import axios from 'axios'
import io from 'socket.io-client'

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
export const updateMapData = (socket, APP_ID, country, mapStore) => {
  console.log('updateMapData mapStore', mapStore)
  console.log('updateMapData socket', socket)
  socket.on(`onClientLocation-app-${APP_ID}-${country}`, onClientLocation)
  socket.on(`onProviderLocation-app-${APP_ID}-${country}`, onProviderLocation)
  socket.on(`onProviderInService-app-${APP_ID}-${country}`, onProviderInService)
  socket.on(
    `onProviderDisconnected-app-${APP_ID}-${country}`,
    onProviderDisconnected
  )
  socket.on(
    `onClientDisconnected-app-${APP_ID}-${country}`,
    onClientDisconnected
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
const onClientLocation = async (data, clients) => {
  console.log('onClientLocation data', data)
  if (data.id === clients[0].id) {
    const client = {
      id: data.id,
      info: data.info,
      lat: data.lat,
      lng: data.lng,
    }
    var tmpClients = clients
    const index = tmpClients.findIndex(o => o.id === client.id)
    if (index !== -1) {
      //if the user is already on the list
      //just only udate the user by index
      tmpClients[index] = client
    } else {
      //add the client to the list
      tmpClients.push(client)
    }
    //update tne state

    tmpClients = await this.filterClient(tmpClients, data.id)

    return tmpClients.user
  }
}
const onClientDisconnected = (data, clients) => {
  const { id } = data
  var tmp = clients
  const index = tmp.findIndex(o => o.id === id)
  if (index !== -1) {
    tmp[index].connected = false
  }
  return tmp
}

//Provider
const onProviderLocation = async (data, providers) => {
  if (data.id === this.state.providers[0].id) {
    const provider = {
      id: data.id,
      info: data.info,
      lat: data.lat,
      lng: data.lng,
    }
    var tmp = providers
    const index = tmp.findIndex(o => o.id === provider.id)
    if (index !== -1) {
      tmp[index] = provider
    } else {
      tmp.push(provider)
    }
    tmp = await this.filterProviders(tmp, this.props.providerId)
    return tmp
  }
}
const onProviderDisconnected = async (data, providers) => {
  const { id } = data
  var tmp = providers
  const index = tmp.findIndex(o => o.id === id)
  if (index !== -1) {
    tmp[index].connected = false
  }
  tmp = await this.filterProviders(tmp, this.props.providerId)

  return tmp
}
const onProviderInService = async (data, providers) => {
  const { id, inService } = data

  var tmp = providers
  const index = tmp.findIndex(o => o.id === id)
  if (index !== -1) {
    tmp[index].inService = inService
  }
  tmp = await this.filterProviders(tmp, this.props.providerId)
  return tmp
}
