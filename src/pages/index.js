import React from 'react'
import { isLoggedIn, getUser } from '../services/auth'
import { navigate } from 'gatsby'

const IndexPage = () => {
  if (!isLoggedIn()) {
    if (typeof window !== 'undefined') {
      navigate(`/app/login`)
    }
  } else {
    if (typeof window !== 'undefined') {
      let redirect = `/app/board`
      if (getUser().type === '911') {
        redirect = `/app/911`
      }
      navigate(redirect)
    }
  }

  return <div />
}

export default IndexPage
