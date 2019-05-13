import React from 'react'
import star from '../../images/star-full.svg'

export default class TaskProviderData extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  saveClientData = e => {
    const data = [this.state]
    console.log('Emviar esta data', data)
    var CryptoJS = require('crypto-js')
    var cipherData = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      process.env.CRYPTO_SECRET
    )
    console.log('Data encriptada', cipherData)
  }
  render() {
    return (
      <div className="TaskProviderData">
        <div>
          <b>Nombre del negocio:</b> {this.props.task[0].provider.busnessName}
        </div>
        <div>
          <b>Description:</b> {this.props.task[0].provider.descriptio}
        </div>
        <div>
          <b>Rate:</b>
          {((rows, i) => {
            const context = this
            while (++i <= context.props.task[0].provider.rate - 1) {
              rows.push(
                <div className="stars" key={i}>
                  <img src={star} alt="rate" />
                </div>
              )
            }
            return rows
          })([], 0, 10)}
          <div className="stars">
            <img src={star} alt="rate" />
          </div>
        </div>
        <div>
          <b>Email:</b> {this.props.task[0].provider.user.email}
        </div>
        <div>
          <b>Phone:</b> {this.props.task[0].provider.user.phone}
        </div>
      </div>
    )
  }
}
