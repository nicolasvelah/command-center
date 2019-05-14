import React, { Component } from 'react'
import { Router } from '@reach/router'
import Layout from '../components/layout'
import PrivateRoute from '../components/Tools/privateRoute'
import Board from '../components/Board/board'
import Board911 from '../components/Board/board911'
import Reports from '../components/Sections/reports'
import Deliveries from '../components/Sections/deliveries'
import Operators from '../components/Sections/operators'
import Login from '../components/Sections/login'
import Wiki from '../components/Sections/Wiki'

export default class App extends Component {
  render() {
    return (
      <Layout>
        <Router>
          <PrivateRoute path="/app/board" component={Board} />
          <PrivateRoute path="/app/911" component={Board911} />
          <PrivateRoute path="/app/reports" component={Reports} />
          <PrivateRoute path="/app/deliveries" component={Deliveries} />
          <PrivateRoute path="/app/operators" component={Operators} />
          <PrivateRoute path="/app/wiki" component={Wiki} />
          <Login path="/app/login" />
        </Router>
      </Layout>
    )
  }
}
