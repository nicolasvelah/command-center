import React from 'react'
import send from '../../images/send.svg'
import '../../assets/css/chatV2.css'

export default class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {}

  render() {
    return (
      <div className="chatContainerV2">
        <div className="chatV2">
          <div className="mensagessContainerV2">
            <div className="mensagessV2" />
          </div>
        </div>
        <div className="mensagessFormV2">
          <div id={'chat-'}>
            <textarea
              rows="5"
              cols="60"
              type="text"
              className="ChatInput"
              placeholder="Escribe un mensaje"
              onChange={e => {}}
              onKeyPress={e => {}}
            />
            <img src={send} alt="" className="sendMenssage" onClick={e => {}} />
          </div>
        </div>
      </div>
    )
  }
}
