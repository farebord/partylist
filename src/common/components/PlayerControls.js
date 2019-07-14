import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


import { withStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import CircularProgress from '@material-ui/core/CircularProgress';
import { switchPlaying } from '../actions';

const styles = () => ({
  controls: {
    flexGrow: '0',
    padding: '0 1rem',
  },
  songInfo: {

  },
  loadingProgress: {
    margin: '0.5rem',
    color: 'white',
  },
  songName: {

  },
  songArtists: {

  },
  songProgress: {
    paddingRight: '1rem',
  },
});

const renderButtonIcon = (loading, isPlaying, classes) => {
  if (loading) { return <CircularProgress size="small" className={classes.loadingProgress} />; }
  if (isPlaying) { return <PauseIcon />; }
  return <PlayIcon />;
};

const getArtists = artistList => artistList.map(artist => artist.name).join(', ');

const getTimeFromMs = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const getProgress = (progress, duration) => `${getTimeFromMs(progress)} / ${getTimeFromMs(duration)}`;


export const PlayerControls = ({
  progress, songInfo, classes, isPlaying, pauseResumePlayer, loading,
}) => (
  <React.Fragment>
    {songInfo && (
    <Grid container>
      <Grid item container className={classes.controls} xs justify="center" alignItems="center">
        <Fab size="small" color="secondary" aria-label="Add" onClick={pauseResumePlayer}>
          {renderButtonIcon(loading, isPlaying, classes)}
        </Fab>
      </Grid>
      <Grid container item direction="column" xs justify="center">
        <Grid item className={classes.songName}>{songInfo.name}</Grid>
        <Grid item className={classes.songArtists}>{getArtists(songInfo.artists)}</Grid>
      </Grid>
      <Grid item xs container alignItems="center" justify="flex-end" className={classes.songProgress}>
        {getProgress(progress, songInfo.duration_ms)}
      </Grid>
    </Grid>
    )}
  </React.Fragment>
);

PlayerControls.propTypes = {
  progress: PropTypes.number,
  songInfo: PropTypes.object,
  classes: PropTypes.object.isRequired,
  isPlaying: PropTypes.bool,
  loading: PropTypes.bool,
  pauseResumePlayer: PropTypes.func,
};

PlayerControls.defaultProps = {
  progress: null,
  loading: true,
  isPlaying: false,
  songInfo: null,
  pauseResumePlayer: () => {},
};

export const mapStateToProps = ({ player }) => ({
  progress: player.progress_ms,
  songInfo: player.item,
  isPlaying: player.is_playing,
  loading: player.playbackSwitching,
});

export const mapDispatchToProps = dispatch => ({
  pauseResumePlayer: () => dispatch(switchPlaying()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PlayerControls));
