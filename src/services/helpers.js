import axios from 'axios'
import { logoutLocal, getAccessToken } from './auth'
import { toast } from 'react-toastify'

export const sendMessage = async (
  to,
  content,
  orderId,
  isClientTo,
  assistanceMode
) => {
  try {
    const accessToken = await getAccessToken()
    const result = await axios.post(
      `${process.env.API_URL}/sendMessage`,
      {
        to,
        content,
        orderId,
        isClientTo,
        assistanceMode,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': accessToken,
        },
      }
    )
    return result
  } catch (err) {
    console.log(err.message)
    logoutLocal()
    return []
  }
}
export const getMessagesById = async (orderId, to) => {
  const accessToken = await getAccessToken()
  const messages = await axios.post(
    `${process.env.API_URL}/getMessagesById`,
    {
      orderId,
      to,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': accessToken,
      },
    }
  )

  return messages
}
export const operatorsAll = async () => {
  try {
    const accessToken = await getAccessToken()
    const data = await axios.post(
      `${process.env.API_URL}/getOperators`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': accessToken,
        },
      }
    )
    return data
  } catch (err) {
    console.log(err.message)
    return []
  }
}

export const MsmNewTask = title => toast(title)

export const messagesAll = async id => {
  const accessToken = await getAccessToken()
  const messages = await axios.post(
    `${process.env.API_URL}/getMessages`,
    {
      orderId: id,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': accessToken,
      },
    }
  )

  return messages
}

export const notesAll = async id => {
  const accessToken = await getAccessToken()
  const notes = await axios.post(
    `${process.env.API_URL}/orders/getNotes`,
    {
      orderId: id,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': accessToken,
      },
    }
  )
  return notes
}

export const updateChatState = async orderId => {
  try {
    const accessToken = await getAccessToken()
    await axios.post(
      `${process.env.API_URL}/updateChatState/` + orderId,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': accessToken,
        },
      }
    )
    console.log('Exito en updateChatState')
  } catch (error) {
    console.log('Error en updateChatState', error.message)
  }
  return
}

export const getOrderById = async orderId => {
  try {
    const accessToken = await getAccessToken()
    const tasks = await axios.post(
      `${process.env.API_URL}/orders/get-order-by-id/${orderId}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': accessToken,
        },
      }
    )
    var CryptoJS = require('crypto-js')
    let decryptedData = CryptoJS.AES.decrypt(
      tasks.data,
      process.env.CRYPTO_SECRET
    ).toString(CryptoJS.enc.Utf8)
    decryptedData = JSON.parse(decryptedData)

    //const activeTasks = JSON.parse(window.localStorage.getItem('activeTasks'))
    /*
    decryptedData.tasks = decryptedData.tasks.map(item => {
      let generate = true
      if (typeof activeTasks !== undefined && activeTasks !== null) {
        activeTasks.map(itemAc => {
          if (item.id === itemAc.task.id) {
            item.color = itemAc.task.color
            generate = false
          }
          return itemAc
        })
      }
      if (generate) {
        item.color = colorGenerator()
      }

      return item
    })
    */
    //console.log('activeTasks', activeTasks)
    console.log('orderId ', decryptedData.tasks)
    return decryptedData.tasks
  } catch (err) {
    console.log(err)
    return err
  }
}

export const getAllTasks = async () => {
  try {
    const accessToken = await getAccessToken()
    const tasks = await axios.post(
      `${process.env.API_URL}/orders/getOrders`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': accessToken,
        },
      }
    )
    var CryptoJS = require('crypto-js')
    let decryptedData = CryptoJS.AES.decrypt(
      tasks.data,
      process.env.CRYPTO_SECRET
    ).toString(CryptoJS.enc.Utf8)
    decryptedData = JSON.parse(decryptedData)

    const activeTasks = JSON.parse(window.localStorage.getItem('activeTasks'))

    decryptedData.tasks = decryptedData.tasks.map(item => {
      let generate = true
      if (typeof activeTasks !== undefined && activeTasks !== null) {
        activeTasks.map(itemAc => {
          if (item.id === itemAc.task.id) {
            item.color = itemAc.task.color
            generate = false
          }
          return itemAc
        })
      }
      if (generate) {
        item.color = colorGenerator()
      }

      return item
    })

    return decryptedData
  } catch (err) {
    console.log(err)
    return err
  }
}
export const colorGenerator = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (var i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)]
  return color
}
export const updateStatus = async (id, cat) => {
  try {
    console.log('Estado actualizado')
    const accessToken = await getAccessToken()
    const response = await axios.post(
      `${process.env.API_URL}/orders/updateStatus`,
      {
        statusName: cat,
        orderId: id,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': accessToken,
        },
      }
    )
    console.log('Respuesta de UpdateStatus: ', response)
    return true
  } catch (err) {
    console.error(err.message)
    return false
  }
}

export const changeOrderProvider = async (orderId, providerId) => {
  try {
    const accessToken = await getAccessToken()
    await axios.post(
      `${process.env.API_URL}/orders/changeOrderProvider`,
      {
        orderId,
        providerId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': accessToken,
        },
      }
    )
    return true
  } catch (err) {
    console.error(err.message)
    return false
  }
}

export const geocodeLatLng = async (lat, lng, callback) => {
  const google = (window.google = window.google ? window.google : {})
  var latlng = { lat: parseFloat(lat), lng: parseFloat(lng) }
  let geocoder = await new google.maps.Geocoder()

  const address = await geocoder.geocode(
    { location: latlng },
    async (results, status) => {
      let response = null
      if (status === 'OK') {
        if (results[0]) {
          response = results
          //return await results[0].formatted_address
        } else {
          response = 'Geocoder: No results found'
        }
      } else {
        response = 'Geocoder failed due to: ' + status
      }
      callback(response)
    }
  )

  return address
}

export function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

export function getDistanceInMeters(position1, position2) {
  const lat1 = position1.latitude
  const lon1 = position1.longitude
  const lat2 = position2.latitude
  const lon2 = position2.longitude
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1) // deg2rad below
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = Math.round(R * c * 1000) // Distance in km

  return d
}
