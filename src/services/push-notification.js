import firebase from 'firebase/app'
import 'firebase/messaging'
import axios from 'axios'
import { getUser, getFbtk } from '../services/auth'

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
    console.log('getFbtk() ', getFbtk())

    //if (getFbtk() === null) {
    const messaging = firebase.messaging()
    console.log('paso 2 messaging', messaging)
    await messaging.requestPermission()
    console.log('solicito permiso')
    const token = await messaging.getToken()
    console.log('paso 4 ')

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
    window.localStorage.setItem('fbtk', token)
    return messaging
    //}
  } catch (error) {
    console.error('Errtor de FB perimisos', error)
    return false
  }
}
