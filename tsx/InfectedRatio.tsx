import React, { useEffect, useState } from 'react';
import { CartesianGrid, Legend, ResponsiveContainer, Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts';
import { makeStyles } from '@material-ui/core/styles';
import { useStyles } from './styles';
import { Typography, Grid, Switch} from '@material-ui/core';

export const toolTipStyles = makeStyles(theme => ({
  tooltip: {
    margin: "0px",
    padding: "10px",
    backgroundColor: "rgb(255, 255, 255)",
    border: "1px solid rgb(204, 204, 204)",
    whiteSpace: "nowrap"
  }
}))

const CustomTooltip = ({ active, payload, label }) => {
  const classes = toolTipStyles()
 
  if (active) {
    return (
      <div className={classes.tooltip}>
        <p className="">{`${label}`} </p>
        <p>
          <span className="label">Tamponi : </span>
          <span className="intro">{`${payload[0].payload.tamponi}`}</span>
        </p>
        <p>
          <span className="label">Cases : </span>
          <span className="intro">{`${payload[0].payload.totale_casi}`}</span>
        </p>
        <p>
          <span className="label">Cases : </span>
          <span className="intro">{`${payload[0].payload.percentage}`} %</span>
        </p>

      </div>
    );
  }

  return null;
};

export default function TamponiInfectedRatioSeries() {
  const [data, setData] = useState(null);
  const classes = useStyles();
  const [zoom, setZoom] = useState(false);
  useEffect(() => {

    fetch('/tamponi_infected_ratio')
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        setData(data)
      });
  }, [])
  const handleZoomChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    setZoom(event.target.checked)
  }
  return (
    <React.Fragment>
            <Typography component="div">
        <Grid component="label" container alignItems="center" spacing={1}>
          <Grid item>Full scale</Grid>
          <Grid item>
            <Switch
              checked={zoom}
              onChange={handleZoomChange}
            />
          </Grid>
          <Grid item>Zoom</Grid>
        </Grid>
        </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart

          data={data}
          margin={{
            top: 5, right: 0, left: 0, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" tickCount={9} />
          <YAxis unit="%" domain={[0, (zoom ? 'dataMax': 100)]} />
          <Tooltip content={<CustomTooltip active={false} payload={null} label={null} />} />
          <Legend />
          <Line type="linear" dataKey="percentage" name="Infected / Test" stroke="#8884d8" activeDot={{ r: 8 }} />

        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  )
}