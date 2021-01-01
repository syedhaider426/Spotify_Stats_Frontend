import React from "react";
import { Vega } from "react-vega";

// chart config
const jobpalBlue = "#e0e0e0";
const jobpalLightGrey = "#0084FF";
const jobpalDarkGrey = "#9e9e9e";

const areaMark = {
  type: "area",
  color: jobpalBlue,
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

const getQuantitativeYObj = (field, title, values) => ({
  field,
  type: "quantitative",
  axis: {
    title,
    format: "d",
    values,
  },
});

const legendConfig = {
  title: null,
  offset: -106,
  padding: 5,
  strokeColor: jobpalDarkGrey,
  strokeWidth: 2,
  symbolType: "stroke",
  symbolOffset: 0,
  symbolStrokeWidth: 10,
  labelOffset: 0,
  cornerRadius: 10,
  symbolSize: 100,
  clipHeight: 20,
};

const getSpec = (yAxisValues = [], rangeLen = 0) => ({
  $schema: "https://vega.github.io/schema/vega-lite/v4.json",
  title: "Demo Chart",
  layer: [
    {
      mark: {
        ...areaMark,
        color: jobpalLightGrey,
      },
      encoding: {
        x: getDateXObj(rangeLen),
        y: getQuantitativeYObj("user_comments", "", yAxisValues),
        stroke: {
          field: "symbol",
          type: "ordinal",
          scale: {
            domain: ["User Comments", "Active Users"],
            range: [jobpalLightGrey, jobpalBlue],
          },
        },
      },
    },
  ],
  config: {
    legend: legendConfig,
  },
});

const data = [
  { user_comments: 0, active_users: 0, date: "2019-10-01" },
  { user_comments: 3, active_users: 2, date: "2019-10-02" },
  { user_comments: 1, active_users: 10, date: "2019-10-03" },
  { user_comments: 1, active_users: 1, date: "2019-10-04" },
  { user_comments: 6, active_users: 0, date: "2019-10-05" },
  { user_comments: 1, active_users: 0, date: "2019-10-06" },
  { user_comments: 2, active_users: 1, date: "2019-10-07" },
];

// get max value from data arary
const yAxisMaxValueFor = (...keys) => {
  const maxList = keys.map(
    (key) =>
      data.reduce(
        // find the item containing the max value
        (acc, cur) => (cur[key] > acc[key] ? cur : acc)
      )[key]
  );
  return Math.max(...maxList);
};

const { addEventListener, removeEventListener } = window;

class Swag extends React.Component {
  state = {
    width: 400,
    height: 300,
  };

  componentDidMount() {
    addEventListener("resize", this.resizeListener, {
      passive: true,
      capture: false,
    });
  }

  componentWillUnmount() {
    removeEventListener("resize", this.resizeListener, {
      passive: true,
      capture: false,
    });
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

  yAxisValues = Array.from({
    length: yAxisMaxValueFor("active_users", "user_comments"),
  }).map((v, i) => i + 1);

  render() {
    const {
      state: { width, height },
      yAxisValues,
    } = this;
    console.log(yAxisValues);
    const spec = getSpec(yAxisValues, data.length);

    return (
      <div
        ref={this.refChartWrapper}
        style={{ margin: "10vh 10vw", width: "80vw", height: "50vh" }}
      >
        <Vega
          spec={{
            ...spec,
            autosize: "fit",
            resize: true,
            contains: "padding",
            width,
            height,
            data: { values: data },
          }}
          actions={{
            export: true,
            source: false,
            compiled: false,
            editor: false,
          }}
          downloadFileName={"Just Name It"}
        />
      </div>
    );
  }
}

export default Swag;
