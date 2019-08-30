import React from 'react'
import { Link } from 'gatsby'
import arrowDownIcon from '../../images/arrow-down.svg'
import ChatNotificationsCounter from './ChatNotificationsCounter'
import TimerComp from '../Tools/TimerComp'

import { getUser } from '../../services/auth'

export default class TaskItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      //activeTaskFocus: false,
    }
  }

  render() {
    return (
      <div
        onDragStart={e => this.props.onDragStart(e, 'id_' + this.props.t.id)}
        draggable
        className={
          'draggable task ' +
          ' ' +
          this.props.t.service.name +
          ' ' +
          this.props.t.status.name +
          ' ' +
          this.props.t.cssClasses +
          ' ' +
          (this.props.t.appStatus === 'WORKFINISHED' ||
          this.props.t.appStatus === 'FINISHED'
            ? 'wf'
            : '') +
          ' ' +
          (this.props.t.appStatus === 'WORKINPROGRESS' ||
          this.props.t.appStatus === 'STARTED'
            ? 'wip'
            : '') +
          ' ' +
          (this.props.t.appStatus === 'GOING' ? 'going ' : '') +
          (this.props.t.message.length > 0
            ? 'haveNotification not_provider'
            : '') +
          (this.props.t.active ? ' chatFocusBoard' : ' noChatFocus')
        }
        onClick={async e => {
          if (this.props.t.status.name !== 'complete') {
            /*
            await this.setState(prevState => {
              
              return { activeTaskFocus: !prevState.activeTaskFocus }
            })
            */
            //console.log('activeTaskFocus', this.state.activeTaskFocus)
            this.props.activateTask(this.props.t.id, this.props.icon)
          }
        }}
        id={'taskid_' + this.props.t.id}
      >
        <div className={'task-header ' + this.props.t.status.name}>
          {this.props.t.status.name !== 'complete' ? (
            <TimerComp
              orderDate={this.props.t.createdAt}
              status={this.props.t.status.name}
              startImmediately={true}
            />
          ) : (
            <TimerComp
              orderDate={this.props.t.createdAt}
              status={this.props.t.status.name}
              startImmediately={false}
            />
          )}
          <div id="ProviderState">{this.props.t.appStatus}</div>
        </div>
        <div className="taskHead">
          <div
            className={'taskVisualTraking'}
            style={{ background: this.props.t.color }}
          >
            {this.props.t.client !== null
              ? this.props.t.client.name.charAt(0) +
                this.props.t.client.lastName.charAt(0)
              : ''}
          </div>
          <div className="clientName">
            {this.props.t.client !== null
              ? this.props.t.client.name + ' ' + this.props.t.client.lastName
              : ''}
          </div>
        </div>
        <div className="task-data">
          {/*<span className="service">
            <img
              src={require('../../images/' + this.props.icon)}
              alt={this.props.t.service.category}
            />
            </span>*/}
          <div>
            <b>Servicio:</b>{' '}
            <b className="serviceTitle">{this.props.t.service.name}</b> <br />
            <b>Proveedor:</b>{' '}
            {this.props.t.provider !== null
              ? this.props.t.provider.busnessName
              : 'No definido'}{' '}
            <br />
            <b>Creada el:</b> {this.props.t.createdAt} <br />
            {/*<b>Locación: </b> {this.props.t.country} / {this.props.t.city}*/}
          </div>
        </div>
        <div className="task-footer">
          <ChatNotificationsCounter t={this.props.t} />
          {getUser().type !== 'operator' ? (
            <div className="operator">
              {this.props.t.operator !== null ? (
                <div>
                  <span>
                    {this.props.t.operator.name.charAt(0) +
                      this.props.t.operator.lastName.charAt(0)}
                  </span>
                  <div className="dropdownOperatorData">
                    <b>Nombre:</b>{' '}
                    {this.props.t.operator.name +
                      ' ' +
                      this.props.t.operator.lastName}{' '}
                    <br />
                    <b>Email:</b> {this.props.t.operator.email} <br />
                    <b>Teléfono:</b> {this.props.t.operator.phone}
                    <br />
                    <b>Tipo:</b> {this.props.t.operator.type}
                    <br />
                  </div>
                </div>
              ) : (
                <Link to="" className="btn-nbg">
                  Asignar <img src={arrowDownIcon} alt="Asignar" />
                </Link>
              )}
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    )
  }
}
