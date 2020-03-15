
import { Checkbox, FormControlLabel, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
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

    const [normalize, setNormalize] = useState(false);

    const [currentRegion, setCurrentRegion] = React.useState("All");
    const fetchData = (newRegion) => {
        fetch('/stacked_area?region=' + newRegion)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                setData(data)
            });
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
    const regions_all = ['All'].concat(regions)
    const classes = useStyles()
    return (
            <React.Fragment>
            <Autocomplete
                id="combo-box-demo"
                options={regions_all}
                onChange={handleCurrentRegionChange}
                getOptionLabel={function (option: string) { return option }}
                style={{ width: 300 }}
                value={currentRegion}
                renderInput={params => <TextField {...params} label="Region" margin="none" />}
            />
            <FormControlLabel
                control={
                    <Checkbox checked={normalize} onChange={handleChangeNormalize}  />
                }
                label="Normalize"
            />
            <ResponsiveContainer width="100%" height={400}>
                <AreaChart
                    width={500}
                    height={400}
                    data={data}
                    stackOffset={normalize ? "expand" : "none"}
                    margin={{
                        top: 10, right: 0, left: 0, bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" name="Discharged healed" dataKey="dimessi_guariti" stackId="1" stroke="#62f442" fill="#62f442" />
                    <Area type="monotone" name="Home isolation" dataKey="isolamento_domiciliare" stackId="1" stroke="#e2c622" fill="#e2c622" />
                    <Area type="monotone" name="Hospitalized with symptoms" dataKey="ricoverati_con_sintomi" stackId="1" stroke="#ea701e" fill="#ea701e" />
                    <Area type="monotone" name="Intensive therapy" dataKey="terapia_intensiva" stackId="1" stroke="#ea2b1f" fill="#ea2b1f" />
                    <Area type="monotone" name="Dead" dataKey="deceduti" stackId="1" stroke="#474747" fill="#474747" />
                    <Legend />
                    <ReferenceLine x="2020-03-09" label="LockDown" stroke="#EE5555" />
                </AreaChart>
            </ResponsiveContainer>
        </React.Fragment>)
}