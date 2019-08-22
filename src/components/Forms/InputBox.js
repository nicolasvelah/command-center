import React from 'react'
import InputMask from 'react-input-mask'

export default class InputBox extends React.PureComponent {
  render() {
    return (
      <div>
        <label>{this.props.name}</label>
        {this.props.mask ? (
          <InputMask
            {...this.props}
            mask={this.props.mask}
            maskChar=" "
            defaultValue={this.props.val}
            onChange={this.props.onchange}
          />
        ) : (
          <input
            name={this.props.name}
            defaultValue={this.props.val}
            onChange={this.props.onchange}
          />
        )}
      </div>
    )
  }
}
