
import { TextField, Typography, Grid } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useEffect, useState } from 'react';
import { CartesianGrid, LineChart, ResponsiveContainer, Tooltip, Legend, Line, XAxis, YAxis } from 'recharts';
import { makeStyles } from '@material-ui/core/styles';
import { useStyles } from './styles';
import Switch, { SwitchClassKey, SwitchProps } from '@material-ui/core/Switch';

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
            <span className="label">Dead : </span>
            <span className="intro">{`${payload[0].payload.deceduti}`}</span>
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
export default function DeadProportion() {
    const [data, setData] = useState(null);
    const [zoom, setZoom] = useState(false);

    const [currentRegion, setCurrentRegion] = React.useState("All");
    const fetchData = (newRegion) => {
        fetch('/dead_proportion?region=' + newRegion)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                setData(data)
            });
    }
    const handleCurrentRegionChange = (event, newRegion) => {
        setCurrentRegion(newRegion)
    };
    const handleZoomChange = (event : React.ChangeEvent<HTMLInputElement>) => {
      setZoom(event.target.checked)
    }
    useEffect(() => {
        fetchData(currentRegion)
    }, [currentRegion])
    const regions_all = ['All'].concat(regions)
    const classes = useStyles()
    return (
        <div className={classes.gridelement}>
            <Autocomplete
                id="combo-box-demo"
                options={regions_all}
                onChange={handleCurrentRegionChange}
                getOptionLabel={function (option: string) { return option }}
                style={{ width: 300 }}
                value={currentRegion}
                renderInput={params => <TextField {...params} label="Region" margin="none" />}
            />
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
                    <Line type="linear" dataKey="percentage" name="Dead / Positive" stroke="#8884d8" activeDot={{ r: 8 }} />

                </LineChart>
            </ResponsiveContainer>
        </div>)
}