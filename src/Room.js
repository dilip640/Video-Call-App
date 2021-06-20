import React, { Component } from 'react';
import './App.css';
import Attendee from './Attendee';

class Room extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //initialise room with attendees list array
            attendeesList: Array.from(this.props.room.participants.values())
        }
        this.disconnectCall = this.disconnectCall.bind(this); //binding this to disconnectCall()
    }

    componentDidMount() {
        // Add event listeners for future remote participants coming or going
        this.props.room.on('participantConnected', attendee => this.connectAttendee(attendee));
        this.props.room.on('participantDisconnected', attendee => this.disconnectAttendee(attendee));
        window.addEventListener("beforeunload", this.disconnectCall);
    }

    componentWillUnmount() {
        //Disconnection happens when component unmounts
        this.disconnectCall();
    }

    connectAttendee(attendee) {
        console.log(`${attendee.identity} has joined the call.`);
        this.setState({
            //Update attendeesList
            attendeesList: [...this.state.attendeesList, attendee]
        });
    }

    disconnectAttendee(attendee) {
        console.log(`${attendee.identity} has left the call`);
        this.setState({
            //Update attendeesList
            attendeesList: this.state.attendeesList.filter(p => p.identity !== attendee.identity)
        });
    }

    disconnectCall() {
        this.props.room.disconnect();
        this.props.backtoHome();
    }

    render() {
        return (
            //render Local participant first then map over remote participants
            <div className="room">
                <div className="participants">
                    <Attendee key={this.props.room.localParticipant.identity} localParticipant="true" attendee={this.props.room.localParticipant} />
                    {
                        this.state.attendeesList.map(attendee =>
                            <Attendee key={attendee.identity} attendee={attendee} />
                        )
                    }
                </div>
                <button id="disconnectCall" onClick={this.disconnectCall}>Leave Call</button>
            </div>
        );
    }



}

export default Room;
