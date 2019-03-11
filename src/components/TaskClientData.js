import React from 'react'
import Select from 'react-select'
import { DatePickerInput } from 'rc-datepicker'

export default class TaskClientData extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: this.props.task.client.email,
      bloodType: this.props.task.client.bloodType,
      birthday: this.props.task.client.birthday,
      idCard: this.props.task.client.idCard,
    }
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
      <div className="TaskClientData">
        <div className="inputMasterContainerCD">
          <b>Email:</b>
          <div className="inputContainerCD">
            <input
              name="cedula"
              className="input"
              defaultValue={this.state.email}
              type="email"
            />
          </div>
        </div>

        <div className="inputMasterContainerCD">
          <b>Tipo de sangre:</b>{' '}
          <div className="inputContainerCD">
            <Select
              className="input"
              classNamePrefix="bloodType"
              placeholder="Tipo de sangre"
              isClearable={false}
              isSearchable={true}
              name="bloodTyp"
              defaultValue={this.props.bloodTypes.filter(
                option => option.value === this.state.bloodType
              )}
              options={this.props.bloodTypes}
              onChange={() => {}}
            />
          </div>
        </div>

        <div className="inputMasterContainerCD">
          <b>Cumpleaños:</b>
          <div className="inputContainerCD">
            <DatePickerInput
              onChange={jsDate => {
                console.log(jsDate)
              }}
              value={this.state.birthday}
              className="my-custom-datepicker-component"
            />
          </div>
        </div>

        <div className="inputMasterContainerCD">
          <b>Cédula:</b>{' '}
          <div className="inputContainerCD">
            <input
              name="cedula"
              className="input"
              defaultValue={this.state.idCard}
            />
          </div>
        </div>
        <div className="inputMasterContainerCD">
          <button className="btn" onClick={this.saveClientData}>
            Guardar
          </button>
        </div>
      </div>
    )
  }
}
