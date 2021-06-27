import React, { Component } from 'react';
import './App.css';
import Attendee from './Attendee';
import AudioControl from './AudioControl';
import VideoControl from './VideoControl';
import { Paper, Grid } from "@material-ui/core";
import ChatBox from './ChatBox';
import CallEndIcon from '@material-ui/icons/CallEnd';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import ChatIcon from '@material-ui/icons/Chat';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

class Room extends Component {

    constructor(props) {
        super(props);

        this.handleDrawer = this.handleDrawer.bind(this);
        this.handleDrawerClose = this.handleDrawerClose.bind(this);

        const existingPublications = Array.from(this.props.room.localParticipant.tracks.values());
        const existingTracks = existingPublications.map(publication => publication.track);
        const nonNullTracks = existingTracks.filter(track => track !== null)
        this.state = {
            //initialise room with attendees list array
            attendeesList: Array.from(this.props.room.participants.values()),
            tracks: nonNullTracks,
            messages: [],
            audioOff: false,
            videoOff: false,
            setOpen: false
        }
        this.disconnectCall = this.disconnectCall.bind(this); //binding this to disconnectCall()
        this.sendMessage = this.sendMessage.bind(this);
        this.changeAudio = this.changeAudio.bind(this);
        this.changeVideo = this.changeVideo.bind(this);
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

    changeAudio(track) {
        if (this.state.audioOff) {
            track.enable();
        } else {
            track.disable()
        }

        this.setState({
            audioOff: !this.state.audioOff
        });
    }

    changeVideo(track) {
        if (this.state.videoOff) {
            track.enable();
        } else {
            track.disable()
        }

        this.setState({
            videoOff: !this.state.videoOff
        });
    }


    handleDrawerClose() {
        this.setState({
            setOpen: false
        });
    }

    handleDrawer() {
        this.setState({
            setOpen: !this.state.setOpen
        });
    }

    render() {

        const styles = {
            div: {
                display: 'flex',
                flexDirection: 'row wrap',
                padding: 20,
                width: '100%'
            },
            appbar: {
                zIndex: 2000,
                background: '#2E3B55',
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
            },
            root: {
                flexGrow: 1,
            },
            drawer: {
                width: 340,
                flexShrink: 0,
                paddingTop: '20%',
                //zIndex: -1200,
            },
            drawerPaper: {
                paddingTop: '20%',
                width: 340,
            },
            title: {
                flexGrow: 1,
            },
            toolbarButtons: {
                marginLeft: 'auto',

            },
            shiftTextLeft: {
                marginRight: 340
            },
            shiftTextRight: {
                marginLeft: 0,
            },
            drawerHeader: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
            },
            appBarShift: {
                width: `calc(100% - ${340}px)`,
                marginRight: 340,
                background: '#2E3B55',
            },
            drawerContainer: {
                overflow: 'auto',
                paddingTop: 60
            },
        };
        return (

            //render Local participant first then map over remote participants
            <div className="room">
                <CssBaseline />
                <Grid id="appbar" style={styles.root}>
                    <AppBar position="relative" style={{ zIndex: 1401, background: '#2E3B55' }}>
                        <Toolbar variant="dense">
                            <Typography variant="h6" style={styles.title}>
                                MS Teams
                            </Typography>
                            <div style={styles.toolbarButtons}>
                                <Tooltip title="Microphone" arrow><IconButton color="inherit">
                                    {
                                        this.state.tracks.map(track =>
                                            track && track.kind == 'audio'
                                                ? <AudioControl key={this.props.room.localParticipant.identity} changeAudio={this.changeAudio} audioOff={this.state.audioOff} track={track} />
                                                : '')
                                    }</IconButton></Tooltip>
                                <Tooltip title="Video" arrow><IconButton color="inherit">
                                    {
                                        this.state.tracks.map(track =>
                                            track && track.kind == 'video'
                                                ? <VideoControl key={this.props.room.localParticipant.identity} changeVideo={this.changeVideo} videoOff={this.state.videoOff} track={track} />
                                                : '')
                                    }</IconButton></Tooltip>
                                <Tooltip title="Leave Call" arrow><IconButton color="secondary" variant="fab" onClick={this.disconnectCall}><CallEndIcon fontSize="large" /></IconButton></Tooltip>
                                <Tooltip title="Chat" arrow><IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    edge="end"
                                    onClick={this.handleDrawer}

                                >
                                    <ChatIcon />
                                </IconButton></Tooltip>
                            </div>
                        </Toolbar>
                    </AppBar></Grid>

                <Grid
                    id="main"
                    container
                    justify="center"
                    alignItems="center"
                    style={{ height: "inherit" }}
                >
                    <main key={this.props.room.localParticipant.identity}
                        style={this.state.setOpen ? styles.shiftTextLeft : styles.shiftTextRight}
                    >
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
                        </div>

                    </main></Grid>

                <Drawer
                    style={styles.drawer}
                    variant="persistent"
                    anchor="right"
                    open={this.state.setOpen}

                >
                    <div style={styles.drawerContainer}>
                        <div style={styles.drawerHeader}>
                            <IconButton onClick={this.handleDrawerClose} fontSize="large">
                                <ChevronRightIcon />
                            </IconButton>
                        </div>
                        <Divider />
                        <List>

                            {

                                this.props.room.localParticipant
                                    ? <ChatBox sendMessage={this.sendMessage} id={this.props.room.localParticipant} messages={this.state.messages} />
                                    : ''

                            }
                        </List>
                    </div>

                </Drawer >



            </div >



        );

    }
}

export default Room;

/*  <Drawer
                    style={styles.drawer}
                    variant="persistent"
                    anchor="right"
                    open={this.state.setOpen}

                >
                    <div style={styles.drawerHeader}>
                        <IconButton onClick={this.handleDrawerClose} fontSize="large">
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>
                    <Divider />
                    <List>

                        {
                            this.state.attendeesList.map(attendee =>
                                <List>{attendee.identity}</List>)

                        }
                    </List>
                    <Divider />

                </Drawer>*/


