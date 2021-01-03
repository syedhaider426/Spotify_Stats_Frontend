import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";

// Styling for the form control
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

// Gets the current year
const currentYear = new Date().getFullYear();

/**
 * Represents the filter to get songs within a certain year range
 */
export default function Year({
  year,
  handleChangeStartYear,
  handleChangeEndYear,
  startYear,
  endYear,
}) {
  var yearList = [];
  // Range for the inputs in startYear and endYear dropdown
  while (year <= currentYear) {
    yearList.push(year);
    year++;
  }

  const classes = useStyles();
  return (
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
  );
}
