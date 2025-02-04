import React, { Component } from 'react';
import './App.css';
import Track from './Track';


class Attendee extends Component {

    constructor(props) {
        super(props);

        const existingPublications = Array.from(this.props.attendee.tracks.values());             //Get all the tracks of attendees
        const existingTracks = existingPublications.map(publication => publication.track);
        const nonNullTracks = existingTracks.filter(track => track !== null)

        this.state = {
            tracks: nonNullTracks, //audio, video and data tracks of all the attendees
        }

    }

    componentDidMount() {
        //adding event listeners
        if (!this.props.localParticipant) {
            // when someone subscribes to one a new remote participants audio or video tracks (subscription by local participant happens automatically)
            this.props.attendee.on('trackSubscribed', track => this.addTrack(track));
            // when a remote participant joins the room and publishes a new data track
            this.props.attendee.on('trackPublished', publication => this.addTrack(publication.track));
        }
    }

    addTrack(track) {
        this.setState({
            tracks: [...this.state.tracks, track]    //Update tracks whenever a track is published or subscribed
        });
    }

    render() {
        const isDominantSpeaker = this.props.dominantSpeaker === this.props.attendee.identity ? 'dominantSpeaker' : '';
        return (

            <div className={`attendee ${isDominantSpeaker}`} id={this.props.attendee.identity}>
                <div className="identity">{this.props.attendee.identity}</div>
                {

                    this.state.tracks.map(track =>
                        <Track key={track}
                            track={track}
                            local={this.props.localParticipant}
                            snackBar={this.props.snackBar}
                            changeSnackbarmessage={this.props.changeSnackbarmessage}
                            pushMessage={this.props.pushMessage} id={this.props.id} />
                    )

                }
            </div>

        );
    }
}

export default Attendee;