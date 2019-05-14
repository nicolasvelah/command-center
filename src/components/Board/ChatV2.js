import React from 'react'
import { getUser } from '../../services/auth'
import '../../assets/css/chatV2.css'
import { sendMessage } from '../../services/helpers'

export default class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = { message: '', diviciones: null }
  }
  componentDidMount() {
    this.props.goBottom('scroll_' + this.props.sid)
    if (typeof this.props.providerDivicion !== undefined) {
      this.setState({ diviciones: this.props.providerDivicion })
    }
  }
  setMessage(e) {
    console.log(e.target.value)
    if (typeof e.target !== undefined) {
      this.setState({
        message: e.target.value,
      })
    }
  }
  sendMenssageByEnter = e => {
    if (e.key === 'Enter' && this.state.message.length >= 1) {
      sendMessage(
        this.props.to,
        this.state.message,
        this.props.orderId,
        this.props.isClientTo
      )
      this.props.addNewMessage(this.props.orderId)
      document.getElementById('ChatTextarea_' + this.props.sid).value = ''
      this.setState({ message: '' })
    }
  }
  render() {
    //console.log('mesajers para esta tarea', this.props.messagesTask)
    return (
      <div className="chatContainerV2">
        <div className="chatV2" id={'scroll_' + this.props.sid}>
          <div className="mensagessContainerV2">
            <div className="mensagessV2">
              {this.props.messagesTask.map(item => (
                <div
                  key={item.id}
                  className={
                    (getUser().name + ' ' + getUser().lastName === item.name
                      ? 'message itsMeAlign '
                      : 'message ') + ' messageItem'
                  }
                >
                  <div
                    key={item.id}
                    className={
                      getUser().name + ' ' + getUser().lastName === item.name
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
                      <div className="msmDate">{item.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mensagessFormV2">
          <div>
            <textarea
              rows="5"
              cols="60"
              className="ChatInput"
              id={'ChatTextarea_' + this.props.sid}
              placeholder="Escribe un mensaje"
              onChange={e => {
                this.props.goBottom('scroll_' + this.props.sid)
                this.setMessage(e)
              }}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  this.sendMenssageByEnter(e)
                }
              }}
            />
          </div>
        </div>
      </div>
    )
  }
}