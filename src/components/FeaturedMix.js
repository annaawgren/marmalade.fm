import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PlayMix from "./PlayMix";
import PlayButton from "./Playbutton";

const FeaturedMix = ({
  name,
  pictures = {},
  id,
  slug,
  title,
  picture_primary_color,
  ...props
}) => (
  <div
    className="w-50-l vh-100 flex items-center justify-center cover bg-center pad-bottom fixed-l left-0 mix-overlay"
    style={{
      backgroundImage: `url(${pictures.extra_large})`,
      backgroundColor: `${picture_primary_color}`
    }}
  >
    <PlayMix {...props}>
      <div className="w-100 tc pa3 relative z-2">
        <p className="b biryani f6 white ttu">{title}</p>
        <h1 className="mix-title mt0 mb2 anton white ttu">{name}</h1>

        <Link to={`/show/${slug}`} className="absolute absolute--fill z-3" />
        <PlayMix id={slug} className="relative z-5 pointer">
          <PlayButton />
        </PlayMix>
      </div>
    </PlayMix>
  </div>
);

//on the show page, we are going to set the featuredMix to be the currently viewd mix
//if there's a mix playing, we want to set that as our featured mix
//we want to display our fist mix as our featured mix.
//this is a selector = it grabs certain piece of data from our state
const getMix = state => {
  //1. iuf we have a featuredMix in redux we show that first
  //2. if theres a currently playing mix, we shgow that nex
  //3. otherwise we just show the first mix

  let featuredMix;

  if (state.featuredMix) {
    [featuredMix] = state.mixes.filter(mix => mix.id === state.featuredMix);
  } else {
    [featuredMix] = state.mixes.filter(mix => mix.id === state.currentMix);
  }

  const [firstMix = {}] = state.mixes;

  return featuredMix || firstMix;
};

//selector tricks
const getTitle = state => {
  if (state.featuredMix) {
    return "Currently viewing";
  } else if (state.currentMix && state.playing) {
    return "Currently playing";
  } else {
    return "Featured mix";
  }
};

export default connect(state => ({
  ...getMix(state),
  title: getTitle(state)
}))(FeaturedMix);

//if (featuredMix) {
//   return featuredMix
// } else {
//   return firstMix
// }

// above is the exact same thing as writing return featuredMix || firstMix
