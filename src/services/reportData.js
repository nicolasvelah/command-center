import axios from 'axios'
import { logoutLocal, getAccessToken } from './auth'

export const getChartsByService = async (from, to, type) => {
  try {
    const accessToken = await getAccessToken()
    const result = await axios.post(
      `${process.env.API_URL}/getCharts/byService`,
      {
        from,
        to,
        type,
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
    return null
  }
}
