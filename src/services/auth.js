const axios = require('axios')
const { navigate } = require('gatsby')

export const isBrowser = () => typeof window !== 'undefined'

export const getFbtk = () =>
  isBrowser() && window.localStorage.getItem('fbtk')
    ? window.localStorage.getItem('fbtk')
    : null

export const getUser = () =>
  isBrowser() && window.localStorage.getItem('user')
    ? JSON.parse(window.localStorage.getItem('user'))
    : {}

const setUser = user => {
  window.localStorage.setItem('user', JSON.stringify(user))
  navigate(`/`)
}

export const handleLogin = async ({ username, password }) => {
  try {
    const dataToSend = {
      email: username,
      password: password,
      isClient: false,
    }
    var CryptoJS = require('crypto-js')

    const loginEncryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToSend),
      process.env.CRYPTO_SECRET
    ).toString()

    console.log('loginEncryptedData:', loginEncryptedData)

    const response = await axios.post(`${process.env.API_URL}/login`, {
      data: loginEncryptedData,
    })
    if (response.data.token != null && response.data.auth === true) {
      getUserData(response.data.token)
      return true
    }
    return false
  } catch (error) {
    console.log(error)
    return false
  }
}
const getUserData = async token => {
  axios
    .post(
      `${process.env.API_URL}/me`,
      {},
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'x-access-token': token,
        },
      }
    )
    .then(async response => {
      response.data.token = token
      setUser(response.data)
    })
    .catch(function(error) {
      console.log(error)
    })
}
export const isLoggedIn = () => {
  const user = getUser()
  return !!user.name
}

export const logout = async callback => {
  await axios.post(
    `${process.env.API_URL}/logout`,
    {},
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'x-access-token': getUser().token,
      },
    }
  )
  setUser({})
  window.localStorage.setItem('fbtk', '')
}

export const logoutLocal = async callback => {
  setUser({})
  window.localStorage.setItem('fbtk', '')
}
