import React from 'react'

export default class Svg extends React.PureComponent {
  render() {
    return (
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={this.props.viewBox}
        className={this.props.svgClass}
        onClick={
          this.props.svgOnClick !== undefined
            ? e => this.props.svgOnClick(this.props.svgOnClickVal)
            : null
        }
      >
        <title>{this.props.title}</title>
        <g id="icomoon-ignore" />
        <path fill={this.props.svgFill} d={this.props.svgPathOne_d} />
        {this.props.svgPathTow_d !== undefined ? (
          <path fill={this.props.svgFill} d={this.props.svgPathTow_d} />
        ) : null}
      </svg>
    )
  }
}
