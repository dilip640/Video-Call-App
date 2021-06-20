import React, { Component } from 'react';
import './App.css';
import AVreview from './AVreview';

class Track extends Component {
    constructor(props) {
        super(props)
        //access DOM element in order to attatch the track
        this.ref = React.createRef();

        //state of microphone or video
        this.state = {
            recordOff: false
        }

        this.changeRecord = this.changeRecord.bind(this);
    }

    componentDidMount() {
        //uses the ref to attach the track object’s associated audio or video element to the DOM
        if (this.props.track !== null) {
            const child = this.props.track.attach();
            this.ref.current.classList.add(this.props.track.kind);
            this.ref.current.appendChild(child)
        }
    }

    changeRecord() {
        if (this.state.recordOff) {
            this.props.track.enable();
        } else {
            this.props.track.disable()
        }

        this.setState({
            recordOff: !this.state.recordOff
        });
    }

    render() {
        return (
            <div className="track" ref={this.ref}>
                {
                    this.props.local && this.props.track
                        ? <AVreview changeRecord={this.changeRecord} recordOff={this.state.recordOff} type={this.props.track.kind} />
                        : ''
                }

            </div>
        )
    }
}

export default Track;

