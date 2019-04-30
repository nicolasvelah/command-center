import React from 'react'
import { Link } from 'gatsby'
import arrowDownIcon from '../../images/arrow-down.svg'
import ChatNotificationsCounter from './ChatNotificationsCounter'

import { getUser } from '../../services/auth'

export default class TaskItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div
        onDragStart={e => this.props.onDragStart(e, 'id_' + this.props.t.id)}
        draggable
        className={
          'draggable task ' +
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
            : '')
        }
        onClick={e => this.props.activateTask(this.props.t.id)}
        id={'taskid_' + this.props.t.id}
      >
        <div className="task-header">
          <div className="category-icon">
            <img
              src={require('../../images/' + this.props.icon)}
              alt={this.props.t.service.category}
            />
          </div>
          <h3>{this.props.t.service.name}</h3>
          <div id="ProviderState">{this.props.t.appStatus}</div>
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
        <p className="task-data">
          <b>Cliente:</b>{' '}
          {this.props.t.client.name + ' ' + this.props.t.client.lastName} <br />
          <b>Proveedor:</b> {this.props.t.provider.busnessName} <br />
          <b>Creada el:</b> {this.props.t.createdAt} <br />
          <b>Locación: </b> {this.props.t.country} / {this.props.t.city}
        </p>
        <div className="task-footer">
          <ChatNotificationsCounter t={this.props.t} />
        </div>
      </div>
    )
  }
}
