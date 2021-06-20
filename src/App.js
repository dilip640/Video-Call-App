import './App.css';
import React, { Component } from 'react';
import Room from './Room';
const { connect } = require('twilio-video'); //Importing twilio-javascript SDK


class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            identity: '',
            room: null
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
            const signal = await fetch(`https://token-service-1375-dev.twil.io/token?identity=${this.state.identity}`);
            const store = await signal.json();
            const room = await connect(store.accessToken, {
                name: 'cool-room',
                audio: true,
                video: true
            });

            this.setState({ room: room });
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

    render() {
        const disabled = this.state.identity === '' ? true : false; //state of join button (disabled/enabled)
        return (
            <div className="app">
                {
                    this.state.room === null
                        ?
                        //if room state is null
                        <div className="home">
                            <h4 classname="mt-3">Fill the details for</h4>
                            <h1 className="mt-2">Meeting Now!</h1>
                            <input
                                value={this.state.identity} //binding the reference
                                onChange={this.changeID} //update identity
                                ref={this.nameField}
                                onClick={this.eraseText} //remove placeholder text
                                placeholder="Enter Name" />
                            <button disabled={disabled} onClick={this.connectCall}>Join Now</button>
                        </div>
                        : //if room state not null
                        <Room backtoHome={this.backtoHome} room={this.state.room} />
                }
            </div>
        );
    }
}

export default App;
