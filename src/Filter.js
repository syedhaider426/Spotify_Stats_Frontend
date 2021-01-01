import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useState, useEffect } from "react";
import { Fragment } from "react";

export default function Filter({ attribute, handleChange }) {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8080/allArtists")
      .then((response) => response.json())
      .then((d) => {
        setData(d);
      });
  }, []);

  return (
    <Fragment>
      <Autocomplete
        id="tags-outlined"
        options={data}
        getOptionLabel={(option) => option}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Enter Artist..." />
        )}
      />
      <FormControl>
        <InputLabel id="demo-simple-select-helper-label">Attribute</InputLabel>
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
      </FormControl>
    </Fragment>
  );
}
