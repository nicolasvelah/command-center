import firebase from 'firebase/app'
import 'firebase/messaging'
import axios from 'axios'
import { getUser } from '../services/auth'

export const initializeFirebase = () => {
  if (typeof window !== 'undefined') {
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

export const askForPermissioToReceiveNotifications = async () => {
  try {
    const messaging = firebase.messaging()
    await messaging.requestPermission()
    const token = await messaging.getToken()
    console.log('token do usuário:', token)
    const data = { token: token }

    await axios.post(`${process.env.API_URL}/updateToken`, data, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': getUser().token,
      },
    })

    messaging.onMessage(function(payload) {
      console.log('Message received. ', payload)
    })

    return token
  } catch (error) {
    console.error(error)
  }
}
