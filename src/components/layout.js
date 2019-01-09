import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import axios from 'axios'

import Header from './header'
import NavBar from './navBar'
import '../assets/css/Layout.css'
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
            <Header siteTitle={data.site.siteMetadata.title} />
            <div
              style={{
                margin: '0 auto',
                padding: '0px 1.0875rem 1.45rem',
                paddingTop: 0,
              }}
            >
              <NavBar />
              {this.props.children}
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
