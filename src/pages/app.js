import React from 'react'
import { Router } from '@reach/router'
import Layout from '../components/layout'
import PrivateRoute from '../components/privateRoute'
import Board from '../components/board'
import Board911 from '../components/board911'
import Reports from '../components/reports'
import Deliveries from '../components/deliveries'
import Operators from '../components/operators'
import Login from '../components/login'

const App = () => (
  <Layout>
    <Router>
      <PrivateRoute path="/app/board" component={Board} />
      <PrivateRoute path="/app/911" component={Board911} />
      <PrivateRoute path="/app/reports" component={Reports} />
      <PrivateRoute path="/app/deliveries" component={Deliveries} />
      <PrivateRoute path="/app/operators" component={Operators} />
      <Login path="/app/login" />
    </Router>
  </Layout>
)

export default App
