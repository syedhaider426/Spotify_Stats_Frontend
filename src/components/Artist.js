import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import { Button, Card, CardContent } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import SaveIcon from "@material-ui/icons/Save";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useHistory } from "react-router";

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
  const [failOpen, setFailOpen] = useState(false);
  const history = useHistory();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleFailClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setFailOpen(false);
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
      fetch("/artist", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ artist }),
      })
        .then((response) => {
          if (response.ok) return response.json();
          else {
            setFailOpen(true);
            setArtist("");
            throw new Error("Artist already exists");
          }
        })
        .then((data) => {
          setArtist("");
          setOpen(true);
        })
        .catch((ex) => console.log(ex));
    }
  };

  const successAlert = (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity="success">
        Succesfully added artist! Loading tracks momentarily...
      </Alert>
    </Snackbar>
  );

  const failAlert = (
    <Snackbar
      open={failOpen}
      autoHideDuration={6000}
      onClose={handleFailClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={handleFailClose} severity="error">
        Artist already exists!
      </Alert>
    </Snackbar>
  );

  const classes = useStyles();
  return (
    <div
      style={{
        width: "45%",
        minWidth: "400px",
        marginTop: "2%",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <Card>
        <CardContent>
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
                <Grid container>
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
                      style={{ marginTop: "3%", marginLeft: "12%" }}
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      startIcon={<ArrowBackIcon />}
                      size="large"
                      style={{ marginTop: "3%", marginLeft: "12%" }}
                      onClick={() => history.push("/")}
                    >
                      Go Back
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Container>
        </CardContent>
      </Card>
      {successAlert}
      {failAlert}
    </div>
  );
}
