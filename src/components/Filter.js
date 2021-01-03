import Autocomplete from "@material-ui/lab/Autocomplete";
import React from "react";
import SearchIcon from "@material-ui/icons/Search";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";

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
  return (
    <Container maxWidth="xs">
      <Grid container justify="center" alignItems="center">
        <Grid item xs={6}>
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value) {
                    handleSubmit(e);
                  }
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <IconButton
            style={{ color: "white", backgroundColor: "blue" }}
            edge="start"
            onClick={handleSubmit}
          >
            <SearchIcon />
          </IconButton>
        </Grid>
      </Grid>
      <FormControl>
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
            "valuence",
            "tempo",
          ].map((attribute) => (
            <MenuItem key={attribute} value={attribute}>
              {attribute}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Attribute of Song</FormHelperText>
      </FormControl>
      <br></br>
    </Container>
  );
}
