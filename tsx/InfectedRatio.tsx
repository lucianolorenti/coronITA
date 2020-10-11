import React, { useEffect, useState } from 'react';
import { CartesianGrid, Brush, Legend, ResponsiveContainer, Line, LineChart, ReferenceLine, Label, Tooltip, XAxis, YAxis } from 'recharts';
import { makeStyles } from '@material-ui/core/styles';
import { useStyles, plotHeight } from './styles';
import { Typography, Grid, Switch, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import GraphContainer from './GraphContainer';
declare var regions: any;
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
interface TamponiInfectedRatioSeriesProps {
  title: any
}
export default function TamponiInfectedRatioSeries(props: TamponiInfectedRatioSeriesProps) {
  const [data, setData] = useState(null);
  const classes = useStyles();
  const [zoom, setZoom] = useState(false);
  const [currentRegion, setCurrentRegion] = React.useState("All");
  useEffect(() => {

    fetch('/tamponi_infected_ratio?region=' + currentRegion)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        setData(data)
      });
  }, [currentRegion])
  const handleZoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(event.target.checked)
  }
  const handleCurrentRegionChange = (event, newRegion) => {
    setCurrentRegion(newRegion)
  };
  const regions_all = ['All'].concat(regions)

  const RegionSelector = () => {
    return (<Autocomplete
      id="combo-box-demo"
      options={regions_all}
      onChange={handleCurrentRegionChange}
      getOptionLabel={function (option: string) { return option }}
      style={{ width: 300 }}
      value={currentRegion}
      renderInput={params => <TextField {...params} label="Region" margin="none" />}
    />)
  }
  const ZoomSelector = () => {
    return (<React.Fragment>
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
    </React.Fragment>)
  }
  const controls = [RegionSelector(),
  ZoomSelector()]

  return (<GraphContainer 
  title={props.title} 
  controls={controls} >
    <ResponsiveContainer 
    width="100%" 
    height={plotHeight}>
      <LineChart

        data={data}
        margin={{
          top: 5, right: 0, left: 0, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" tickCount={9} />
        <YAxis unit="%" domain={[0, (zoom ? 'dataMax' : 100)]} />
        <Tooltip content={<CustomTooltip active={false} payload={null} label={null} />} />
        <Legend />
        <Line 
          type="linear" 
          dataKey="percentage" 
          name="Infected / Test" 
          dot={{ stroke: "#8884d8",  r: 0.5 }}
          strokeWidth={1.5} 
          activeDot={{ r: 8 }} />

        <ReferenceLine x="2020-03-09" stroke="#EE5555">
            <Label>  LockDown </Label>
        </ReferenceLine>

        <ReferenceLine x="2020-05-04" stroke="#EE5555">
            <Label>  Fase 2 </Label>
        </ReferenceLine>

        <ReferenceLine x="2020-06-15" stroke="#EE5555">
            <Label>  Fase 3 </Label>
        </ReferenceLine>
        <Brush height={20} dataKey={'day'}  />
      </LineChart>
    </ResponsiveContainer>
  </GraphContainer>)

}
