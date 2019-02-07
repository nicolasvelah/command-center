import React, { Component } from 'react'
import { navigate } from 'gatsby'
import { isLoggedIn, logout, getUser } from '../services/auth'
import Modal from './modal'
import CreateTask from './CreateTask'
import '../assets/css/menu.css'
import radar from '../images/radar.svg'
import plus from '../images/plus.svg'
import exit from '../images/exit.svg'
import circleRight from '../images/circle-right.svg'

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
        <div>
          <nav>
            <div className="logo">
              Command Center
              <img src={radar} alt="IsoLogo" />
            </div>
            <div onClick={this.activeMenu} className="menuItem">
              <img
                src={circleRight}
                alt=""
                className={this.state.menuActive ? ' icon IconRotate' : 'icon'}
              />
            </div>
            {isLoggedIn() ? (
              <div>
                {getUser().type !== '911' ? (
                  <div onClick={this.setModal} className="menuItem">
                    Crear Tarea <img src={plus} alt="" className="icon" />
                  </div>
                ) : (
                  ''
                )}

                <div
                  onClick={event => {
                    event.preventDefault()
                    logout(() => navigate(`/app/login`))
                  }}
                  className="menuItem"
                >
                  Salir <img src={exit} alt="" className="icon" />
                </div>
              </div>
            ) : (
              ''
            )}
          </nav>
          {isLoggedIn() && this.state.showModal ? (
            <Modal closeModal={this.setModal} showModal={this.state.showModal}>
              <CreateTask />
            </Modal>
          ) : (
            ''
          )}
        </div>
      </div>
    )
  }
}
