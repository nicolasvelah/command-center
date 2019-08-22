import React from 'react'
import styled from 'styled-components'
import Timer from 'react-compound-timer'

const TimerContainer = styled.div`
  font-size: 14px;
  display: inline-flex;
  .goTimer {
    color: green;
  }
  .warningTimer {
    color: #ffce00;
  }
  .dangerTimer {
    color: red;
  }
  .timerState {
    margin-left: 5px;
    div {
      width: 15px;
      height: 5px;
      margin: 12px 0px 0px 3px;
      display: inline-block;
    }
    .danger {
      background: red;
    }
    .warning {
      background: #ffce00;
    }
    .go {
      background: green;
    }
  }
`

export default class TimerComp extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      alertState: 0,
      diffMs: new Date() - new Date(this.props.orderDate),
    }
  }
  async UNSAFE_componentWillMount() {
    let { alertState, diffMs } = this.state
    if (diffMs > 120000) {
      alertState = 2
    } else if (diffMs > 60000) {
      alertState = 1
    }

    if (this.props.status !== 'asigned' && this.props.status !== 'complete') {
      diffMs = 0
      alertState = 0
    }
    this.setState({ alertState, diffMs })
  }
  render() {
    return (
      <TimerContainer>
        <div
          className={
            (this.state.alertState >= 2
              ? 'dangerTimer'
              : this.state.alertState >= 1
              ? 'warningTimer'
              : 'goTimer') + ' timerTask'
          }
        >
          <Timer
            initialTime={this.state.diffMs}
            lastUnit="h"
            startImmediately={this.props.startImmediately}
            checkpoints={[
              {
                time: 60000,
                callback: () => this.setState({ alertState: 1 }),
              },
              {
                time: 120000,
                callback: () => this.setState({ alertState: 2 }),
              },
            ]}
          >
            {() => (
              <React.Fragment>
                <Timer.Hours />
                h:
                <Timer.Minutes />
                m:
                <Timer.Seconds />s
              </React.Fragment>
            )}
          </Timer>
        </div>
        <div className="timerState">
          <div className={'go'} />
          {this.state.alertState >= 1 ? <div className={'warning'} /> : ''}
          {this.state.alertState >= 2 ? <div className={'danger'} /> : ''}
        </div>
      </TimerContainer>
    )
  }
}
