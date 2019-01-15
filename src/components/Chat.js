import React from 'react'
import send from '../images/send.svg'

export default class Chat extends React.Component {
  render() {
    return (
      <div className="chatContainer">
        <div className="chat">
          <div className="mensagessContainer">
            <div className="mensagess">Mensajes</div>
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
