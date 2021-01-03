import React, { Component } from "react";
import { Vega } from "react-vega";
import Filter from "./components/Filter";
import Year from "./components/Year";

// Specific graph will be a line chart
const areaMark = {
  type: "line",
  point: {
    filled: false,
    fill: "white",
    stroke: "26",
    size: "25",
  },
  interpolate: "linear",
};

// Specifies the type of data in the x-axis
const getDateXObj = (rangeLen) => ({
  field: "date",
  type: `${rangeLen > 30 ? "temporal" : "ordinal"}`,
  timeUnit: "yearmonthdate",
  axis: {
    title: "Date",
    labelAngle: -45,
  },
});

// determine the upper and low bounds for the y-axis
const yAxisMin_MaxValueFor = (data, key) => {
  // There's no real number bigger than plus Infinity
  var lowest = Number.POSITIVE_INFINITY;
  var highest = Number.NEGATIVE_INFINITY;
  var tmp;
  for (var i = data.length - 1; i >= 0; i--) {
    tmp = data[i][key];
    if (tmp < lowest) lowest = tmp;
    if (tmp > highest) highest = tmp;
  }
  // These attributes will have values greater than 1
  if (key === "tempo" || key === "loudness")
    return {
      max: highest,
      min: lowest,
    };
  // These attributes will have values less than 1
  return {
    max: highest < 0.9 ? highest + 0.1 : highest,
    min: Math.floor((lowest + Number.EPSILON) * 10) / 10,
  };
};

const { addEventListener, removeEventListener } = window;

// Converts date attribute from server into a readable date
function convertDate(releaseDate) {
  let date = releaseDate.substring(0, releaseDate.indexOf("--") - 1);
  return date;
}

// Gets only the year from date
function getYear(date) {
  return convertDate(date).substring(0, 4);
}

export default class App extends Component {
  state = {
    width: 400,
    height: 300,
    graphData: [],
    completeData: [],
    selectedField: "danceability",
    artist: "",
    min: 0,
    max: 0,
    artistData: [],
    year: 0,
    startYear: 0,
    endYear: 0,
  };

  /**
   * Load the artists from database into the autocomplete
   * and add capability to resize the graph properly
   */
  componentDidMount() {
    addEventListener("resize", this.resizeListener, {
      passive: true,
      capture: false,
    });
    fetch("http://localhost:8080/allArtists")
      .then((response) => response.json())
      .then((artistData) => {
        this.setState({ artistData });
      });
  }

  /* Resize the graph properly */
  componentWillUnmount() {
    removeEventListener("resize", this.resizeListener, {
      passive: true,
      capture: false,
    });
  }

  // Update the current attribute when it is changed
  componentDidUpdate(prevProps, prevState) {
    const { completeData, selectedField } = { ...this.state };
    if (prevState.selectedField !== selectedField) {
      const field = selectedField;

      // Get the date for the selected attribute
      const newData = completeData.map((d) => ({
        date: convertDate(d.releaseDate),
        [field]: d[field],
        song: d.song,
        url: d.link,
      }));

      // determine the upper and low bounds for the y-axis
      let { min, max } = yAxisMin_MaxValueFor(newData, selectedField);
      this.setState({ graphData: newData, min, max });
    }
  }

  // Used to resize the grid when browser size is changed
  resizeListener = () => {
    if (!this.chartWrapper) return;
    const child = this.chartWrapper.querySelector("div");
    child.style.display = "none";
    const { clientWidth, clientHeight: height } = this.chartWrapper;
    const width = clientWidth - 40; // as padding: "0 20px"
    this.setState({ width, height });
    child.style.display = "block";
  };

  // Used to resize the grid when browser size is changed
  refChartWrapper = (el) => {
    this.chartWrapper = el;
    if (el) this.resizeListener();
  };

  // Sets the values/ticks for the y-axis
  setYAxis = () => {
    const { graphData, selectedField } = { ...this.state };
    // Get lower/upper bound for y-axis
    let { max, min } = yAxisMin_MaxValueFor(graphData, selectedField);
    var arr = [];
    arr.push(min);
    var x;
    if (selectedField === "tempo") {
      for (x = min + 9; x <= max; x += 9) {
        arr.push(Math.floor((x + Number.EPSILON) * 10) / 10);
      }
    } else if (selectedField === "loudness") {
      for (x = min + 1; x <= max; x += 1) {
        arr.push(Math.floor((x + Number.EPSILON) * 10) / 10);
      }
    } else
      for (x = min + 0.2; x <= max; x += 0.2) {
        arr.push(Math.floor((x + Number.EPSILON) * 10) / 10);
      }
    return arr;
  };

  // Set properties for y-axis
  getQuantitativeYObj = (field, title, values) => ({
    field,
    type: "quantitative",
    axis: {
      title,
      values,
    },
    scale: { domain: [this.state.min, this.state.max] },
  });

  // Set spec for vega to process
  getSpec = (yAxisValues = [], rangeLen = 0) => ({
    title: "All-Time Stats",
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    mark: {
      ...areaMark,
    },
    encoding: {
      x: getDateXObj(rangeLen),
      y: this.getQuantitativeYObj(this.state.selectedField, "", yAxisValues),
      href: { field: "url" },
      tooltip: [
        {
          field: this.state.selectedField,
          type: "quantitative",
          title: "Value",
        },
        { field: "song", title: "Song" },
        { field: "date", title: "Date", timeUnit: "yearmonthdate" },
      ],
    },
  });

  // Function called when user changes attribute in 'Attribute' dropdown'
  handleAttributeChange = ({ target }) => {
    const value = target.value;
    if (this.state.selectedField !== value)
      this.setState({ selectedField: value });
  };

  // Function called when user enters a valid artist name
  handleArtistChange = (e, value) => {
    if (value.length > 0) this.setState({ artist: value });
  };

  // When the form is submitted, get data for artist entered
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.artist !== "") {
      fetch(`http://localhost:8080/info?artist=${this.state.artist}`)
        .then((response) => response.json())
        .then((data) => {
          const field = this.state.selectedField;
          const newData = data.map((d) => ({
            date: convertDate(d.releaseDate),
            [field]: d[field],
            song: d.song,
            url: d.link,
          }));
          let { min, max } = yAxisMin_MaxValueFor(newData, field);
          this.setState({
            completeData: data,
            graphData: newData,
            year: parseInt(getYear(data[0].releaseDate)),
            startYear: parseInt(getYear(data[0].releaseDate)),
            endYear: parseInt(getYear(data[data.length - 1].releaseDate)),
            min,
            max,
          });
        });
    }
  };

  // Function is called to update the graph data when user changes start year
  handleChangeStartYear = ({ target }) => {
    let data = this.filterByYear("start", target.value);
    const newData = data.map((d) => ({
      date: convertDate(d.releaseDate),
      [this.state.selectedField]: d[this.state.selectedField],
      song: d.song,
      url: d.link,
    }));
    let { min, max } = yAxisMin_MaxValueFor(newData, this.state.selectedField);
    this.setState({
      graphData: newData,
      startYear: target.value,
      min,
      max,
    });
  };

  // Function is called to update the graph data when user changes end year
  handleChangeEndYear = ({ target }) => {
    let data = this.filterByYear("end", target.value);
    const newData = data.map((d) => ({
      date: convertDate(d.releaseDate),
      [this.state.selectedField]: d[this.state.selectedField],
      song: d.song,
      url: d.link,
    }));
    let { min, max } = yAxisMin_MaxValueFor(newData, this.state.selectedField);
    this.setState({
      graphData: newData,
      endYear: target.value,
      min,
      max,
    });
  };

  // Returns a filtered array based on if the year is within the range of start/end year
  filterByYear = (type, year) => {
    const { completeData, startYear, endYear } = { ...this.state };
    const d = completeData.reduce(function (filtered, option) {
      const releaseDate = convertDate(option.releaseDate).substring(0, 4);
      if (type === "start" && year <= releaseDate && releaseDate <= endYear) {
        filtered.push(option);
      } else if (
        type === "end" &&
        startYear <= releaseDate &&
        releaseDate <= year
      ) {
        filtered.push(option);
      }
      return filtered;
    }, []);
    return d;
  };

  render() {
    const {
      state: {
        width,
        height,
        graphData,
        selectedField,
        artist,
        artistData,
        year,
        startYear,
        endYear,
      },
      getSpec,
      handleAttributeChange,
      handleSubmit,
      handleArtistChange,
      setYAxis,
      handleChangeStartYear,
      handleChangeEndYear,
    } = this;

    const filter = (
      <Filter
        attribute={selectedField}
        handleAttributeChange={handleAttributeChange}
        handleSubmit={handleSubmit}
        handleArtistChange={handleArtistChange}
        artist={artist}
        artistData={artistData}
      ></Filter>
    );

    if (graphData.length === 0)
      return (
        <div
          ref={this.refChartWrapper}
          style={{ margin: "10vh 10vw", width: "80vw", height: "50vh" }}
        >
          {filter}
        </div>
      );

    const yAxis = setYAxis();

    const spec = getSpec(yAxis, graphData.length);
    return (
      <div
        ref={this.refChartWrapper}
        style={{ margin: "10vh 10vw", width: "80vw", height: "50vh" }}
      >
        {filter}
        <Year
          year={year}
          handleChangeStartYear={handleChangeStartYear}
          handleChangeEndYear={handleChangeEndYear}
          startYear={startYear}
          endYear={endYear}
        />
        <Vega
          spec={{
            ...spec,
            autosize: "fit",
            resize: true,
            contains: "padding",
            width,
            height,
            data: { values: graphData },
          }}
          actions={false}
          downloadFileName={"Just Name It"}
        />
      </div>
    );
  }
}
