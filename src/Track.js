import React, { Component } from 'react';
import './App.css';
import AVreview from './AVreview';
import ChatDisplay from './ChatDisplay';

class Track extends Component {
    constructor(props) {
        super(props)

        //access DOM element in order to attatch the track
        this.ref = React.createRef();

        //state of microphone or video
        this.state = {
            recordOff: false,
            //messages: []
        }

        this.changeRecord = this.changeRecord.bind(this);
    }

    componentDidMount() {
        //uses the ref to attach the track object’s associated audio or video element to the DOM
        if (this.props.track !== null) {
            if (this.props.track.kind !== 'data') {
                const child = this.props.track.attach();
                this.ref.current.classList.add(this.props.track.kind);
                this.ref.current.appendChild(child);

            } else {
                this.props.track.on('message', message => {
                    this.props.messages.push(message);
                    console.log(message);
                });
            }
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
        //const messages = this.props.local ? this.props.messages : this.state.messages;
        return (
            <div>
                {
                    this.props.track && this.props.track.kind === 'data'
                        ? this.props.messages.map(message => <ChatDisplay message={message} />)
                        : ''
                }
                <div className="track" ref={this.ref}>

                    {
                        this.props.local && this.props.track && this.props.track.kind !== 'data'
                            ? <AVreview changeRecord={this.changeRecord} recordOff={this.state.recordOff} type={this.props.track.kind} />
                            : ''
                    }

                </div>
            </div>
        )
    }
}

export default Track;

/*{
                this.props.track && this.props.track.kind === 'data'
                ? messages.map(filter => <Filter key={filter} name={filter} />)
                : ''
                 }*/