import React from 'react'
import { navigate } from 'gatsby'
import { handleLogin, isLoggedIn } from '../../services/auth'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

class Login extends React.Component {
  state = {
    username: ``,
    password: ``,
    isLoadingLogin: false,
  }

  handleUpdate = event => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleSubmit = async event => {
    event.preventDefault()
    this.setState({
      isLoadingLogin: true,
    })
    if (!(await handleLogin(this.state))) {
      this.invalidUser()
      this.setState({
        isLoadingLogin: false,
      })
    } else {
      navigate(`/`)
      this.setState({
        isLoadingLogin: false,
      })
    }
  }
  invalidUser = () => toast('Password o usuario invalido.')
  render() {
    if (isLoggedIn()) {
      navigate(`/`)
    }
    return (
      <>
        <h1>Ingreso</h1>
        <form
          method="post"
          onSubmit={event => {
            this.handleSubmit(event)
            //navigate(`/app/board`)
          }}
        >
          <label>
            Username <br />
            <input type="text" name="username" onChange={this.handleUpdate} />
          </label>
          <br />
          <label>
            Password
            <br />
            <input
              type="password"
              name="password"
              onChange={this.handleUpdate}
            />
          </label>
          <br />
          {this.state.isLoadingLogin ? (
            <div className="loaderGif" />
          ) : (
            <input type="submit" value="Log In" className="btn" />
          )}
          <div className="" />
        </form>
        <ToastContainer />
      </>
    )
  }
}

export default Login
