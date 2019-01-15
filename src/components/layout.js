import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'
import axios from 'axios'

import Header from './header'
import NavBar from './navBar'
import '../assets/css/layout.css'
import { isLoggedIn } from '../services/auth'
import { getUser } from '../services/auth'
import { initializeFirebase } from '../services/push-notification'

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

  getMyTasks = async () => {
    const tasks = await axios.post(
      `${process.env.API_URL}/orders/getOrders`,
      {},
      {
        headers: {
          'x-access-token': getUser().token,
        },
      }
    )
    this.setState({
      tasks: tasks.data.tasks,
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
            <Helmet>
              <script
                src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCW_VtwnO2cCNOYEGkd3tigdoCxeRxAnU4&libraries=places"
                async
                defer
              />
              <link
                href="https://fonts.googleapis.com/css?family=Teko:500|Yantramanav:300"
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
