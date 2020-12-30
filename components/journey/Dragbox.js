import React, { Component } from 'react';


export default class Dragbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
        isMoving: false,
        top: 0,
        left: 0,
        originTop: 0,
        originLeft: 0,
        clickTop: 0,
        clickLeft: 0,
        zIndex: 1,
        }
        this.handleStartMove = this.handleStartMove.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleEndMove = this.handleEndMove.bind(this);
    }

    handleStartMove(e) {
        console.log("start")
        this.setState({
        isMoving: true,
        originTop: this.state.top,
        originLeft: this.state.left,
        clickTop: this.props.clickTop,
        clickLeft: this.props.clickLeft,
        zIndex: 2,
        });
    }

    handleMouseMove(e) {
        if(this.state.isMoving) {
            console.log("move")
        e.preventDefault();
        this.setState({
            top: this.state.originTop + (e.clientY - this.state.clickTop),
            left: this.state.originLeft + (e.clientX - this.state.clickLeft),
        });      
        }
    }

    handleEndMove() {
        console.log("end")
        this.setState({
        isMoving: false,
        zIndex: 1,
        });
    }

    render() {
        return(
        <div
            className="dragbox"
            onMouseDown={this.handleStartMove}
            onMouseMove={this.handleMouseMove}
            onMouseUp={this.handleEndMove}
            onMouseLeave={this.handleEndMove}
            style={{
            top: `${this.state.top}px`,
            left: `${this.state.left}px`,
            zIndex: `${this.state.zIndex}`,
            }}
        >
            Dragbox #{this.props.number}
        </div>
        );
    }

}