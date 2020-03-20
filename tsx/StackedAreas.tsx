
import { Checkbox, FormControlLabel, TextField, FormGroup, Grid, Typography, Switch } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useEffect, useState } from 'react';
import { Area, Brush, LineChart, Line, Text, AreaChart, CartesianGrid, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useStyles } from './styles';


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


export default function StackedAreas() {
    const [data, setData] = useState(null);
    const [useAreas, setUseAreas] = useState(true)
    const [normalize, setNormalize] = useState(false);
    const [currentRegion, setCurrentRegion] = React.useState("All");
    const keys = ['dimessi_guariti', 'isolamento_domiciliare', 'ricoverati_con_sintomi', 'terapia_intensiva', 'deceduti']
    const fetchData = (newRegion) => {
        fetch('/stacked_area?region=' + newRegion)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                setData(data)
 
            });
    }
    const handleuseAreaChange = (event) => {
        setUseAreas(event.target.checked)
    }
    const handleChangeNormalize = (event, newValue) => {
        setNormalize(newValue)
    }
    const handleCurrentRegionChange = (event, newRegion) => {
        setCurrentRegion(newRegion)
    };
    useEffect(() => {
        fetchData(currentRegion)
    }, [currentRegion])

    const TrendsAreaChart = () => {
        return (<AreaChart
            data={data}
            stackOffset={normalize ? "expand" : "none"}
            margin={{
                top: 10, right: 0, left: 0, bottom: 0,
            }}
        >
            
            <ReferenceLine x="2020-03-09" label="LockDown" stroke="#EE5555" />
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis yAxisid={1}  label={<Text
                            x={0}
                            y={0}
                            dx={20}
                            dy={300}
                            offset={0}
                            angle={-90}
                        >  Total cases </Text>}  />
            <Tooltip />
            <Area type="monotone" name="Discharged healed" dataKey="dimessi_guariti" stackId="1" stroke="#62f442" fill="#62f442" />
            <Area type="monotone" name="Home isolation" dataKey="isolamento_domiciliare" stackId="1" stroke="#e2c622" fill="#e2c622" />
            <Area type="monotone" name="Hospitalized with symptoms" dataKey="ricoverati_con_sintomi" stackId="1" stroke="#ea701e" fill="#ea701e" />
            <Area type="monotone" name="Intensive therapy" dataKey="terapia_intensiva" stackId="1" stroke="#ea2b1f" fill="#ea2b1f" />
            <Area type="monotone" name="Dead" dataKey="deceduti" stackId="1" stroke="#474747" fill="#474747" />
            <Legend />
            <Brush height={20} dataKey={'day'} />
        </AreaChart>)
    }

    const TrendsLineChart = () => {
        return (<LineChart
            data={data}
            margin={{
                top: 10, right: 0, left: 0, bottom: 0,
            }}
        >
            
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
   
           
            <Tooltip />
            <Line type="monotone" name="Discharged healed" dataKey="dimessi_guariti"  stroke="#62f442" fill="#62f442" />
            <Line type="monotone" name="Home isolation" dataKey="isolamento_domiciliare"  stroke="#e2c622" fill="#e2c622" />
            <Line type="monotone" name="Hospitalized with symptoms" dataKey="ricoverati_con_sintomi"  stroke="#ea701e" fill="#ea701e" />
            <Line type="monotone" name="Intensive therapy" dataKey="terapia_intensiva" stroke="#ea2b1f" fill="#ea2b1f" />
            <Line type="monotone" name="Dead" dataKey="deceduti"  stroke="#474747" fill="#474747" />
            <Legend />
            <YAxis type="number" domain={[0, dataMax => (dataMax + dataMax*0.1)]}  />
            <ReferenceLine x="2020-03-09" label="LockDown" stroke="#EE5555" />
            <Brush height={20} dataKey={'day'} />
        </LineChart>)
    }
    const regions_all = ['All'].concat(regions)
    const classes = useStyles()
    return (
        <React.Fragment>
            <FormGroup>
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
          <Grid item>Curves</Grid>
          <Grid item>
            <Switch
              checked={useAreas}
              onChange={handleuseAreaChange}
            />
          </Grid>
          <Grid item>Areas</Grid>
        </Grid>
      </Typography>
            {useAreas ? <FormControlLabel
                control={
                    <Checkbox checked={normalize} onChange={handleChangeNormalize} />
                }
                label="Normalize"
            /> : null}
                </FormGroup>
            <ResponsiveContainer width="100%" height={400}>
              { useAreas ? TrendsAreaChart() : TrendsLineChart() }
            </ResponsiveContainer>
        </React.Fragment>)
}