import React, { Component } from 'react'
import { navigate } from 'gatsby'
import { getUser, isLoggedIn, logout } from '../services/auth'
import Modal from './modal'
import CreateTask from './CreateTask'

export default class navBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
    }
  }
  setModal = () => {
    this.setState({ showModal: !this.state.showModal })
  }
  render() {
    //MODAL

    const content = { message: '', login: true }
    if (isLoggedIn()) {
      content.message = `Hello, ${getUser().name}`
    } else {
      content.message = 'You are not logged in'
    }

    return (
      <div
        style={{
          display: 'flex',
          flex: '1',
          justifyContent: 'space-between',
          borderBottom: '1px solid #d1c1e0',
        }}
      >
        <span>{content.message}</span>

        {isLoggedIn() ? (
          <div>
            <nav>
              <a
                href="/"
                onClick={event => {
                  event.preventDefault()
                  logout(() => navigate(`/app/login`))
                }}
              >
                Logout
              </a>
              <div onClick={this.setModal}>Crear Tarea</div>
            </nav>
            <Modal setModal={this.setModal} showModal={this.state.showModal}>
              <CreateTask />
            </Modal>
          </div>
        ) : null}
      </div>
    )
  }
}
