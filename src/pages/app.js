import React from 'react'
import { Router } from '@reach/router'
import Layout from '../components/layout'
import PrivateRoute from '../components/privateRoute'
import Profile from '../components/profile'
import Board from '../components/board'
import Login from '../components/login'

const App = () => (
  <Layout>
    <Router>
      <PrivateRoute path="/app/profile" component={Profile} />
      <PrivateRoute path="/app/board" component={Board} />
      <Login path="/app/login" />
    </Router>
  </Layout>
)

export default App
