import React from 'react'
import { getUser } from '../services/auth'
import send from '../images/send.svg'
import '../assets/css/chat.css'
import scrollIntoView from 'scroll-into-view'

export default class Chat extends React.Component {
  scrollToBottom = id => {
    scrollIntoView(document.getElementById(id))
    return
  }

  componentDidMount() {
    this.scrollToBottom(this.props.id)
  }

  componentDidUpdate() {
    this.scrollToBottom(this.props.id)
  }
  render() {
    console.log('mesajers para esta tarea', this.props.messagesTask)
    return (
      <div className="chatContainer">
        <div className="chat">
          <div className="mensagessContainer">
            <div className="mensagess">
              {typeof this.props.messagesTask !== 'undefined'
                ? this.props.messagesTask.map(item => (
                    <div
                      key={item.id}
                      className={
                        getUser().type === item.type
                          ? 'message itsMeAlign'
                          : 'message'
                      }
                    >
                      <div
                        key={item.id}
                        className={
                          getUser().type === item.type
                            ? 'msm itsMe'
                            : 'msm notMe'
                        }
                      >
                        <div className="userData">
                          <div className={'chat-' + item.type}>
                            {item.name}{' '}
                            <span className="userType">{item.type}</span>
                          </div>
                        </div>
                        <div className="message">
                          {item.isImage ? (
                            <img src={item.message} alt="msnImg" />
                          ) : (
                            item.message
                          )}
                        </div>
                        <div className="msmDate">{item.date}</div>
                      </div>
                    </div>
                  ))
                : ''}
              <div
                ref={el => {
                  console.log(el)
                  this.messagesEnd = el
                }}
                id={this.props.id}
              />
            </div>
          </div>
        </div>
        <div className="mensagessForm">
          <form id={'chat-' + this.props.idInput}>
            <input
              type="text"
              className="input"
              placeholder="Escribe un mensaje"
              onChange={e =>
                this.props.setMenssage(
                  e,
                  this.props.isClientTo,
                  this.props.userId
                )
              }
              onKeyPress={this.props.sendMenssageByEnter}
            />
            <img
              src={send}
              alt=""
              className="sendMenssage"
              onClick={this.props.sendMenssage}
            />
          </form>
        </div>
      </div>
    )
  }
}
