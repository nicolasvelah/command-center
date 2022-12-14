import React from 'react'
import { getUser } from '../../services/auth'
import '../../assets/css/chatV2.css'
import { sendMessage } from '../../services/helpers'

import Loading from '../Tools/Loading'

export default class Chat extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { message: '', textMessage: '', isLoading: false }
  }
  componentDidMount() {
    //console.log('Drag', this.props.dragStart)
    this.props.goBottom('scroll_' + this.props.sid)
    //console.log('PROPS', this.props.to)
    //console.log('AllMessages', this.props.messagesTask)
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
      //console.log('this.props', this.props)
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
        {this.state.isLoading && <Loading />}
        <div
          className={this.props.dragStart ? 'chatV2 dragging' : 'chatV2'}
          onDrop={async event => {
            const data = JSON.parse(event.dataTransfer.getData('text'))
            //console.log('data recuperada', data)

            if (JSON.parse(data.isClientTo) === this.props.isClientTo) {
              //console.log('Si es el mismo tipo')
              this.props.drop()
              this.setState({ isLoading: true })
              await sendMessage(
                this.props.to,
                data.text,
                this.props.orderId,
                this.props.isClientTo,
                false
              )
              this.setState({ isLoading: false })
            } else {
              console.log('no es el mismo tipo')
            }
          }}
          onDragOver={event => {
            this.props.allowDrop(event)
          }}
          id={'scroll_' + this.props.sid}
        >
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
        <div
          className={
            this.props.dragStart
              ? 'mensagessFormV2 dragging'
              : 'mensagessFormV2'
          }
        >
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
              onKeyPress={async e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  this.props.drop()
                  this.setState({ isLoading: true })
                  await this.sendMenssageByEnter(e)
                  this.setState({ isLoading: false })
                }
              }}
              onDrop={event => {
                const data = JSON.parse(event.dataTransfer.getData('text'))
                this.props.drop()
                if (JSON.parse(data.isClientTo) === this.props.isClientTo) {
                  document.getElementById(
                    'ChatTextarea_' + this.props.sid
                  ).value = data.text

                  this.setState({
                    message: data.text,
                  })
                }
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
