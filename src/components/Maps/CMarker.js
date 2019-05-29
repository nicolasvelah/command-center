import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  margin-left: -15px;
  margin-top: -15px;
  z-index: 999;
  border: 2px solid #fff;
  border-radius: 50%;
  user-select: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  .info {
    display: none;
  }
  &.active .info {
    display: block;
    position: absolute;
    bottom: 38px;
    width: 200px;
    padding: 10px;
    border-radius: 3px;
    color: #333;
    left: -95px;
    -webkit-box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.3);
    box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.3);
  }
  &.active .info:before {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 7px 7px 0 8px;
    border-color: #fff transparent transparent transparent;
  }
  &.conect {
  }
  &.disconect {
    border-color: red;
  }
`

export default class CMarker extends React.Component {
  state = {
    active: false,
  }

  //improve performance
  /*shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state
  }*/

  render() {
    const { id, info } = this.props
    const { active } = this.state

    return typeof info !== undefined ? (
      <Wrapper
        className={
          `${active ? 'active ' : ''}` +
          (this.props.clientDataState ? 'conect' : 'disconect')
        }
        style={{ backgroundColor: this.props.color }}
        onClick={() => this.setState({ active: !active })}
      >
        {`${info.name.charAt(0)}${info.lastName.charAt(0)}`}

        <div className="info" style={{ backgroundColor: '#fff' }}>
          <p style={{ margin: 0, padding: 0 }}>
            <b>ID: {id}</b>
          </p>
          <p style={{ margin: 0, padding: 0 }}>
            {info.name} {info.lastName}
          </p>
        </div>
      </Wrapper>
    ) : (
      ''
    )
  }
}
