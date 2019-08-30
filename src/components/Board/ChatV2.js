import React from 'react'
import { getUser } from '../../services/auth'
import '../../assets/css/chatV2.css'
import { sendMessage } from '../../services/helpers'

export default class Chat extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { message: '', textMessage: '' }
  }
  componentDidMount() {
    this.props.goBottom('scroll_' + this.props.sid)
  }
  setMessage(e) {
    //console.log(e.target.value)
    if (typeof e.target !== undefined) {
      this.setState({
        message: e.target.value,
      })
    }
  }
  sendMenssageByEnter = async e => {
    if (e.key === 'Enter' && this.state.message.length >= 1) {
      await sendMessage(
        this.props.to,
        this.state.message,
        this.props.orderId,
        this.props.isClientTo,
        false
      )

      await this.props.addNewMessage(this.props.orderId)
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
                      {item.messageType === 'image' ? (
                        <img src={item.message} alt="msnImg" />
                      ) : item.messageType === 'audio' ? (
                        <audio controls className="audioMessage">
                          <source src={item.message} type="audio/mp4" />
                        </audio>
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
              onDrop={event => {
                this.setState({ textMessage: this.props.drop(event) })

                document.getElementById(
                  'ChatTextarea_' + this.props.sid
                ).value = event.dataTransfer.getData('text')

                /*
                const e = {
                  target: { value: event.dataTransfer.getData('text') },
                }
                this.setMessage(e)
                */
                //console.log('event', event.dataTransfer.getData('text'))
              }}
              onDragOver={event => this.props.allowDrop(event)}
              //value={`${this.state.textMessage}`}
            />
          </div>
        </div>
      </div>
    )
  }
}
