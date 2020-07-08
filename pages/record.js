import React from "react";
import Head from "next/head";
import Nav from "../components/nav.js";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Recorder from "../components/Recorder";
import NoSsr from "@material-ui/core/NoSsr";

class RadialBar extends React.Component {
  render() {
    const Chart = require("react-apexcharts").default;
    const opts = {
      chart: {
        id: "realtime",
        animations: {
          enabled: true,
          easing: "linear",
          dynamicAnimation: {
            speed: 1000
          }
        },
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      theme: {
        mode: "dark"
      },
      title: {
        text: "Dynamic Updating Chart",
        align: "left"
      },
      markers: {
        size: 0
      },
      yaxis: {
        min: 0,
        max: 100,
        labels: {
          formatter: function(val, index) {
            return val.toFixed(0);
          }
        }
      },
      legend: {
        show: true
      }
    };

    return (
      <NoSsr>
        <Chart
          options={opts}
          series={this.props.series}
          type="line"
          height="380"
        />
      </NoSsr>
    );
  }
}

const EMOTIONS = [
  "joy",
  "sadness",
  "disgust",
  "contempt",
  "anger",
  "fear",
  "surprise",
  "valence"
];

function ShowData({ data }) {
  const expressions = data
    .map(x => (x.faces.length ? x.faces[0].emotions : null))
    .filter(x => x !== null);

  if (!expressions[expressions.length - 1]) {
    return null;
  }
  const dataLists = EMOTIONS.reduce((acc, x) => {
    acc[x] = [];
    return acc;
  }, {});

  expressions.forEach(x => {
    EMOTIONS.forEach(y => {
      dataLists[y].push(x[y]);
    });
  });
  const series = Object.entries(dataLists).map(([name, data]) => ({
    name,
    data
  }));

  console.log(series);
  return <RadialBar series={series} />;
}

function CameraCard({ started, onResults }) {
  return (
    <Card>
      <Typography noWrap variant="h6">
        Camera
      </Typography>
      <Recorder started={started} onResults={onResults} />
    </Card>
  );
}

function LineGraph() {
  return <div>foo</div>;
}

export default function Record() {
  const [started, setStarted] = React.useState(false);
  const [data, setData] = React.useState([]);
  const addItem = item => setData(data.concat(item));
  return (
    <div>
      <Head>
        <script src="https://download.affectiva.com/js/3.2.1/affdex.js"></script>
      </Head>
      <Nav />
      <Grid container spacing={2}>
        <Grid item>
          <CameraCard started={started} onResults={addItem} />
        </Grid>

        <Grid item>
          <Card>
            <Typography noWrap>Playback controls</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setStarted(true)}
            >
              Record
            </Button>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card style={{ minHeight: "400px" }}>
            <Typography noWrap variant="h6">
              Plot
            </Typography>
            <ShowData data={data} />
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
