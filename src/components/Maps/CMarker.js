import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  margin-left: -15px;
  margin-top: -15px;
  z-index: 5;
  border: 2px solid #fff;
  border-radius: 50%;
  user-select: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  .info {
    border: 1px solid #333;
    background: rgba(255, 255, 255, 0.5);
    font-size: 9px;
    max-width: 150px;
    min-width: 100px;
    word-break: break-all;
    white-space: pre-wrap;
    line-height: 6px;
    img {
      max-width: 20px;
    }
    p {
      margin: 0px;
      color: #333;
    }
    display: block;
    position: absolute;
    bottom: 38px;
    padding: 3px;
    border-radius: 3px;
    color: #333;
    -webkit-box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.3);
    box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.3);
  }

  .info:before {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 7px 7px 0 8px;
    border-color: #333 transparent transparent transparent;
  }
  .clienteMarker {
    font-weight: bold;
    font-size: 14px;
    line-height: 14px;
  }
  &.conect {
    border-color: #53a93f;
  }
  &.disconect {
    border-color: red;
  }
  &.outTheRadio .info {
    bottom: 20px;
  }
  &.active {
    z-index: 9;
  }
  &.clientMarker {
    z-index: 10 !important;
  }
`

export default class CMarker extends React.PureComponent {
  state = {
    active: false,
  }

  //improve performance
  /*shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state
  }*/

  render() {
    const {
      id,
      info,
      classNameLocation,
      activeProvider,
      isProvider,
    } = this.props
    const { active } = this.state

    return typeof info !== undefined ? (
      <Wrapper
        className={
          `${active ? ' active ' : ''}` +
          (this.props.clientDataState ? 'conect ' : 'disconect ') +
          ' ' +
          (classNameLocation ? classNameLocation : '') +
          (activeProvider === id ? ' mapActiveProvider ' : '') +
          (isProvider ? ' providerMarker ' : ' clientMarker ')
        }
        style={{ backgroundColor: this.props.color }}
        onClick={() => this.setState({ active: !active })}
      >
        <div className="markercontend">
          {`${info.name.charAt(0)}${info.lastName.charAt(0)}`}
        </div>
        <div
          className={'info'}
          style={{ borderColor: this.props.color, borderWidth: '1px' }}
        >
          <div style={{ margin: 0, padding: 0 }}>
            {info.services && isProvider ? (
              info.services.map(service => (
                <span key={service.serviceId}>
                  <img
                    src={service.icon}
                    alt={service.category}
                    className="cateoryImageProviderItem"
                  />
                  {service.servicio + ', '}
                </span>
              ))
            ) : (
              <div>
                {
                  <div className="clienteMarker">
                    <b style={{ color: this.props.color }}>{`${info.name +
                      ' ' +
                      info.lastName}`}</b>
                  </div>
                }
              </div>
            )}
          </div>
        </div>
      </Wrapper>
    ) : (
      ''
    )
  }
}
