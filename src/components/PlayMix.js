import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import actions from "../store/actions";

//this component wraps around anything that when we click will start playing a mix. it provides functionality rather than design

const PlayMix = ({
  playMix,
  id,
  currentMix,
  playing,
  children,
  fromMixCloud,
  className
}) => (
  //when the currently playing mix equals the id of the mix that this component refers to, we will add a class name of 'playing'
  <div
    className={classNames({
      //its ging to add our custom classNames only when theyre present
      [className]: className,
      //className on the left, ture/false on the right 7here we tet things from our Redux state

      //mixcloud takes control of acutally playing a mix and the event and playstate will both come from there
      playing: id === currentMix && playing && fromMixCloud,
      //when we request to play a mix, things are not laded yet
      //so we need to show a loading state, and we do this by seeing where the event has come from.

      loading: id === currentMix && !playing && !fromMixCloud
    })}
    onClick={() => playMix({ currentMix: id, fromMixCloud: false })}
  >
    {children}
  </div>
);

export default connect(
  state => state,
  actions
)(PlayMix);
