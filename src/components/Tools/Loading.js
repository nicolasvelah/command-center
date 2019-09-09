import React from 'react'
import styled from 'styled-components'

const LoadingConattainer = styled.div`
  .loading {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.6);
    z-index: 600;
  }
  .loading p {
    color: #fff;
    font-family: 'Yanone Kaffeesatz', sans-serif;
    font-size: 12px;
    margin-top: 10px;
  }
  .centerAnimation {
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
      <LoadingConattainer
        className={this.props.view ? 'loading-Container' : ''}
      >
        <div className="loading">
          <div className="centerAnimation">
            <div className="loaderGif" />
          </div>
          <p>Cargando...</p>
          <p>{this.props.message}</p>
        </div>
      </LoadingConattainer>
    )
  }
}
