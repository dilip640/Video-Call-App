import './App.css';
import React, { Component } from 'react';
import Room from './Room';
import ChatBox from './ChatBox'
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
const { connect, LocalDataTrack } = require('twilio-video'); //Importing twilio-javascript SDK and Data API


class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            identity: '',
            room: null,
            token: ""
        }
        this.nameField = React.createRef(); //creating Reference to itself
        this.connectCall = this.connectCall.bind(this);
        this.backtoHome = this.backtoHome.bind(this);
        this.changeID = this.changeID.bind(this);
        this.eraseText = this.eraseText.bind(this);
    }

    async connectCall() {
        try {
            //fetching access token
            const signal = await fetch(`https://token-service-1636-dev.twil.io/token?identity=${this.state.identity}`);
            //const { data } = signal;
            //const token = data.token;
            const store = await signal.json();
            const token = store.accessToken;
            const room = await connect(store.accessToken, {
                name: 'cool-room',
                audio: true,
                video: true,
                dominantSpeaker: true
            });

            const dataTrack = new LocalDataTrack();
            await room.localParticipant.publishTrack(dataTrack);

            this.setState({ room: room, token: token });
        } catch (err) {
            console.log(err);
        }
    }

    backtoHome() { //invoked when user clicks Leave call button
        this.setState({ room: null });
    }

    eraseText() { //earse the placeholder text of name field when user enters
        this.nameField.current.placeholder = ''; //access DOM element created by current component
    }
    changeID(event) { //update identity when user has entered name
        this.setState({
            identity: event.target.value
        });
    }
    audioState(event) { //update identity when user has entered name
        this.setState({
            room: { [event.target.name]: event.target.chacked }
        });
    }

    render() {
        const disabled = this.state.identity === '' ? true : false; //state of join button (disabled/enabled)
        return (
            <div className="app">
                {
                    this.state.room === null
                        ?
                        //if room state is null
                        <div className="home">
                            <h4 className="mt-3">Fill the details for</h4>
                            <h1 className="mt-2">Meeting Now!</h1>
                            <input
                                value={this.state.identity} //binding the reference
                                onChange={this.changeID} //update identity
                                ref={this.nameField}
                                onClick={this.eraseText} //remove placeholder text
                                placeholder="Enter Name" />
                            <button className="standard-button" disabled={disabled} onClick={this.connectCall}>Join Now</button>
                        </div>
                        : //if room state not null
                        <Room backtoHome={this.backtoHome} room={this.state.room} />
                }
            </div>
        );
    }
}

export default App;

/*<FormControl component="fieldset">
                                <FormGroup aria-label="position" row>
                                    <FormControlLabel
                                        value="top"
                                        control={<Switch color="primary" checked={this.state.room.audio}
                                            onChange={this.audioState}
                                            name="audio" />}
                                        label="Microphone"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="top"
                                        control={<Switch color="primary" checked={this.state.room.video}
                                            onChange={this.audioState}
                                            name="video" />}
                                        label="Video"
                                        labelPlacement="top"
                                    />
                                </FormGroup>
                            </FormControl>*/
