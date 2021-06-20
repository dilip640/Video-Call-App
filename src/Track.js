import React, { Component } from 'react';
import './App.css';

class Track extends Component {
    constructor(props) {
        super(props)
        //access DOM element in order to attatch the track
        this.ref = React.createRef();
    }

    componentDidMount() {
        //uses the ref to attach the track object’s associated audio or video element to the DOM
        if (this.props.track !== null) {
            const child = this.props.track.attach();
            this.ref.current.classList.add(this.props.track.kind);
            this.ref.current.appendChild(child)
        }
    }

    render() {
        return (
            <div className="track" ref={this.ref}>
            </div>
        )
    }
}

export default Track;
