import React from 'react'
import styled from 'styled-components'
import locatorIcon from '../images/position.svg'

const Wrapper = styled.div`
  position: absolute;
  user-select: none;
  align-items: center;
  justify-content: center;
  cursor: default;
  img {
    position: absolute;
    left:20%;
    top;-50%;
  }
`

export default class CMarkerSelector extends React.Component {
  state = {
    active: false,
  }

  //improve performance
  shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state
  }

  render() {
    const { active } = this.state

    return (
      <Wrapper
        className={`${active ? 'active' : ''}`}
        onClick={() => this.setState({ active: !active })}
      >
        <img src={locatorIcon} alt="" style={{ width: '40px' }} />
      </Wrapper>
    )
  }
}
