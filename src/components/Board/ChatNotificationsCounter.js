import React from 'react'
import notifications from '../../images/notifications_none.svg'

export default class ChatNotificationsCounter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    //console.log('CLIENT', this.props.t.client.name)
    //console.log('this.props.t.message', this.props.t)
    return (
      <div>
        <img
          src={notifications}
          alt="notifications"
          className={'notificationIcon notProvider '}
        />

        <div className={'notificationNumber notProvider '}>
          {this.props.t.message.length > 0 ? this.props.t.message.length : 0}
        </div>

        <img
          src={notifications}
          alt="notifications"
          className="notificationIcon notClient"
        />
      </div>
    )
  }
}
