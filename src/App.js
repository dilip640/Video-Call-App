import './App.css';
import React, { Component } from 'react';
import Room from './Room';
const { connect, LocalDataTrack } = require('twilio-video'); //Importing twilio-javascript SDK and Data API


class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            identity: this.props.identity,
            room: null,
            roomName: ''
        }
        console.log(this.state.identity);
        this.nameField = React.createRef(); //creating Reference to itself
        this.connectCall = this.connectCall.bind(this);
        this.backtoHome = this.backtoHome.bind(this);
        this.changeID = this.changeID.bind(this);
        this.changeRoomID = this.changeRoomID.bind(this);
        this.eraseText = this.eraseText.bind(this);
    }

    async connectCall() {
        try {
            //fetching access token
            const signal = await fetch(`https://token-service-1636-dev.twil.io/token?identity=${this.state.identity}`);
            const store = await signal.json();
            const token = store.accessToken;
            const room = await connect(store.accessToken, {
                name: this.state.roomName,
                audio: true,
                video: true,
                dominantSpeaker: true
            });

            //publishing a data track for chats
            const dataTrack = new LocalDataTrack();
            await room.localParticipant.publishTrack(dataTrack);

            this.setState({ room: room });
        } catch (err) {
            console.log(err);
        }
    }

    backtoHome() { //invoked when user clicks Leave call button
        this.setState({ room: null });
    }

    eraseText() { //erase the placeholder text of name field when user enters
        this.nameField.current.placeholder = ''; //access DOM element created by current component
    }

    changeID(event) { //update identity when user has entered name
        this.setState({
            identity: event.target.value
        });
    }

    changeRoomID(event) { //update identity when user has entered name
        this.setState({
            roomName: event.target.value
        });
    }

    render() {
        const disabled = ((this.state.identity === '') && (this.state.roomName === '')) ? true : false; //state of join button (disabled/enabled)
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
                                value={this.state.roomName} //binding the reference
                                onChange={this.changeRoomID} //update identity
                                //onClick={this.eraseText} //remove placeholder text
                                placeholder="Enter Room Name" />
                            <button className="standard-button" disabled={disabled} onClick={this.connectCall}>Join Now</button>
                            <br />
                            <button className="standard-button" onClick={e => this.props.logout(e)}>Logout</button>
                        </div>
                        : //if room state not null
                        <Room backtoHome={this.backtoHome} room={this.state.room} />
                }
            </div>
        );
    }
}

export default App;

/*<input
                                value={this.state.identity} //binding the reference
                                onChange={this.changeID} //update identity
                                ref={this.nameField}
                                onClick={this.eraseText} //remove placeholder text
                                placeholder="Enter Name" />*/