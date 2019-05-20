import React from 'react'
import styled from 'styled-components'

const LoadingConattainer = styled.div`
  .loading {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 2;
    text-align: center;
    padding-top: 200px;
  }
  .loading p {
    color: #fff;
    font-family: 'Yanone Kaffeesatz', sans-serif;
    font-size: 12px;
    margin-top: 10px;
  }
  .centerAnimation {
    position: relative;
    margin: auto;
    width: 40px;
    height: 40px;
  }
  .loading .loaderGif {
    margin: 0;
  }
`

export default class Loading extends React.Component {
  render() {
    return (
      <LoadingConattainer>
        <div className="loading">
          <div className="centerAnimation">
            <div className="loaderGif" />
          </div>
          <p>Cargando...</p>
        </div>
      </LoadingConattainer>
    )
  }
}
