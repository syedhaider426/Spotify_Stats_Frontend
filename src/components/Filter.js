import Autocomplete from "@material-ui/lab/Autocomplete";
import React from "react";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import FormHelperText from "@material-ui/core/FormHelperText";
import { Link } from "react-router-dom";
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

const spotifyStats = {
  acousticness: "track is acoustic",
  danceability: "suitable for dancing",
  energy: "perceptual measure of intensity and activity.",
  instrumentalness: "track contains no vocals",
  liveness: "presence of an audience in the recording",
  loudness: "overall loudness of a track in decibels",
  speechiness: "presence of spoken words in a track",
  valence: "musical positiveness conveyed by a track",
  tempo: "estimated tempo of track in BPM",
};

const SpotifyTypography = withStyles({
  root: {
    color: "#1DB954",
  },
})(Typography);

/**
 * Filter function represents the user's ability to change the value in
 * dropdown to see different attributes for the artist's songs
 */
export default function Filter({
  attribute,
  handleAttributeChange,
  handleSubmit,
  handleArtistChange,
  artistData,
}) {
  const classes = useStyles();
  return (
    <Container maxWidth="xs">
      <SpotifyTypography align="center" variant="h3" color="primary">
        Spotify Stats
      </SpotifyTypography>
      <Grid container className={classes.formControl}>
        <Autocomplete
          id="tags-outlined"
          options={artistData}
          fullWidth
          getOptionLabel={(option) => option}
          filterSelectedOptions
          onChange={(e, v) => handleArtistChange(e, v)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Enter Artist..."
              helperText={
                <Typography variant="caption">
                  <Link to="/artist">Add an artist!</Link>
                </Typography>
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value) {
                  handleSubmit(e, e.target.value);
                }
              }}
            />
          )}
        />
      </Grid>
      <FormControl className={classes.formControl}>
        <InputLabel>Attribute</InputLabel>
        <Select value={attribute} onChange={handleAttributeChange}>
          {[
            "acousticness",
            "energy",
            "danceability",
            "instrumentalness",
            "liveness",
            "loudness",
            "speechiness",
            "valence",
            "tempo",
          ].map((attribute) => (
            <MenuItem key={attribute} value={attribute}>
              {attribute}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{spotifyStats[attribute]}</FormHelperText>
      </FormControl>
    </Container>
  );
}
