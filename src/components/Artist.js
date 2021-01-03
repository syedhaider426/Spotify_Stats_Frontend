import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import { Button, Card, CardContent } from "@material-ui/core";

import SaveIcon from "@material-ui/icons/Save";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// Styling for the form control
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
}));

const SpotifyTypography = withStyles({
  root: {
    color: "#1DB954",
  },
})(Typography);

/**
 * Filter function represents the user's ability to change the value in
 * dropdown to see different attributes for the artist's songs
 */
export default function Artist() {
  const [artist, setArtist] = useState("");
  const [errors, setErrors] = useState("");
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleArtistChange = ({ currentTarget }) => {
    const input = currentTarget.value;
    if (input.length > 0 && errors.length > 0) setErrors("");
    setArtist(input);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (artist.length === 0) {
      setErrors("Please enter artist name");
    } else {
      setArtist("");
      setOpen(true);
    }
    // Login
  };

  const successAlert = (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity="success">
        Succesfully addedd artist! Loading tracks momentarily...
      </Alert>
    </Snackbar>
  );

  const classes = useStyles();
  return (
    <div>
      <Card>
        <CardContent>
          {" "}
          <Container maxWidth="xs">
            <SpotifyTypography align="center" variant="h3" color="primary">
              Spotify Stats
            </SpotifyTypography>
            <br></br>
            <Typography align="center" variant="h5" color="primary">
              Add an Artist
            </Typography>
            <Typography align="center" variant="body1" color="primary">
              If the artist you're looking for was not found, please enter the
              artist's name. The audio features for the artist's tracks will be
              generated after submitting. Check back in within 3-5 minutes!
            </Typography>
            <Grid container className={classes.formControl}>
              <form>
                <Grid container alignItems="flex-start" spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="Artist"
                      label="Artist"
                      name="Artist"
                      autoComplete="Artist"
                      autoFocus
                      value={artist}
                      onChange={handleArtistChange}
                      helperText={errors && "Please enter artist."}
                      error={errors.length > 0}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      startIcon={<SaveIcon />}
                      size="large"
                      disabled={artist.length === 0}
                      style={{ marginTop: "3%" }}
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Container>
        </CardContent>
      </Card>
      {successAlert}
    </div>
  );
}
