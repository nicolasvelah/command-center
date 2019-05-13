import React from 'react'

export default class SelectBox extends React.Component {
  render() {
    return (
      <div>
        <label>{this.props.name}</label>
        <select>{this.props.options}</select>
      </div>
    )
  }
}
