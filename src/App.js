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
        //console.log(this.state.identity);
        this.nameField = React.createRef(); //creating Reference to itself
        this.connectCall = this.connectCall.bind(this);
        this.backtoHome = this.backtoHome.bind(this);
        this.changeState = this.changeState.bind(this);
        this.changeRoomID = this.changeRoomID.bind(this);
        //this.eraseText = this.eraseText.bind(this);
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


    changeState() { //update identity when user has entered name
        this.setState({
            isLoading: true,

        });
        console.log("agye")
    }

    changeRoomID(event) { //update room when user has entered roomname
        this.setState({
            roomName: event.target.value
        });
    }

    render() {
        //const disabled = ((this.state.identity === '') && (this.state.roomName === '')) ? true : false; //state of join button (disabled/enabled)
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
                            <button className="standard-button" onClick={this.connectCall}>Join Call</button>
                            <br />
                            <button className="standard-button" onClick={e => this.props.logout(e)}>Logout</button>
                            <br />
                            {(this.state.isLoading === true) ? <div className="loader">Connecting</div> : <div></div>}
                        </div>

                        : //if room state not null
                        <Room backtoHome={this.backtoHome} room={this.state.room} />
                }
            </div>
        );
    }
}

export default App;
