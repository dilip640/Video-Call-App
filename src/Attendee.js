import React, { Component } from 'react';
import './App.css';
import Track from './Track';

class Attendee extends Component {
    constructor(props) {
        super(props);
        const existingPublications = Array.from(this.props.attendee.tracks.values());
        const existingTracks = existingPublications.map(publication => publication.track);
        const nonNullTracks = existingTracks.filter(track => track !== null)
        this.state = {
            tracks: nonNullTracks
        }
    }

    componentDidMount() {
        //adding event listeners
        if (!this.props.localParticipant) {
            this.props.attendee.on('trackSubscribed', track => this.addTrack(track));
        }
    }

    addTrack(track) {
        this.setState({
            tracks: [...this.state.tracks, track]
        });
    }

    render() {
        return (
            <div className="attendee" id={this.props.attendee.identity}>
                <div className="identity">{this.props.attendee.identity}</div>
                {
                    this.state.tracks.map(track =>
                        <Track key={track} filter={this.state.filter} track={track} />)
                }
            </div>
        );
    }

}

export default Attendee;