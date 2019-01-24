import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: absolute;
  user-select: none;
  align-items: center;
  justify-content: center;
  cursor: default;
  width: 80px;
  background: #e52e4c;
  border-radius: 5px;
  padding: 5px;
  color: #fff;
  text-align: center;
  top: -15px;
  left: -15px;
  opacity: 0.8;
  .line {
    background: #e52e4c;
    position: absolute;
    width: 2px;
    height: 10px;
    bottom: -10px;
    left: 38px;
  }
`

export default class CMarkerClientServicePointer extends React.Component {
  render() {
    return (
      <Wrapper>
        <div>
          Punto de encuentro
          <div className="line" />
        </div>
      </Wrapper>
    )
  }
}
