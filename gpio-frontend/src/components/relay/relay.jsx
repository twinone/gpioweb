import React, { useState } from 'react';
import lodash from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Stop from '@material-ui/icons/Stop';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import './relay.scss';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flex: '1 0 auto',
    },
    cover: {
      width: 151,
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    playIcon: {
      height: 38,
      width: 38,
    },
    selected: {
        color: theme.palette.primary.main
    }
  }));

export const RelayComponent = function(props) {
    const classes = useStyles();

    const onToggle = {...props}.onToggle;
    const [relay, setRelay] = useState(props.relay);

    function handleStartClick() {
        relay.manual = true;
        relay.status = 'on';
        onToggle && onToggle(relay);
        setRelay(lodash.cloneDeep(relay));
    }

    function handleStopClick() {
        relay.manual = true;
        relay.status = 'off';
        onToggle && onToggle(relay);
        setRelay(lodash.cloneDeep(relay));
    }

    function handleAutoClick() {
        relay.manual = false;
        onToggle && onToggle(relay);
        setRelay(lodash.cloneDeep(relay));
    }

    return(
        <Card className={classes.root}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography component="h5" variant="h5">
            {relay.title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {(relay.manual ? '' : '[auto] ') + relay.status}
            </Typography>
          </CardContent>
          <div className={classes.controls}>
            <IconButton aria-label="play/pause" color="primary"
                onClick={handleStopClick}
                disabled = {relay.status === 'off' && relay.manual}>
              <Stop className={classes.playIcon}/>
            </IconButton>
            <IconButton aria-label="play/pause" color="primary"
                onClick={handleStartClick}
                disabled = {relay.status === 'on' && relay.manual}>
              <PlayArrowIcon className={classes.playIcon + (relay.status === 'off'? ' ' + classes.selected : '')}/>
            </IconButton>
            <IconButton aria-label="play/pause" color="primary"
                disabled = {relay.manual===false}
                onClick={handleAutoClick}>
              <AccessTimeIcon className={classes.playIcon + (relay.manual ? ' ' + classes.selected : '')}/>
            </IconButton>
          </div>
        </div>
      </Card>
    )
};