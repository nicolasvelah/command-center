import firebase from 'firebase/app'
import 'firebase/messaging'
import axios from 'axios'
import { getUser } from '../services/auth'

export const initializeFirebase = () => {
  if (typeof window !== 'undefined') {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        messagingSenderId: process.env.FB_SENDER_ID,
      })
      /*navigator.serviceWorker
      .register('./firebase-messaging-sw.js')
      .then(registration => {
        firebase.messaging().useServiceWorker(registration)
      })*/
    }
  }
}

export const askForPermissioToReceiveNotifications = async () => {
  try {
    const messaging = firebase.messaging()
    await messaging.requestPermission()
    const token = await messaging.getToken()

    await axios.post(
      `${process.env.API_URL}/updateToken`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': getUser().token,
          token: token,
        },
      }
    )
    console.log('token de usuário:', token)
    return messaging
  } catch (error) {
    console.error(error)
    return error
  }
}
