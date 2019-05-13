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
      isLoadingForm: this.props.isLoadingForm,
    }
  }

  render() {
    console.log('isLoadingForm TCD', this.props.isLoadingForm)
    return (
      <div className="TaskClientData">
        <div className="inputMasterContainerCD">
          <b>Email:</b>
          <div className="inputContainerCD">
            <input
              name="email"
              className="input"
              defaultValue={this.state.email}
              onChange={e => this.props.setEmail(e)}
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
              onChange={e => this.props.setBloodType(e)}
            />
          </div>
        </div>

        <div className="inputMasterContainerCD">
          <b>Cumpleaños:</b>
          <div className="inputContainerCD">
            <DatePickerInput
              value={this.state.birthday}
              className="my-custom-datepicker-component"
              onChange={e => this.props.setBirthday(e)}
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
              onChange={e => this.props.setIdCard(e)}
            />
          </div>
        </div>
        <div className="inputMasterContainerCD">
          {this.props.isLoadingForm ? (
            <div className="loaderGif" />
          ) : (
            <button className="btn" onClick={e => this.props.sendDataClient(e)}>
              Guardar
            </button>
          )}
        </div>
      </div>
    )
  }
}
