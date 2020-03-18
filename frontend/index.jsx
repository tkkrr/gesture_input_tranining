import React from 'react'
import { render } from 'react-dom'
import styled from 'styled-components'
import fetch from 'node-fetch'

import KeyboardView from './components/keyboard'
import { TaskIterator } from './js/task_phrase'
import keyCodeString from './js/inputKeyCode'
import { TimerView } from "./components/timer"

const TaskString = styled.h1`
    font-family: Consolas, "Courier New", Courier, Monaco, monospace, "ＭＳ ゴシック", "MS Gothic", Osaka−等幅;
    width: 600px;
    margin-bottom: 1em;
`

const UserInput = styled.input.attrs(props => ({
    hasError: props.hasError || false
}))`
    font-family: Consolas, "Courier New", Courier, Monaco, monospace, "ＭＳ ゴシック", "MS Gothic", Osaka−等幅;
    width: 600px;
    margin-bottom: 2em;
    color: ${ props => props.hasError ? "white" : "black" };
    background: ${ props => props.hasError ? "red" : "none" };
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 4px;
    outline: none;
`

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            message: TaskIterator.next().value,
            nextWord: "",
            hasError: false,
            logger: [],
            compTask: 0
        }
        this.timer = React.createRef()
    }


    onChange(e) {
        if( !this.timer.current.state.isRunning ) this.timer.current.start()

        const inputStr = e.target.value
        if(inputStr === this.state.message) {
            fetch("http://localhost:3000/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify(this.state.logger)
            })
            .catch(error => console.log(error))
            
            this.setState({
                message: TaskIterator.next().value,
                logger: []
            })
            e.target.value = ""
            this.timer.current.stop()
            return
        }

        if( this.state.message.slice(0, inputStr.length) === inputStr ) 
             this.setState( {hasError : false} )
        else this.setState( {hasError : true} )

        const nowWords = inputStr.split(" ")
        const nextWord = this.state.message.split(" ").filter( item => !nowWords.includes(item) )[0]
        this.setState({nextWord: nextWord})
    }


    onKeyDown(e) {
        const char = keyCodeString[e.keyCode]
        if( char.match(/[^a-zA-Z .,:;@0-9_]/) )return // 通常のキー入力で入力されると考えられる文字以外は弾く

        this.setState({
            logger: this.state.logger.concat({
                key: char,
                task: this.state.compTask
            })
        })
    }


    render() {
        return<>
            <TaskString>{ this.state.message }</TaskString>
            <UserInput type="text" 
                       onChange={ e => this.onChange(e) }
                       onKeyDown={ e => this.onKeyDown(e) }
                       hasError={ this.state.hasError }
            />
            <KeyboardView next={this.state.nextWord} word={this.state.nextWord} />
            <TimerView ref={this.timer}/>
        </>
    }
}

render(<App ref={(components) => {window.components = components}}/>, document.getElementById('app'))