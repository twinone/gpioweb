import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import Stop from "@material-ui/icons/Stop";
import Edit from "@material-ui/icons/Edit";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import { Toaster } from "./../../shared/toaster";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: "1 0 auto",
  },
  cover: {
    width: 151,
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  icon: {
    height: 30,
    width: 30,
  },
  selected: {
    color: theme.palette.secondary.primary,
    border: '3px solid',
    borderColor: theme.palette.secondary.primary,
    borderRadius: '15px'
  },
}));

export const RelayComponent = (props) => {
  const classes = useStyles();
  const { onToggle, relay: initialRelay } = props;

  const [relay, setRelay] = useState(initialRelay);

  function handleEditRelay() {
    Toaster.showInfo(`Edit ${relay.title}`);
  }

  function handleStartClick() {
    setRelay((oldRelay) => {
      const newRelay = {
        ...oldRelay,
        manual: true,
        status: "on",
      };

      onToggle && onToggle(newRelay);
      return newRelay;
    });
  }

  function handleStopClick() {
    setRelay((oldRelay) => {
      const newRelay = {
        ...oldRelay,
        manual: true,
        status: "off",
      };

      onToggle && onToggle(newRelay);
      return newRelay;
    });
  }

  function handleAutoClick() {
    setRelay((oldRelay) => {
      const newRelay = {
        ...oldRelay,
        manual: false,
      };

      onToggle && onToggle(newRelay);
      return newRelay;
    });
  }

  const relayDescription = `${relay.manual ? "" : "[auto] "} ${relay.status}`;
  const editDisabled = relay.status === "on" || !relay.manual;
  const stopDisabled = relay.status === "off" && relay.manual;
  const stopIconClass = `${classes.icon} ${relay.status === 'off' ? ' ' + classes.selected : ''}`;
  const startDisabled = relay.status === "on" && relay.manual;
  const startIconClass = `${classes.icon} ${relay.status === 'on' ? ' ' + classes.selected : ''}`;
  const manualDisabled = !relay.manual;
  // const automaticIconClass = `${classes.icon} ${relay.manual ? ' ' + classes.selected : ''}`;
  const automaticIconClass = `${classes.icon}`;

  return (
    <Card className={classes.root}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h5">
            {relay.title}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {relayDescription}
          </Typography>
        </CardContent>
        <div className={classes.controls}>
          <IconButton
            aria-label="play/pause"
            color="secondary"
            onClick={handleEditRelay}
            disabled={editDisabled}
          >
            <Edit className={classes.icon} />
          </IconButton>
          <IconButton
            aria-label="play/pause"
            color="primary"
            onClick={handleStopClick}
            disabled={stopDisabled}
          >
            <Stop className={stopIconClass} />
          </IconButton>
          <IconButton
            aria-label="play/pause"
            color="primary"
            onClick={handleStartClick}
            disabled={startDisabled}
          >
            <PlayArrowIcon className={startIconClass} />
          </IconButton>
          <IconButton
            aria-label="play/pause"
            color="primary"
            disabled={manualDisabled}
            onClick={handleAutoClick}
          >
            <AccessTimeIcon className={automaticIconClass} />
          </IconButton>
        </div>
      </div>
    </Card>
  );
};
