import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'
import Header from './Tools/header'
import NavBar from './Tools/navBar'
import { isLoggedIn } from '../services/auth'
import { initializeFirebase } from '../services/push-notification'

import '../assets/css/layout.css'

const initFirebase = async () => {
  await initializeFirebase()
}
export default class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tasks: [],
      firebaseSW: false,
      paddingLeftContent: 70,
      menuActive: false,
    }
    this.setContentPaddingLeft = this.setContentPaddingLeft.bind(this)
  }

  componentDidMount() {
    if (isLoggedIn() && !this.state.firebaseSW) {
      initFirebase()
      this.setState({
        firebaseSW: true,
      })
    }
  }

  setContentPaddingLeft = async () => {
    let { paddingLeftContent, menuActive } = this.state
    if (menuActive) {
      paddingLeftContent = 70
    } else {
      paddingLeftContent = 200
    }
    this.setState({
      paddingLeftContent,
      menuActive: !menuActive,
    })
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
              {typeof window !== 'undefined' ? (
                !window.google ? (
                  <script
                    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCnynwND8x-o856iB4XQgsFR9Fr1vqIYGU&libraries=places"
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
              <meta name="theme-color" content="#0047b3" />
            </Helmet>
            <Header siteTitle={data.site.siteMetadata.title} />
            <div className="container">
              <NavBar setContentPaddingLeft={this.setContentPaddingLeft} />
              <div
                className="content"
                style={{ paddingLeft: this.state.paddingLeftContent }}
              >
                {this.props.children}
              </div>
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
