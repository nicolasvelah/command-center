import React, { Component } from 'react'
import { navigate } from 'gatsby'
import { isLoggedIn, logout } from '../services/auth'
import Modal from './modal'
import CreateTask from './CreateTask'
import '../assets/css/menu.css'
import radar from '../images/radar.svg'

export default class navBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      menuActive: false,
    }
  }
  setModal = () => {
    this.setState({ showModal: !this.state.showModal })
  }
  activeMenu = () => {
    this.setState({ menuActive: !this.state.menuActive })
  }
  render() {
    //MODAL

    return (
      <div className={this.state.menuActive ? 'menu' : 'menu inactive'}>
        {isLoggedIn() ? (
          <div>
            <nav>
              <div className="logo">
                Command Center
                <img src={radar} alt="IsoLogo" />
              </div>
              <div onClick={this.activeMenu} className="menuItem">
                <span
                  className={
                    this.state.menuActive
                      ? 'icon-circle-right icon IconRotate'
                      : 'icon-circle-right icon'
                  }
                />
              </div>
              <div onClick={this.setModal} className="menuItem">
                Crear Tarea <span className="icon-plus icon" />
              </div>
              <div
                onClick={event => {
                  event.preventDefault()
                  logout(() => navigate(`/app/login`))
                }}
                className="menuItem"
              >
                Salir <span className="icon-exit icon" />
              </div>
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
