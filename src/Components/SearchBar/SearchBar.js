import './SearchBar.css'
import React from 'react';

class SearchBar extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            input: ''
        }

        this.search = this.search.bind(this)
        this.handleTermChange = this.handleTermChange.bind(this)
    }

    handleTermChange(event) {
        this.setState({
            input: event.target.value
        })
    }

    search() {
        this.props.onSearch(this.state.input)
    }

    render() {
        return(
            <div className="SearchBar">
                <input onChange={this.handleTermChange} placeholder="Enter a song, album, or artist. . ."/>
                <button onClick={this.search} className="SearchButton">
                    SEARCH
                </button>
            </div>
        )
    }
}

export default SearchBar;