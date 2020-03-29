import { Checkbox, FormControlLabel, TextField } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useEffect, useState } from 'react';
import { CartesianGrid, Brush, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Text, Tooltip, XAxis, YAxis, Label } from 'recharts';
import { CustomizedAxisTick } from './chart';
import { useStyles } from './styles';
import GraphContainer from './GraphContainer';
declare var regions: any;
declare var days: Array<any>;

var colors = ['#a6cee3',
    '#1f78b4',
    '#b2df8a',
    '#33a02c',
    '#fb9a99',
    '#e31a1c',
    '#fdbf6f',
    '#ff7f00',
    '#cab2d6',
    '#6a3d9a',
    '#ffff99',
    '#b15928',
    '#a6cee3',
    '#1f78b4',
    '#b2df8a']


interface ProvinceTimeSeriesPlotProps {
    title: any
}
export default function ProvinceTimeSeriesPlot(props: ProvinceTimeSeriesPlotProps) {
    const classes = useStyles();
    const [regionTimeSerie, setRegionTimeSerie] = useState({ data: null, provinces: [] });
    const [currentRegion, setCurrentRegion] = React.useState("Veneto");
    const [normalized, setNormalized] = useState("");
    const fetchData = (newRegion) => {
        fetch('/province_cases?region=' + newRegion + "&normalized=" + normalized)
            .then(function (response) {

                return response.json();
            })
            .then(function (data) {
                setRegionTimeSerie(data)
            });
    }
    const handleCurrentRegionChange = (event, newRegion) => {
        setCurrentRegion(newRegion)
    };
    useEffect(() => {
        fetchData(currentRegion)
    }, [currentRegion, normalized])



    const handleChangeNormalized = name => event => {
        if (event.target.checked) {
            setNormalized(name)
        } else {
            setNormalized("")
        }
    };
    const controls = [

        <Autocomplete
            id="combo-box-demo"
            options={regions}
            onChange={handleCurrentRegionChange}
            getOptionLabel={function (option: string) { return option }}
            style={{ width: 300 }}
            value={currentRegion}
            renderInput={params => <TextField {...params} label="Region" margin="none" />}
        />,
        <FormControlLabel
            control={
                <Checkbox
                    onChange={handleChangeNormalized('Population')}
                    value="checkedB"
                    color="primary"
                />
            }
            label="Cases per 1000 people"
        />
    ]

    return (
        <GraphContainer title={props.title} controls={controls} >
            <ResponsiveContainer width="100%" height={500} >

                <LineChart
                    data={regionTimeSerie.data}
                    margin={{left: 15}}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <ReferenceLine x="2020-03-09" stroke="#EE5555">
              <Label>  LockDown </Label>
            </ReferenceLine>
                    <XAxis type="category" interval={1} dataKey="day" />
                    <YAxis>
                        <Label 
                        value={normalized ? "Case per 1000 people" : "Total cases"} 
                        position="left" 
                        textAnchor='middle' 
                        className={classes.yAxisLabel} />
                    </YAxis>

                    <Tooltip />
                    {regionTimeSerie.provinces.map((elem, idx) => {
                        return <Line type="linear"
                            key={elem}
                            dataKey={elem}
                            name={elem}
                            stroke={colors[idx]}
                            strokeWidth={2}
                            activeDot={{ r: 11 }} />
                    })}
                    <Legend verticalAlign="top" />
                    <Brush height={20} dataKey={'day'} />
                </LineChart>
            </ResponsiveContainer>
        </GraphContainer>
    )

}
        /*
<Typography variant="h6">
Date {days[days.length - 1]}
</Typography>
{normalized ? "Every province is normalized according to its population. Data obtained from wikipedia" : null}
*/