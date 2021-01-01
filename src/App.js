import React from "react";
import { Vega } from "react-vega";
import Filter from "./Filter";

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

  interpolate: "monotone",
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
    max: Math.ceil(highest),
    min: Math.floor((lowest + Number.EPSILON) * 10) / 10,
  };
};

const { addEventListener, removeEventListener } = window;

function convertDate(releaseDate) {
  let data = releaseDate.substring(0, releaseDate.indexOf("--") - 1);
  return data;
}

class App extends React.Component {
  state = {
    width: 400,
    height: 300,
    graphData: [],
    completeData: [],
    selectedField: "acousticness",
    min: 0,
    max: 0,
  };

  componentDidMount() {
    addEventListener("resize", this.resizeListener, {
      passive: true,
      capture: false,
    });
    fetch("http://localhost:8080/info?artist=Excision")
      .then((response) => response.json())
      .then((d) => {
        const field = this.state.selectedField;
        const a = d.map((d) => ({
          date: convertDate(d.releaseDate),
          [field]: d.acousticness,
          song: d.song,
          url: d.link,
        }));
        let { min, max } = yAxisMin_MaxValueFor(a, this.state.selectedField);
        this.setState({ completeData: d, graphData: a, min, max });
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
              title: "Energy",
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

  render() {
    const {
      state: { width, height, graphData },
      getSpec,
    } = this;

    if (graphData.length == 0) return <h1>test</h1>;

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
        >
          {" "}
        </Filter>
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
