import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'

import Header from './header'
import NavBar from './navBar'
import '../assets/css/Layout.css'
import { isLoggedIn } from '../services/auth'
import {
  initializeFirebase,
  askForPermissioToReceiveNotifications,
} from '../services/push-notification'

const initFirebase = async () => {
  await initializeFirebase()
  askForPermissioToReceiveNotifications()
}

const Layout = ({ children }) => {
  if (isLoggedIn()) {
    initFirebase()
  }
  return (
    <StaticQuery
      query={graphql`
        query SiteTitleQuery {
          site {
            siteMetadata {
              title
            }
          }
        }
      `}
      render={data => (
        <>
          <Header siteTitle={data.site.siteMetadata.title} />
          <div
            style={{
              margin: '0 auto',
              padding: '0px 1.0875rem 1.45rem',
              paddingTop: 0,
            }}
          >
            <NavBar />
            {children}
          </div>
        </>
      )}
    />
  )
}
Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
