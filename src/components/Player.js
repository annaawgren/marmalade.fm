/*global Mixcloud*/
import React, { Component } from "react";
import { connect } from "react-redux";
import actions from "../store/actions";

class Player extends Component {
  //everytime the props change we can get access to them here

  componentWillReceiveProps(nextProps) {
    // if the widget is not ready return/exit and ignore all the actions below
    if (!nextProps.widgetReady) {
      return;
    }
    //if there is a new mix in the props
    if (nextProps.currentMix !== this.props.currentMix) {
      //this starts playing it
      this.widget.load(nextProps.currentMix, true);
      //if the event hasn't come from mixcloud we want to toggle the play pause on our audio
    } else if (!nextProps.fromMixCloud) {
      this.widget.togglePlay();
    }
  }

  mountAudio = async () => {
    const { playMix, setWidgetReady } = this.props;

    this.widget = Mixcloud.PlayerWidget(this.player);
    await this.widget.ready;

    //here we set our widget state to be ready in redux so we can block anytging from happening before its ready
    setWidgetReady(true);

    this.widget.events.pause.on(() =>
      playMix({
        playing: false,
        fromMixCloud: true
      })
    );
    this.widget.events.play.on(() =>
      playMix({
        playing: true,
        fromMixCloud: true
      })
    );
  };

  componentDidMount() {
    this.mountAudio();
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
    return (
      <iframe
        width="100%"
        height="60"
        src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=%2FCOOLMOVESRADIO%2Fthe-casual-vacancy-w-andrew-sage-ep5%2F"
        frameBorder="0"
        className="player db fixed bottom-0 z-5"
        ref={player => (this.player = player)}
      />
    );
  }
}

export default connect(
  state => state,
  actions
)(Player);
