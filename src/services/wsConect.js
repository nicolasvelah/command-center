import { getUser } from './auth'
import axios from 'axios'
import io from 'socket.io-client'

export const conectSocket = async () => {
  try {
    const token = await getUser().token
    const userId = await getUser().userId
    const APP_ID = 1
    const country = await this.getLocationByIP()
    const wsToken = await this.getWsAccessToken(
      userId,
      APP_ID,
      false,
      country,
      token
    )
    //connect with the websocket
    const socket = io(process.env.WS_URL, {
      query: {
        wsToken,
      },
    })
    return socket
  } catch (err) {
    console.log(err.message)
    return false
  }
}
getLocationByIP = async () => {
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
    //console.log('geoapi', response.data)
    return country
  } catch (error) {
    //console.log('no se pudo desde el backend')
    //alert(error.message);
  }
}
getWsAccessToken = async (userId, appId, isClient, country, token) => {
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

  //return a token from ws api
  return response.data
}
