import { Checkbox, FormControlLabel, TextField } from '@material-ui/core';

import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, Tooltip, CartesianGrid, ResponsiveContainer, Text, XAxis, YAxis, Label } from 'recharts';
import { CustomizedAxisTick } from './chart';
import { useStyles, plotHeight } from './styles';
import GraphContainer from './GraphContainer';
declare var regions: any;
declare var days: Array<any>;

interface ProvincePlotProps {
    title: any
}

export default function ProvincePlot(props: ProvincePlotProps) {
    const classes = useStyles();
    const [regionTimeSerie, setRegionTimeSerie] = useState(null);
    const [currentRegion, setCurrentRegion] = React.useState("Veneto");
    const [normalized, setNormalized] = useState("");
    const fetchData = (newRegion: string) => {
        fetch('/province_cases_hist?region=' + newRegion + "&normalized=" + normalized)
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
            label="Normalize by province population"
        />
    ]

    return (
        <GraphContainer
            title={props.title}
            subtitle={"Date " + days[days.length - 1]}
            controls={controls} >
            <ResponsiveContainer
                width="100%"
                height={plotHeight} >


                <BarChart
                    data={regionTimeSerie}
                    margin={{
                        left: 15,
                        bottom: 75
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="category" interval={0} tick={<CustomizedAxisTick />} dataKey="denominazione_provincia" />
                    <YAxis>
                        <Label position="left" className={classes.yAxisLabel} >

                            {normalized ? "Case per 1000 people" : "Total cases"}

                        </Label>
                    </YAxis>
                    <Tooltip />

                    <Bar dataKey="totale_casi" name="Total cases" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </GraphContainer>

    )
}
