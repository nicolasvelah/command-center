import React from 'react'
import { navigate } from 'gatsby'
import { isLoggedIn } from '../../services/auth'
import { Provider } from 'mobx-react'
import stores from '../../mobx/'

const PrivateRoute = ({ component: Component, location, ...props }) => {
  if (!isLoggedIn() && location.pathname !== `/app/login`) {
    // If the user is not logged in, redirect to the login page.
    navigate(`/app/login`)
    return null
  }

  return (
    <Provider mapStore={stores.mapStore}>
      <Component {...props} />
    </Provider>
  )
}

export default PrivateRoute
