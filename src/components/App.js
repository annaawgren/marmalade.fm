import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { connect } from "react-redux";

import FeaturedMix from "./FeaturedMix";
import Header from "./Header";
import Home from "./Home";
import Archive from "./Archive";
import About from "./About";
import Show from "./Show";
import Player from "./Player";
import mixesData from "../data/mixes";
import actions from "../store/actions";
import Stat from "./Stat";

class App extends Component {
  //async function needs to await for fetch and await response
  fetchMixes = async () => {
    const { addMix } = this.props;

    //loop over our mix ids and fetch each one
    mixesData.map(async id => {
      try {
        const response = await fetch(`https://api.mixcloud.com${id}`);
        const data = await response.json();
        addMix(data);
      } catch (error) {}
    });
  };

  componentDidMount() {
    this.fetchMixes();
  }

  render() {
    //destructuring = makes a variable from our first mix in the array if the array is empty we asssign it a default value of an empty {} object
    // const [firstMix = {}] = this.props.mixes;
    return (
      <Router>
        <div>
          <div className="flex-l justify-end">
            <FeaturedMix />
            <div className="w-50-l relative z-1">
              <Header />
              {/* Here pass the state and the actions down into the home component so that I can use them */}
              <Route exact path="/" component={Home} />
              <Route path="/archive" component={Archive} />
              <Route path="/about" component={About} />
              <Route path="/show/:slug" component={Show} />
              )} />
              {/* RoutedPage */}
            </div>
          </div>

          {/* AudioPlayer */}
          <Player />
        </div>
      </Router>
    );
  }
}

export default connect(
  state => state,
  actions
)(App);
