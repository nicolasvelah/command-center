import React from 'react'
import ChatNotificationsCounter from './ChatNotificationsCounter'
//import { save, get } from '../../services/Storage'
//import scrollIntoView from 'scroll-into-view'
//import Chat from './Chat'

export default class ChatContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Menssage: '',
      to: null,
      orderId: null,
      isClientTo: true,
      id911: null,
      openChat: false,
    }
  }
  componentDidMount() {
    this.haveToOpenChat()
  }

  haveToOpenChat = () => {
    let haveToOpen = false
    this.props.openChat.filter(item => {
      if (item === this.props.item.id) {
        haveToOpen = true
      }
      return item
    })
    this.setState({ openChat: haveToOpen })
  }
  openChatTrigerLocal = async id => {
    await this.props.openChatTriger(id)
    this.haveToOpenChat()
    /*let activetask = get('activeTasks')
    activetask = await activetask.filter(item => {
      if (item.id === id) {
        item.status.name = ''
      }
      return item
    })

    save('activeTasks', this.activeTask)*/
  }

  render() {
    const { item, desactivateTask, trigerColumn } = this.props
    console.log('item', item)
    return (
      <div
        className={
          item.message.length > 0
            ? 'chat-container haveNotification not_provider'
            : 'chat-container'
        }
        id={item.id}
      >
        <div
          className={
            (item.status.name === 'notresponse'
              ? 'notresponse'
              : item.status.name === 'standby'
              ? 'standby'
              : item.status.name === 'live'
              ? 'live'
              : 'not-state') + ' subcontainer '
          }
        >
          <div className="ChatHeader">
            <div className="category-icon">
              <img
                src={require('../../images/' + item.icon)}
                alt={item.service.category}
              />
            </div>
            <div className="clientName">
              {item.client.name + ' ' + item.client.lastName}
            </div>
            <div className="ChatContainerTools">
              <div
                onClick={e => {
                  e.preventDefault()
                  this.openChatTrigerLocal(item.id)
                }}
                className="openChat"
              >
                <div className="openBar" />
              </div>
              <div
                onClick={e => {
                  e.preventDefault()
                  trigerColumn('notresponse', item.id)
                }}
                className="NotAswere"
              >
                <img
                  src={require('../../images/flag-red.svg')}
                  alt="Sin Respuesta"
                />
              </div>
              <div
                onClick={e => {
                  e.preventDefault()
                  desactivateTask(item.id)
                }}
                className="closeChat"
              >
                X
              </div>

              <div className="ChatNotificationsCounter">
                <ChatNotificationsCounter t={item} />
              </div>
            </div>
          </div>
          {this.state.openChat ? (
            <div className="chatTool">
              <div className="ChatClient">
                {/*<Chat
              setMenssage={this.setMenssage}
              sendMenssage={this.sendMenssage}
              sendMenssageByEnter={this.sendMenssageByEnter}
              isClientTo={true}
              userId={item.client.id}
              messagesTask={this.props.messagesTask.client}
              id="chatClient"
              idInput="client"
              is911={false}
              scrollToBottom={this.scrollToBottom}
            />*/}
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    )
  }
}
