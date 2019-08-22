import firebase from 'firebase/app'
import 'firebase/messaging'
import axios from 'axios'
import { getAccessToken } from '../services/auth'

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
    //console.log('paso 2 messaging', messaging)
    await messaging.requestPermission()
    //console.log('solicito permiso')
    const token = await messaging.getToken()
    //console.log('paso 4 ')
    const accessToken = await getAccessToken()
    await axios.post(
      `${process.env.API_URL}/updateToken`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': accessToken,
          token: token,
        },
      }
    )
    //console.log('token de usuário:', token)
    return messaging
    //}
  } catch (error) {
    console.error('Errtor de FB perimisos', error)
    return false
  }
}
