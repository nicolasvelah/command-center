import React from 'react'
import styled from 'styled-components'
import locatorIcon from '../../images/position.svg'

const Wrapper = styled.div`
  position: absolute;
  user-select: none;
  align-items: center;
  justify-content: center;
  cursor: default;
  img {
    position: relative;
    left: -11%;
    top: -17px;
  }
`

export default class CMarkerSelector extends React.Component {
  render() {
    return (
      <Wrapper>
        <img
          src={locatorIcon}
          alt=""
          style={{ width: '40px', pointerEvents: 'none' }}
        />
      </Wrapper>
    )
  }
}
