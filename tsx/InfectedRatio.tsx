import React, { useEffect, useState } from 'react';
import { CartesianGrid, Legend, ResponsiveContainer, Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts';
import { makeStyles } from '@material-ui/core/styles';
import { useStyles } from './styles';

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
  useEffect(() => {

    fetch('/tamponi_infected_ratio')
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        setData(data)
      });
  }, [])

  return (
    <React.Fragment>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart

          data={data}
          margin={{
            top: 5, right: 30, left: 30, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" tickCount={9} />
          <YAxis unit="%" />
          <Tooltip content={<CustomTooltip active={false} payload={null} label={null} />} />
          <Legend />
          <Line type="linear" dataKey="percentage" name="Infected / Test" stroke="#8884d8" activeDot={{ r: 8 }} />

        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  )
}