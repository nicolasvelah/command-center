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
    bottom: -0px;
    left: -76px;
  }
  .line {
    width: 2px;
    height: 10px;
    margin: auto;
  }
  .addressText {
    width: auto;
    max-width: 200px;
    min-width: 150px;
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
    p {
      margin-bottom: 0px;
    }
  }
`

const RouteData = styled.div`
  position: absolute;
  display: flex;
  top: -18px;
  div {
    background: #fff;
    color: #333;
    font-weight: bold;
    margin-right: 5px;
    padding: 2px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border: 1px solid #999;
    border-bottom: none;
  }
`

export default class CMarkerClientServicePointer extends React.Component {
  render() {
    return (
      <Wrapper>
        <div className="relative">
          <div className="cord-0-0">
            <div
              className="addressText"
              style={{ background: this.props.color }}
            >
              {this.props.destinyData ? (
                <RouteData>
                  {this.props.destinyData.time !== null ? (
                    <div className="timeAdressData">
                      {this.props.destinyData.time} aprox.
                    </div>
                  ) : (
                    ''
                  )}
                  {this.props.destinyData.km !== null ? (
                    <div className="kmAdressData">
                      {this.props.destinyData.km} km
                    </div>
                  ) : (
                    ''
                  )}
                </RouteData>
              ) : null}
              {this.props.address !== '' ? (
                <p>
                  <b>{this.props.preText}</b> {this.props.address} <br />
                </p>
              ) : (
                'No hay datos de direccion'
              )}
            </div>
            <div className="line" style={{ background: this.props.color }} />
          </div>
        </div>
      </Wrapper>
    )
  }
}
