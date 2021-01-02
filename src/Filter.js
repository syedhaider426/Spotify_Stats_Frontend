import {
  Container,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import SearchIcon from "@material-ui/icons/Search";
import Year from "./Year";

export default function Filter({
  attribute,
  handleChange,
  handleSubmit,
  handleArtistChange,
  artist,
  artistData,
}) {
  return (
    <div>
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
          <InputLabel id="demo-simple-select-helper-label">
            Attribute
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={attribute}
            onChange={handleChange}
          >
            <MenuItem value={"acousticness"}>acousticness</MenuItem>
            <MenuItem value={"energy"}>energy</MenuItem>
            <MenuItem value={"danceability"}>danceability</MenuItem>
            <MenuItem value={"instrumentalness"}>instrumentalness</MenuItem>
            <MenuItem value={"liveness"}>liveness</MenuItem>
            {/* <MenuItem value={"loudness"}>loudness</MenuItem> */}
            <MenuItem value={"speechiness"}>speechiness</MenuItem>
            <MenuItem value={"valence"}>valence</MenuItem>
            {/* <MenuItem value={"tempo"}>loudness</MenuItem> */}
          </Select>
          <FormHelperText>Attribute of Song</FormHelperText>
        </FormControl>{" "}
        <br></br>
      </Container>
    </div>
  );
}
