import React from 'react'
import ReactDOM from 'react-dom'
import request from 'request-promise'

import moment from 'moment'
/*
 Here is where we're going to put our front-end logic

 */

class ListHolder extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            todos: [],
            googleSuggests:[],
            filterVal: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.loadList = this.loadList.bind(this);
        this.getGoogleSuggestions = this.getGoogleSuggestions.bind(this);
    }

    loadList() {
        if(this.state.filterVal.length > 1) {
            var options = {
                method: 'POST',
                url: 'http://localhost:3000/get/all',
                headers: {
                    'cache-control': 'no-cache',
                    'content-type': 'application/json'
                },
                body: {
                    'filterVal': this.state.filterVal ? this.state.filterVal : "none"
                },
                json: true
            };
            request(options).then(todos=>this.setState({todos: todos}));
        }
        else{
            this.setState({todos: []})
        }
    }

    handleChange(e){
        this.setState({filterVal: e.target.value});
        this.loadList();
        this.getGoogleSuggestions();
    }

    getGoogleSuggestions(){
        if(this.state.filterVal.length > 1) {
            var self = this;
            if (this.state.filterVal) {
                var displaySuggestions = function (predictions, status) {
                    console.log(predictions, status);
                    if (status != google.maps.places.PlacesServiceStatus.OK) {
                        self.setState({googleSuggests: []})
                        return;
                    }
                    console.log("Prec",status);
                    self.setState({googleSuggests: predictions})

                };

                var service = new google.maps.places.AutocompleteService();
                console.log(this.state)
                service.getQueryPredictions({input: this.state.filterVal ? this.state.filterVal : "none"}, displaySuggestions);
            }
        }
        else{
            this.setState({googleSuggests: []})
        }

    }

    componentDidMount() {
        this.loadList();
        this.getGoogleSuggestions();
    }

    render() {
        let {todos,googleSuggests,filterVal} = this.state
        console.log(this.state)
        return <div>
            <header>
                <h2 className="heading">Fab Hotels</h2>
            </header>
            <div id="mainDiv">
                <div className="row">
                    <div className="overlay">
                        <form name="newHotelForm">
                            <input id="searchInput" type="text" value={this.state.filterVal}  autoFocus="autofocus" onChange={this.handleChange} placeholder="Search hotels in your city!" />
                        </form>
                        {(googleSuggests.length || todos.length) && <div className="right-panel">
                            {googleSuggests.length >= 1 && <ul id="results1">
                                <li><h4>Locations</h4></li>
                                {googleSuggests.map(({description})=>
                                    <li><i className="fa fa-map-marker" aria-hidden="true"></i>{description}</li>)}
                            </ul>}
                            {todos.length >= 1 && <ul id="results">
                                <li><h4>Hotels</h4></li>
                                {todos.map(({todo})=>
                                <li><i className="fa fa-building-o" aria-hidden="true"></i>{todo}</li>)}
                            </ul>}
                        </div>}
                        {(googleSuggests.length==0 && todos.length==0 && filterVal != "" && filterVal != "none") && <div className="right-panel">
                            <ul>
                                <li className="noResults">No results found!</li>
                            </ul>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    }
}


ReactDOM.render(<ListHolder/>, document.getElementById('root')
);
