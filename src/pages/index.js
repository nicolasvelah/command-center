import React from 'react'
import { isLoggedIn } from '../services/auth'
import { navigate } from 'gatsby'

const IndexPage = () => {
  if (!isLoggedIn()) {
    if (typeof window !== 'undefined') {
      navigate(`/app/login`)
    }
  } else {
    if (typeof window !== 'undefined') {
      navigate(`/app/board`)
    }
  }

  return <div />
}

export default IndexPage
