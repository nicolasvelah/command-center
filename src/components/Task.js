import React, { Component } from 'react'

export default class Task extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {}

  render() {
    console.log(this.props.task)
    return (
      <div className="task">
        {typeof this.props.task !== 'undefined' &&
        this.props.task !== null &&
        this.props.task.length > 0 ? (
          <div>
            <div className="client">
              <h1>Cliente</h1>
              <div>Nombre: {this.props.task[0].client.name}</div>
              <div>Apellido: {this.props.task[0].client.lastName}</div>
              <div>Cédula: {this.props.task[0].client.idCard}</div>
              <div>Tipo de sangre: {this.props.task[0].client.bloodType}</div>
              <div>Email: {this.props.task[0].client.email}</div>
              <div>Cumpleaños: {this.props.task[0].client.birthday}</div>
              <div>Phone: {this.props.task[0].client.phone}</div>
            </div>
            <div className="provider">
              <h1>Proveedor</h1>
              <div>Nombre: ????</div>
              <div>
                Nombre del negocio: {this.props.task[0].provider.busnessName}
              </div>
              <div>Description: {this.props.task[0].provider.descriptio}</div>
              <div>Rate: {this.props.task[0].provider.rate}</div>
              <div>Email: ???</div>
              <div>Phone: ???</div>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    )
  }
}
