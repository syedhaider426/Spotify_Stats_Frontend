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
  makeStyles,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

var currentYear = new Date().getFullYear();

const Year = ({
  year,
  handleChangeStartYear,
  handleChangeEndYear,
  startYear,
  endYear,
}) => {
  const classes = useStyles();
  var yearList = [];
  while (year <= currentYear) {
    yearList.push(year);
    year++;
  }
  console.log(endYear);
  return (
    <Fragment>
      <Container maxWidth="xs">
        <FormControl className={classes.formControl}>
          <InputLabel>Start Year</InputLabel>
          <Select onChange={handleChangeStartYear} value={startYear}>
            {yearList.map((year) => (
              <MenuItem value={year} disabled={year > endYear}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel>End Year</InputLabel>
          <Select onChange={handleChangeEndYear} value={endYear}>
            {yearList.map((year) => (
              <MenuItem value={year} disabled={year < startYear}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Container>
    </Fragment>
  );
};

export default Year;
