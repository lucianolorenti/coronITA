import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Label } from 'recharts';
import { CustomizedAxisTick } from './chart';
import { Typography, FormControlLabel, Checkbox } from '@material-ui/core';
import { useStyles } from './styles'
import GraphContainer from './GraphContainer'

declare var days: Array<any>;
interface TotalCasesHistogramProps {
    title: any
}
export default function TotalCasesHistogram(props: TotalCasesHistogramProps) {
    const [histogramCases, setHistogramCases] = useState([]);
    const [normalized, setNormalized] = useState("");

    const handleChangeNormalized = name => event => {
        if (event.target.checked) {
            setNormalized(name)
        } else {
            setNormalized("")
        }
    };


    useEffect(() => {
        fetch('/cases_hist?normalized=' + normalized)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                setHistogramCases(data)
            });
    }, [normalized])
    const classes = useStyles()
    const controls = [
        <FormControlLabel
            control={
                <Checkbox
                    onChange={handleChangeNormalized('Population Number')}
                    value="checkedB"
                    color="primary"
                />
            }
            label="Normalize by region population"
        />
    ]
    return (<GraphContainer title={props.title} subtitle={"Date "  + days[days.length - 1]} controls={controls} >
        <ResponsiveContainer width="100%" height={500}>
            <BarChart

                data={histogramCases}
                margin={{
                    left: 15,
                    bottom: 75
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="category" interval={0} tick={<CustomizedAxisTick />} dataKey="denominazione_regione" />
                // @ts-ignore
                <YAxis label={

                    <Label 
                    value={normalized != "" ? "Cases per 1000 people" : "Total cases"} 
                    position="left" 
       
                    className={classes.yAxisLabel} />} />
                <Tooltip />

                <Bar dataKey="totale_casi" name="Cases" fill="#8884d8" />
            </BarChart>



        </ResponsiveContainer>
    </GraphContainer>
    );
}

/*
<Typography variant="h6">

</Typography>
*/