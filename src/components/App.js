/*global Mixcloud*/
import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import FeaturedMix from "./FeaturedMix";
import Header from "./Header";
import Home from "./Home";
import Archive from "./Archive";
import About from "./About";

import mixesData from "../data/mixes";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      currentMix: "",
      mix: null,
      mixIds: mixesData,
      mixes: []
    };
  }

  //async function needs to await for fetch and await response
  fetchMixes = async () => {
    const { mixIds } = this.state;

    //loop over our mix ids and fetch each one
    mixIds.map(async id => {
      try {
        const response = await fetch(`https://api.mixcloud.com${id}`);
        const data = await response.json();
        this.setState((prevState, props) => ({
          //adding our data onto the end of all of our previous state using the spread
          mixes: [...prevState.mixes, data]
        }));
      } catch (error) {}
    });
  };

  mountAudio = async () => {
    this.widget = Mixcloud.PlayerWidget(this.player);
    await this.widget.ready;

    this.widget.events.pause.on(() =>
      this.setState({
        playing: false
      })
    );
    this.widget.events.play.on(() =>
      this.setState({
        playing: true
      })
    );
  };

  componentDidMount() {
    this.mountAudio();
    this.fetchMixes();
  }

  actions = {
    //GROUP THE METHODS TOGHETER INSIDE OF AN OBJECT. When doing this remove the = and use : instead plus separate the functions/methods with a ,
    togglePlay: () => {
      this.widget.togglePlay();
    },
    playMix: mixName => {
      //if the mixName is the same as the currently playing mix, we want to pause it instead
      const { currentMix } = this.state;
      if (mixName === currentMix) {
        //when our code sees a return statement it will stop running here and exit
        return this.widget.togglePlay();
      }
      this.setState({
        currentMix: mixName
      });
      this.setState({
        currentMix: mixName
      });
      this.widget.load(mixName, true);
    }
  };

  render() {
    //destructuring = makes a variable from our first mix in the array if the array is empty we asssign it a default value of an empty {} object
    const [firstMix = {}] = this.state.mixes;
    return (
      <Router>
        <div>
          <div className="flex-l justify-end">
            <FeaturedMix
              {...this.state}
              {...this.actions}
              {...firstMix}
              id={firstMix.key}
            />
            <div className="w-50-l relative z-1">
              <Header />

              {/* Here pass the state and the actions down into the home component so that I can use them */}
              <Route
                exact
                path="/"
                render={() => <Home {...this.state} {...this.actions} />}
              />
              <Route
                path="/archive"
                render={() => <Archive {...this.state} {...this.actions} />}
              />
              <Route
                path="/about"
                render={() => <About {...this.state} {...this.actions} />}
              />

              {/* RoutedPage */}
            </div>
          </div>

          {/* AudioPlayer */}
          <iframe
            width="100%"
            height="60"
            src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=%2FCOOLMOVESRADIO%2Fthe-casual-vacancy-w-andrew-sage-ep5%2F"
            frameBorder="0"
            className="player db fixed bottom-0 z-5"
            ref={player => (this.player = player)}
          />
        </div>
      </Router>
    );
  }
}

export default App;
