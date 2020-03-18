import React from 'react'
import styled from 'styled-components'

const TimeString = styled.p`
    font-family: Consolas, "Courier New", Courier, Monaco, monospace, "ＭＳ ゴシック", "MS Gothic", Osaka−等幅;
    font-size: 12px;
    color: #ccc;
`

export class TimerView extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            time: 0,
            interval: Date.now(),
            isRunning: false
        }
        this.timer = null
    }

    start() {
        this.setState({
            isRunning: true,
            interval: Date.now()
        })

        this.timer = setInterval( () => {
            this.setState({
                time: Date.now() - this.state.interval
            })
        }, 50 )
    }

    stop() {
        clearInterval(this.timer)
        this.timer = null
        this.setState({
            isRunning: false
        })
        console.log(this.state.time)
    }

    getTimeString(time) {
        const      ms = `000${time % 1000}`.slice(-3)
        const seconds = Math.floor( time / 1000 )
        return `${seconds}:${ms}`
    }

    render() {
        return <TimeString>{this.getTimeString(this.state.time)}</TimeString>
    }
}