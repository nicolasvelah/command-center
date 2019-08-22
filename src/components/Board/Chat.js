import React from 'react'

import { getUser } from '../../services/auth'
//import send from '../../images/send.svg'
import '../../assets/css/chat.css'

export default class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      messagesTaskTemp: [],
    }
  }
  componentDidMount() {
    this.props.scrollToBottom(this.props.id)
    this.setState({
      messagesTaskTemp: this.props.messagesTask,
    })
  }
  componentDidUpdate() {
    //console.log('this.props.messagesTask', this.props.messagesTask)
    //console.log('this.state.messagesTaskTemp', this.state.messagesTaskTemp)
    if (!this.isEqual(this.props.messagesTask, this.state.messagesTaskTemp)) {
      this.props.scrollToBottom(this.props.id)
      this.setState({
        messagesTaskTemp: this.props.messagesTask,
      })
    }
  }
  isEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false
    for (var i = arr1.length; i--; ) {
      if (arr1[i] !== arr2[i]) return false
    }

    return true
  }

  render() {
    //console.log('mesajers para esta tarea', this.props.messagesTask)
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
                        getUser().name + ' ' + getUser().lastName === item.name
                          ? 'message itsMeAlign'
                          : 'message'
                      }
                    >
                      <div
                        key={item.id}
                        className={
                          getUser().name + ' ' + getUser().lastName ===
                          item.name
                            ? 'msm itsMe '
                            : 'msm notMe '
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
                  //console.log(el)
                  this.messagesEnd = el
                }}
                id={this.props.id}
              />
            </div>
          </div>
        </div>
        <div className="mensagessForm">
          <form
            id={'chat-' + this.props.idInput}
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <textarea
              type="text"
              className="input"
              placeholder="Escribe un mensaje"
              onChange={e =>
                this.props.setMenssage(
                  e,
                  this.props.isClientTo,
                  this.props.userId,
                  this.props.is911,
                  this.props.id
                )
              }
              style={{
                resize: 'none',
                width: '90%',
                marginTop: '20px',
                overflow: 'hidden',
              }}
              rows="2"
              onKeyPress={this.props.sendMenssageByEnter}
            />
            {/*<img
              src={send}
              alt=""
              className="sendMenssage"
              onClick={this.props.sendMenssage}
<<<<<<< HEAD:src/components/Chat.js
              style={{
                width: '5%',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            /*/}
          </form>
        </div>
      </div>
    )
  }
}
