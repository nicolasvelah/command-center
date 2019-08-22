import React from 'react'

export default class SelectBox extends React.PureComponent {
  render() {
    return (
      <div>
        <label>{this.props.name}</label>
        <textarea />
      </div>
    )
  }
}
