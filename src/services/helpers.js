import axios from 'axios'
import { getUser } from './auth'
import { toast } from 'react-toastify'

export const operatorsAll = async () => {
  try {
    const data = await axios.post(
      `${process.env.API_URL}/getOperators`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': getUser().token,
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
  const messages = await axios.post(
    `${process.env.API_URL}/getMessages`,
    {
      orderId: id,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': getUser().token,
      },
    }
  )

  return messages
}

export const notesAll = async id => {
  const notes = await axios.post(
    `${process.env.API_URL}/orders/getNotes`,
    {
      orderId: id,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': getUser().token,
      },
    }
  )
  return notes
}

export const updateChatState = async orderId => {
  try {
    await axios.post(
      `${process.env.API_URL}/updateChatState/` + orderId,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': getUser().token,
        },
      }
    )
    //console.log('Exito en updateChatState')
  } catch (error) {
    console.log('Error en updateChatState', error.message)
  }
  return
}

export const getAllTasks = async () => {
  try {
    const tasks = await axios.post(
      `${process.env.API_URL}/orders/getOrders`,
      {},
      {
        headers: {
          'x-access-token': getUser().token,
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
      activeTasks.map(itemAc => {
        if (item.id === itemAc.task.id) {
          item.color = itemAc.task.color
          generate = false
        }
        return itemAc
      })
      if (generate) {
        item.color = colorGenerator()
      }

      return item
    })
    //console.log('tasks ', decryptedData)
    return decryptedData
  } catch (err) {
    console.log(err)
    return err
  }
}
const colorGenerator = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (var i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)]
  return color
}
export const updateStatus = async (id, cat) => {
  return await axios.post(
    `${process.env.API_URL}/orders/updateStatus`,
    {
      statusName: cat,
      orderId: id,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': getUser().token,
      },
    }
  )
}
