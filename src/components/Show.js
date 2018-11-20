import React, { Component } from "react";
import { connect } from "react-redux";
import differenceInDays from "date-fns/difference_in_days";
import Stat from "./Stat";

import actions from "../store/actions";

const Tag = ({ name, url }) => (
  <div className="mr2 mb2 o-70">
    <a
      className="black f6 link blue b ba bw1 b--blue gray br2 pv1 ph2 lh-title"
      href={url}
      target="_blank"
    >
      {name}
    </a>
  </div>
);

const Tags = ({ tags = [] }) => (
  <div className="tags flex flex-wrap">
    {tags.map(tag => (
      <Tag {...tag} />
    ))}
  </div>
);

class Show extends Component {
  componentDidMount() {
    //when we mount the component we want to set the featuredMix in our redux state to be the current viewed mix
    const { setFeaturedMix, id } = this.props;
    setFeaturedMix(id);
  }

  componentWillUnmount() {
    const { setFeaturedMix } = this.props;
    //here we remove our featuredMix from the redux state again
    setFeaturedMix(false);
  }

  render() {
    const {
      tags,
      description,
      play_count,
      created_time,
      audio_length
    } = this.props;
    return (
      <div className="ph3 ph4-l pad-bottom">
        <div className="measure center lh-copy">
          <Tags tags={tags} />

          <p>{description}</p>

          <Stat
            key="1"
            statName="Plays"
            statNumber={play_count}
            statWord="times"
          />

          <Stat
            key="2"
            statName="Uploaded"
            statNumber={differenceInDays(new Date(), created_time)}
            statWord="days ago"
          />
          <Stat
            statName="Lasting for"
            statNumber={audio_length / 60}
            statWord="minutes"
          />
        </div>
      </div>
    );
  }
}

//this is a selector = it grabs certain piece of data from our state
const getMix = (mixes, slug) => {
  const [mix = {}] = mixes.filter(mix => mix.slug === slug);
  return mix;
};

export default connect(
  (state, props) => ({
    ...getMix(state.mixes, props.match.params.slug)
  }),
  actions
)(Show);
