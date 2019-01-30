const axios = require('axios')
const { navigate } = require('gatsby')

export const isBrowser = () => typeof window !== 'undefined'

export const getUser = () =>
  isBrowser() && window.localStorage.getItem('gatsbyUser')
    ? JSON.parse(window.localStorage.getItem('gatsbyUser'))
    : {}

const setUser = user => {
  window.localStorage.setItem('gatsbyUser', JSON.stringify(user))
  navigate(`/`)
}

export const handleLogin = async ({ username, password }) => {
  try {
    const response = await axios.post(`${process.env.API_URL}/login`, {
      email: username,
      password: password,
      isClient: false,
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
    .catch(function (error) {
      console.log(error)
    })
}
export const isLoggedIn = () => {
  const user = getUser()
  return !!user.name
}

export const logout = callback => {
  setUser({})
  callback()
}
