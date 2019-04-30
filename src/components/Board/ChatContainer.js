import React from 'react'
import ChatNotificationsCounter from './ChatNotificationsCounter'

export default class ChatContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { item } = this.props
    return (
      <div className="chat-container">
        {item.service.name}
        {item.client.name + ' ' + item.client.lastName}
        <ChatNotificationsCounter t={item} />
      </div>
    )
  }
}
