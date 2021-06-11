import './TrackList.css'
import Track from '../Track/Track'
import React from 'react';

class TrackList extends React.Component {
    render() {
        return(
            <div className="TrackList">
                {
                    this.props.tracks.map(track => {
                        return <Track isRemoval={this.props.isRemoval} onRemove={this.props.onRemove} onAdd={this.props.onAdd} track={track} key={track.id}/>
                    })
                }
            </div>
        )
    }
}

export default TrackList;