import React, { Component } from 'react'
import { navigate } from 'gatsby'
import { isLoggedIn, logout, getUser } from '../../services/auth'
import Modal from './modal'
import CreateTask from '../Sections/CreateTask'
import SearchPage from '../Sections/SearchPage'
import '../../assets/css/menu.css'
import searchIcon from '../../images/search.svg'
import rocket from '../../images/rocket.svg'
import radar from '../../images/radar.svg'
import board from '../../images/board.svg'
//import plus from '../../images/plus.svg'
//import report from '../../images/report.svg'
import users from '../../images/users.svg'
import exit from '../../images/exit.svg'
import circleRight from '../../images/circle-right.svg'

export default class navBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      menuActive: false,
      content: <CreateTask />,
    }
  }
  setModal = ct => {
    let { content } = this.state
    if (ct === 'ct') {
      content = <CreateTask />
    } else if (ct === 'bs') {
      content = <SearchPage />
    }
    this.setState({ showModal: !this.state.showModal, content })
  }
  activeMenu = () => {
    this.props.setContentPaddingLeft()
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
                  <div>
                    <div
                      onClick={() => this.setModal('bs')}
                      className="menuItem"
                    >
                      Buscar <img src={searchIcon} alt="" className="icon" />
                    </div>
                    <div
                      onClick={event => {
                        event.preventDefault()
                        navigate(`/app/board`)
                      }}
                      className="menuItem"
                    >
                      Tablero <img src={board} alt="" className="icon" />
                    </div>
                    {/*<div
                      onClick={() => this.setModal('ct')}
                      className="menuItem"
                    >
                      Crear Tarea <img src={plus} alt="" className="icon" />
                    </div>*/}
                    {getUser().type === 'supervisor' ? (
                      <div>
                        <div
                          onClick={event => {
                            event.preventDefault()
                            navigate(`/app/deliveries`)
                          }}
                          className="menuItem"
                        >
                          Entregas <img src={rocket} alt="" className="icon" />
                        </div>
                        {/*<div
                          onClick={event => {
                            event.preventDefault()
                            navigate(`/app/reports`)
                          }}
                          className="menuItem"
                        >
                          Monitoreo <img src={report} alt="" className="icon" />
                        </div>*/}
                        <div
                          onClick={event => {
                            event.preventDefault()
                            navigate(`/app/operators`)
                          }}
                          className="menuItem"
                        >
                          Mi Equipo <img src={users} alt="" className="icon" />
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
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
              {this.state.content}
            </Modal>
          ) : (
            ''
          )}
        </div>
      </div>
    )
  }
}
