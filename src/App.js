import React from "react";
import { Vega } from "react-vega";
import Filter from "./Filter";
import Year from "./Year";

// chart config
const jobpalBlue = "#e0e0e0";
const jobpalLightGrey = "#0084FF";
const jobpalDarkGrey = "#9e9e9e";

const areaMark = {
  type: "line",
  point: {
    filled: false,
    fill: "white",
    stroke: "26",
    size: "25",
  },

  interpolate: "catmull-rom",
};

const getDateXObj = (rangeLen) => ({
  field: "date",
  type: `${rangeLen > 30 ? "temporal" : "ordinal"}`,
  timeUnit: "yearmonthdate",
  axis: {
    title: "Date",
    labelAngle: -45,
  },
});

// get max value from data arary
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
  return {
    max: highest < 0.9 ? highest + 0.1 : highest,
    min: Math.floor((lowest + Number.EPSILON) * 10) / 10,
  };
};

const { addEventListener, removeEventListener } = window;

function convertDate(releaseDate) {
  let data = releaseDate.substring(0, releaseDate.indexOf("--") - 1);
  return data;
}

var random = Math.floor(Math.random() * 230);

class App extends React.Component {
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

  componentDidMount() {
    addEventListener("resize", this.resizeListener, {
      passive: true,
      capture: false,
    });

    fetch("http://localhost:8080/allArtists")
      .then((response) => response.json())
      .then((d) => {
        this.setState({ artistData: d });
      });
  }

  componentWillUnmount() {
    removeEventListener("resize", this.resizeListener, {
      passive: true,
      capture: false,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedField !== this.state.selectedField) {
      const field = this.state.selectedField;
      const a = this.state.completeData.map((d) => ({
        date: convertDate(d.releaseDate),
        [field]: d[field],
        song: d.song,
        url: d.link,
      }));
      let { min, max } = yAxisMin_MaxValueFor(a, this.state.selectedField);

      this.setState({ graphData: a, min, max });
    }
  }

  resizeListener = () => {
    if (!this.chartWrapper) return;

    const child = this.chartWrapper.querySelector("div");
    child.style.display = "none";

    const { clientWidth, clientHeight: height } = this.chartWrapper;
    const width = clientWidth - 40; // as padding: "0 20px"
    this.setState({ width, height });

    child.style.display = "block";
  };

  refChartWrapper = (el) => {
    this.chartWrapper = el;
    if (el) this.resizeListener();
  };

  setYAxis = () => {
    let { max, min } = yAxisMin_MaxValueFor(
      this.state.graphData,
      this.state.selectedField
    );
    var arr = [];
    arr.push(min);
    for (var x = min + 0.2; x <= max; x += 0.2) {
      arr.push(Math.floor((x + Number.EPSILON) * 10) / 10);
    }
    return arr;
  };

  getQuantitativeYObj = (field, title, values) => ({
    field,
    type: "quantitative",
    axis: {
      title,
      values,
    },
    scale: { domain: [this.state.min, this.state.max] },
  });

  getSpec = (yAxisValues = [], rangeLen = 0) => ({
    title: "All-Time Stats",
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    layer: [
      {
        mark: {
          ...areaMark,
        },
        encoding: {
          x: getDateXObj(rangeLen),
          y: this.getQuantitativeYObj(
            this.state.selectedField,
            "",
            yAxisValues
          ),
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
      },
    ],
  });

  handleChange = ({ target }) => {
    if (this.state.selectedField !== target.value)
      this.setState({ selectedField: target.value });
  };

  handleArtistChange = (e, value) => {
    this.setState({ artist: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.artist !== "") {
      fetch(`http://localhost:8080/info?artist=${this.state.artist}`)
        .then((response) => response.json())
        .then((d) => {
          const field = this.state.selectedField;
          const a = d.map((d) => ({
            date: convertDate(d.releaseDate),
            [field]: d[field],
            song: d.song,
            url: d.link,
          }));
          let { min, max } = yAxisMin_MaxValueFor(a, field);
          const startYear = parseInt(this.getYear(d[0].releaseDate));
          const endYear = parseInt(this.getYear(d[d.length - 1].releaseDate));
          this.setState({
            completeData: d,
            graphData: a,
            year: startYear,
            startYear,
            endYear,
            min,
            max,
          });
        });
    }
  };

  getYear = (year) => {
    return convertDate(year).substring(0, 4);
  };

  handleChangeStartYear = ({ target }) => {
    //2016-2020
    //value is 2017
    // check if value is less than/equal to end year
    console.log("Was this called again", target.value);
    let data;
    // this.setState({ startYear: target.value });
    data = this.filterByYear("start", target.value);
    const a = data.map((d) => ({
      date: convertDate(d.releaseDate),
      [this.state.selectedField]: d[this.state.selectedField],
      song: d.song,
      url: d.link,
    }));
    let { min, max } = yAxisMin_MaxValueFor(a, this.state.selectedField);
    this.setState({
      graphData: a,
      startYear: target.value,
      min,
      max,
    });
  };

  handleChangeEndYear = ({ target }) => {
    //2016-2020
    //value is 2017
    // check if value is less than/equal to end year
    let data;
    this.setState({ endYear: target.value });
    data = this.filterByYear("end", target.value);
    const a = data.map((d) => ({
      date: convertDate(d.releaseDate),
      [this.state.selectedField]: d[this.state.selectedField],
      song: d.song,
      url: d.link,
    }));
    let { min, max } = yAxisMin_MaxValueFor(a, this.state.selectedField);
    this.setState({
      graphData: a,
      endYear: target.value,
      min,
      max,
    });
  };

  filterByYear = (type, year) => {
    const { completeData, startYear, endYear } = { ...this.state };
    const d = completeData.reduce(function (filtered, option) {
      const releaseDate = convertDate(option.releaseDate).substring(0, 4);
      console.log("releaseDate", releaseDate);
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
      state: { width, height, graphData },
      getSpec,
    } = this;

    if (graphData.length == 0)
      return (
        <div
          ref={this.refChartWrapper}
          style={{ margin: "10vh 10vw", width: "80vw", height: "50vh" }}
        >
          <Filter
            attribute={this.state.selectedField}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            handleArtistChange={this.handleArtistChange}
            artist={this.state.artist}
            artistData={this.state.artistData}
          ></Filter>
        </div>
      );

    const arr = this.setYAxis();
    const spec = getSpec(arr, graphData.length);
    return (
      <div
        ref={this.refChartWrapper}
        style={{ margin: "10vh 10vw", width: "80vw", height: "50vh" }}
      >
        <Filter
          attribute={this.state.selectedField}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          handleArtistChange={this.handleArtistChange}
          artist={this.state.artist}
          artistData={this.state.artistData}
        ></Filter>
        <Year
          year={this.state.year}
          handleChangeStartYear={this.handleChangeStartYear}
          handleChangeEndYear={this.handleChangeEndYear}
          startYear={this.state.startYear}
          endYear={this.state.endYear}
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

export default App;
