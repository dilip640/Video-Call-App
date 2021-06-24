import React, { Component } from 'react';
import './App.css';
import Attendee from './Attendee';
import { Paper } from "@material-ui/core";
import ChatBox from './ChatBox';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash } from '@fortawesome/free-solid-svg-icons';


class Room extends Component {

    constructor(props) {
        super(props);
        const existingPublications = Array.from(this.props.room.localParticipant.tracks.values());
        const existingTracks = existingPublications.map(publication => publication.track);
        const nonNullTracks = existingTracks.filter(track => track !== null)
        this.state = {
            //initialise room with attendees list array
            attendeesList: Array.from(this.props.room.participants.values()),
            tracks: nonNullTracks,
            messages: []
        }
        this.disconnectCall = this.disconnectCall.bind(this); //binding this to disconnectCall()
        this.sendMessage = this.sendMessage.bind(this);
    }

    componentDidMount() {
        // Add event listeners for future remote participants coming or going
        this.props.room.on('participantConnected', attendee => this.connectAttendee(attendee));
        this.props.room.on('participantDisconnected', attendee => this.disconnectAttendee(attendee));
        this.props.room.on('dominantSpeakerChanged', attendee => this.CurrentSpeaker(attendee));
        window.addEventListener("beforeunload", this.disconnectCall);
    }

    sendMessage(message) {
        const dataTrack = this.state.tracks.find(track => track.kind == "data");
        dataTrack.send(message);
        this.setState({ messages: [...this.state.messages, message] });
        console.log(message);

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

    CurrentSpeaker(attendee) {
        this.setState({
            dominantSpeaker: attendee ? attendee.identity : null
        });
    }

    render() {
        /* var style = {
             backgroundColor: "#F8F8F8",
             //borderTop: "1px solid #E7E7E7",
             textAlign: "center",
             padding: "20px",
             position: "fixed",
             left: "0",
             bottom: "0",
             height: "50px",
             width: "100%",
         }
 
         var phantom = {
             display: 'block',
             padding: '20px',
             height: '50px',
             width: '100%',
         }*/

        const styles = {
            div: {
                display: 'flex',
                flexDirection: 'row wrap',
                padding: 20,
                width: '100%'
            },
            paperLeft: {
                flex: 4,
                height: '100%',
                margin: 10,
                textAlign: 'center',
                padding: 10
            },
            paperRight: {
                height: 600,
                flex: 1,
                margin: 10,
                textAlign: 'center',
            }
        };

        return (
            //render Local participant first then map over remote participants
            <div className="room">

                <div style={styles.div}>
                    <Paper style={styles.paperLeft}>
                        <div className="participants">

                            <Attendee key={this.props.room.localParticipant.identity} dominantSpeaker={this.state.dominantSpeaker} localParticipant="true" attendee={this.props.room.localParticipant} messages={this.state.messages} />
                            {
                                this.state.attendeesList.map(attendee =>
                                    <Attendee key={attendee.identity} dominantSpeaker={this.state.dominantSpeaker} attendee={attendee} messages={this.state.messages} />
                                )
                            }
                        </div>
                    </Paper>
                    <Paper style={styles.paperRight}>

                        {

                            this.props.room.localParticipant
                                ? <ChatBox sendMessage={this.sendMessage} id={this.props.room.localParticipant} />
                                : ''

                        }
                    </Paper>
                </div>


                <footer align="center"><button id="disconnectCall" onClick={this.disconnectCall}>Leave Call</button></footer>
            </div>



        );
    }

    //<div style={phantom} />
    //<div style={style}></div >

}

export default Room;
 /*<AppBar position="static">
       <Toolbar>

           <Button color="inherit" id="disconnectCall" onClick={this.disconnectCall}>Login</Button>
       </Toolbar>
   </AppBar>*/