import React from 'react'
import { getUser } from '../services/auth'
import send from '../images/send.svg'
import '../assets/css/chat.css'

export default class Chat extends React.Component {
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
                          <div className={item.type}>
                            {item.name}{' '}
                            <span className="userType">{item.type}</span>
                          </div>
                        </div>
                        <div className="message">{item.message}</div>
                        <div className="msmDate">{item.date}</div>
                      </div>
                    </div>
                  ))
                : ''}
            </div>
          </div>
        </div>
        <div className="mensagessForm">
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
          />
          <div className="sendMenssage" onClick={this.props.sendMenssage}>
            <img src={send} alt="" />
          </div>
        </div>
      </div>
    )
  }
}
