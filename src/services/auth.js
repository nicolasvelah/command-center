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

    //console.log('loginEncryptedData:', loginEncryptedData)

    const response = await axios.post(`${process.env.API_URL}/login`, {
      data: loginEncryptedData,
    })
    if (response.data.token != null && response.data.auth === true) {
      getUserData(response.data.token)
      getRefreshToken(response.data.token)
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
  //window.localStorage.setItem('fbtk', '')
}

export const logoutLocal = async callback => {
  setUser({})
  //window.localStorage.setItem('fbtk', '')
}

/* --------------------------------------------------------------*/
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function refreshToken(user) {
  try {
    const response = await axios({
      method: 'post',
      url: `${process.env.WS_URL}/api/v1/refresh-token`,
      headers: {
        jwt: user.token,
      },
    })
    const { token, expiresIn } = response.data
    user.token = token
    user.expiresIn = expiresIn
    await setUser({ ...user, updatedAt: new Date() })

    return token
  } catch (error) {
    if (error.response && error.response.status) {
      return error.response.status
    }
    throw new Error(error.message)
  }
}

/**
 * this function gets the access token from the secure storage and check if is expired or will be sonn and then, if it is gets a new accessToken
 */
export async function getAccessToken() {
  let user = await getUser()
  console.log('USER', user)
  const { token, expiresIn, updatedAt } = user
  console.log('token getAccessToken', token)
  const currentDate = new Date()
  const tokenDate = new Date(updatedAt)
  //diference in seconds
  const difference = (currentDate.getTime() - tokenDate.getTime()) / 1000

  if (expiresIn - difference >= 60) {
    return token
  }

  // console.log('the token will expires soon or is expired', expiresIn - difference);
  const newToken = await refreshToken(user)
  console.log('new token', newToken)
  if (newToken === 403) {
    console.log('intento 2')
    console.log('valor 1', user.token)
    await sleep(1000) //sleep one second
    user = await getUser()
    console.log('valor 2', user.token)
    const newToken2 = await refreshToken(user)
    console.log('new token 2', newToken2)
    if (newToken === 403 || newToken === 500) {
      throw new Error('Su sesión ha expirado')
    }
    console.log('token refrescado al intento 2', user.token)
    return newToken2
  }
  if (newToken === 500) {
    throw new Error('Su sesión ha expirado')
  }
  console.log('token refrescado al intento 1', user.token)
  return newToken
}

export async function getRefreshToken(token) {
  const response = await axios({
    method: 'post',
    url: `${process.env.WS_URL}/api/v1/new-refresh-token`,
    headers: {
      'Content-Type': 'application/json',
      jwt: token,
    },
  })
  console.log('getRefreshToken', response)
  return response
}
