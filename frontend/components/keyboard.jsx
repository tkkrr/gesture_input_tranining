import React from 'react'
import styled from 'styled-components'
import { Stage, Layer, Shape, Circle } from 'react-konva'
import Konva from 'konva'

import Spline from '../js/spline'

const KeyboardRow = styled.ul`
    display: flex;
    list-style: none;
    margin: 16px auto;
    &:nth-of-type(2n){
        margin-left: 24px;
    }
    &:nth-of-type(3n){
        margin-left: 60px;
    }
`

const KeyboardKey = styled.li.attrs(props => ({
    next: props.next || false
}))`
    display: flex;
    align-items: center;
    justify-content: center;
    border: solid 1px #ccc;
    border-radius: 4px;
    width: 60px;
    height: 60px;
    margin-right: 16px;
    color: ${props => props.next ? "white" : "lightgrey"};
    background: ${ props => props.next ? "orange" : "none" };
`


class StrokeLine extends React.Component {

    constructor(props){
        super(props)
        this.state = this.getWordStrokePoint(props.word || "some")
    }

    getWordStrokePoint(word) {
        const index2position = [
            {x:  70, y:  48}, {x: 148, y:  48}, {x: 226, y:  48}, {x: 304, y:  48}, {x: 382, y:  48},
            {x: 460, y:  48}, {x: 538, y:  48}, {x: 616, y:  48}, {x: 694, y:  48}, {x: 772, y:  48},
        
            {x:  94, y: 124}, {x: 172, y: 124}, {x: 250, y: 124}, {x: 328, y: 124}, {x: 406, y: 124},
            {x: 484, y: 124}, {x: 562, y: 124}, {x: 640, y: 124}, {x: 718, y: 124},
        
            {x: 130, y: 200}, {x: 208, y: 200}, {x: 286, y: 200}, {x: 364, y: 200}, {x: 442, y: 200},
            {x: 520, y: 200}, {x: 598, y: 200}, {x: 676, y: 200}
        ]
    

        const the  = word.split("").map( item => this.props.layout.flat().indexOf(item) )

        const theX = the.map( item => index2position[item].x )
        const theY = the.map( item => index2position[item].y )

        const spX = new Spline()
        const spY = new Spline()
        spX.init(theX)
        spY.init(theY)

        const resolution = 100

        return {
            word: word,
            pointX: [...Array( (theX.length-1) * resolution ).keys()].map(t => spX.culc(t/resolution)),
            pointY: [...Array( (theY.length-1) * resolution ).keys()].map(t => spY.culc(t/resolution))
        }
    }

    componentDidMount(){
        const anim = new Konva.Animation(frame => {
            const strokeTime = 500 * this.state.word.length
            this.circle.x( this.state.pointX[Math.floor( frame.time%strokeTime/strokeTime * this.state.pointX.length)] )
            this.circle.y( this.state.pointY[Math.floor( frame.time%strokeTime/strokeTime * this.state.pointY.length)] )
        }, this.circle.getLayer())

        anim.start()
    }

    componentDidUpdate(prevProps) {
        if (this.props.word !== prevProps.word) {
            this.setState(this.getWordStrokePoint(this.props.word))
        }
    }

    render(){
        return <Stage width={820} height={250} style={{"position": "absolute"}}>
            <Layer>
                <Shape
                    sceneFunc={(context, shape) => {
                        let points = [null, null, null, null]

                        for(let t = -1; t < this.state.pointX.length; t++ ) {
                            [ points[0], points[1], points[2] ] = [ points[1], points[2], { X: this.state.pointX[t], Y: this.state.pointY[t]} ]
                            if(points[0] == null) continue
                            
                            let [p0, p1, p2] = [ points[0], points[1], points[2] ]
                            let [x0, y0] = [ (p0.X + p1.X) / 2, (p0.Y + p1.Y) / 2 ]
                            let [x1, y1] = [ (p1.X + p2.X) / 2, (p1.Y + p2.Y) / 2 ]
                            
                            context.beginPath()
                            context.lineWidth = 5.5 - 5 * t / this.state.pointX.length
                            context.moveTo(x0, y0)
                            context.quadraticCurveTo(p1.X, p1.Y, x1, y1)
                            context.stroke()
                        }

                        context.fillStrokeShape(shape)
                    }}
                    stroke={"black"}
                    lineJoin={"round"}
                />
                <Circle 
                    ref={node => {
                        this.circle = node
                    }}
                    x={this.state.pointX[0]}
                    y={this.state.pointY[0]}
                    radius={15}
                    fill="green"
                />
            </Layer>
        </Stage>
    }
}



const KeyboardView = props => {
    const layout = [
        ["q","w","e","r","t","y","u","i","o","p"],
        ["a","s","d","f","g","h","j","k","l"],
        ["z","x","c","v","b","n","m",","]
    ]

    return <div>
        <StrokeLine word={props.word} layout={layout}/>
        {layout.map( (row, rowIndex) => 
            <KeyboardRow key={rowIndex}>
                {row.map( item => 
                    <KeyboardKey key={item} next={props.next.includes(item)}>
                        {item.toUpperCase()}
                    </KeyboardKey>)
                }
            </KeyboardRow>
        )}
    </div>
}

export default KeyboardView