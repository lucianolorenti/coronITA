import { TextField, FormControlLabel, Checkbox } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useEffect, useState } from 'react';
import { InlineMath } from 'react-katex';
import { Bar, BarChart, CartesianGrid, Text, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CustomizedAxisTick } from './chart';
import { useStyles } from './styles';
declare var regions: any;
declare var days: Array<any>;


export default function ProvincePlot() {
    const classes = useStyles();
    const [regionTimeSerie, setRegionTimeSerie] = useState(null);
    const [currentRegion, setCurrentRegion] = React.useState("Veneto");
    const [normalized, setNormalized] = useState("");
    const fetchData = (newRegion) => {
        fetch('/province_cases_hist?region=' + newRegion + "&normalized="+normalized)
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


    return (<React.Fragment>

        <Autocomplete
            id="combo-box-demo"
            options={regions}
            onChange={handleCurrentRegionChange}
            getOptionLabel={function (option: string) { return option }}
            style={{ width: 300 }}
            value={currentRegion}
            renderInput={params => <TextField {...params} label="Region" margin="none" />}
        />
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
        <Typography variant="h6">
                Date {days[days.length - 1]}
            </Typography>
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
                data={regionTimeSerie}
                margin={{
                    top: 5, right: 0, left: 0, bottom: 19,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="category" interval={0} tick={<CustomizedAxisTick />} dataKey="denominazione_provincia" />
                <YAxis width={60} label={<Text
                            x={0}
                            y={0}
                            dx={20}
                            dy={300}
                            offset={0}
                            angle={-90}
                        >  {normalized ? "Cases per 1000 persons" : "Total cases"} </Text>}/>
                <Tooltip />
              
                <Bar dataKey="totale_casi" name="Total cases" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    </React.Fragment>
    )
}
