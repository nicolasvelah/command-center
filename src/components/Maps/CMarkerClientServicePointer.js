import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: absolute;
  z-index: 1000;
  text-align: center;
  width: 0px;
  height: 0px;
  .relative {
    position: relative;
  }
  .cord-0-0 {
    position: absolute;
    bottom: -30px;
    left: -80px;
  }
  .line {
    width: 2px;
    height: 10px;
    margin: auto;
    background: #e52e4c;
  }
  .addressText {
    width: auto;
    max-width: 200px;
    min-width: 150px;
    background: #e52e4c;
    border-radius: 5px;
    opacity: 0.8;
    padding: 5px;
    color: #fff;
    user-select: none;
    align-items: center;
    justify-content: center;
    cursor: default;
    word-break: break-all;
    white-space: pre-wrap;
}
  }
`

export default class CMarkerClientServicePointer extends React.Component {
  render() {
    return (
      <Wrapper>
        <div className="relative">
          <div className="cord-0-0">
            <div className="addressText">
              {this.props.address !== ''
                ? this.props.address
                : 'No hay datos de direccion'}
            </div>
            <div className="line" />
          </div>
        </div>
      </Wrapper>
    )
  }
}
