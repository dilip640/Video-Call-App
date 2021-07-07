import './App.css';
import React, { Component } from 'react';
import Room from './Room';
import axios from 'axios';
const { connect, LocalDataTrack } = require('twilio-video'); //Importing twilio-javascript SDK and Data API


class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            room: null,
            roomName: ''
        }

        this.nameField = React.createRef();              //creating Reference 
        this.connectCall = this.connectCall.bind(this);  //Invoked to connect to room
        this.backtoHome = this.backtoHome.bind(this);    //Invoked when call is diconnected
        this.changeState = this.changeState.bind(this);  //Change state of isLoading
        this.changeRoomID = this.changeRoomID.bind(this);//Change Room id when user enters room name

    }

    async connectCall() {
        try {

            this.setState({
                isLoading: true,
            });

            //fetching access token
            const signal = await axios.get('http://localhost:4000/api/token', { withCredentials: true });
            const store = await signal.data;
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
        this.setState({
            isLoading: false,
        });
    }


    changeState() { //update isLoading state
        this.setState({
            isLoading: true,

        });
    }

    changeRoomID(event) { //update room when user has entered roomname
        this.setState({
            roomName: event.target.value
        });
    }

    render() {
        const disabled = (this.state.roomName === '') ? true : false; //state of join button (disabled/enabled)
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
                                value={this.state.roomName}
                                onChange={this.changeRoomID}
                                placeholder="Enter Room Name" />
                            <button className="standard-button" disabled={disabled} onClick={this.connectCall}>Join Call</button>
                            <br />
                            <button className="standard-button" onClick={e => this.props.logout(e)}>Logout</button>
                            <br />
                            {(this.state.isLoading === true) ? <div className="loader">Connecting</div> : <div></div>}
                        </div>

                        : //if room state not null
                        <Room
                            backtoHome={this.backtoHome} room={this.state.room}
                            roomName={this.state.roomName}
                        />
                }
            </div>
        );
    }
}

export default App;
