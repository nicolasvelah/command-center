import React from 'react'
import { isLoggedIn } from '../services/auth'
import { navigate } from 'gatsby'

import Layout from '../components/layout'

const IndexPage = () => {
  if (!isLoggedIn()) {
    navigate(`/app/login`)
  }
  return (
    <Layout>
      <div>
        {isLoggedIn() ? (
          <>
            <h1>Bienvenidos al Centro de Comando PAS HQ.</h1>
          </>
        ) : (
          ''
        )}
      </div>
    </Layout>
  )
}

export default IndexPage
