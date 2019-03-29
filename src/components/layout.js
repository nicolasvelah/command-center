import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

import Header from './header'
import NavBar from './navBar'
import '../assets/css/layout.css'
import { isLoggedIn } from '../services/auth'
import { initializeFirebase } from '../services/push-notification'

import favicon16 from '../images/favicon-16x16.png'
import favicon32 from '../images/favicon-32x32.png'

const initFirebase = async () => {
  await initializeFirebase()
}
export default class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tasks: [],
      firebaseSW: false,
    }
  }

  componentDidMount() {
    if (isLoggedIn() && !this.state.firebaseSW) {
      initFirebase()
      this.setState({
        firebaseSW: true,
      })
    }
  }

  render() {
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
            <Helmet title="Command Center - PAS-HQ">
              <link
                rel="icon"
                type="image/png"
                sizes="32x32"
                href={favicon32}
              />
              <link
                rel="icon"
                type="image/png"
                sizes="16x16"
                href={favicon16}
              />
              <meta name="msapplication-TileColor" content="#da532c" />
              <meta name="theme-color" content="#000" />
              {typeof window !== 'undefined' ? (
                !window.google ? (
                  <script
                    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCW_VtwnO2cCNOYEGkd3tigdoCxeRxAnU4&libraries=places"
                    async
                    defer
                  />
                ) : (
                  ''
                )
              ) : (
                ''
              )}
              <link
                href="https://fonts.googleapis.com/css?family=Roboto+Condensed:700|Yantramanav:300"
                rel="stylesheet"
              />
            </Helmet>
            <Header siteTitle={data.site.siteMetadata.title} />
            <div className="container">
              <NavBar />
              <div className="content">{this.props.children}</div>
            </div>
          </>
        )}
      />
    )
  }
}
Layout.propTypes = {
  children: PropTypes.node.isRequired,
}
