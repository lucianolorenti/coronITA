import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CustomizedAxisTick } from './chart';
import { Typography, FormControlLabel, Checkbox } from '@material-ui/core';
import { useStyles } from './styles'

export default function TotalCasesHistogram(props) {
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
        fetch('/cases_hist?normalized='+normalized)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                setHistogramCases(data)
            });
    }, [normalized])
    const classes = useStyles()
    return (
        <React.Fragment>
            <Typography variant="h3" align="center" className={classes.title}>
                Cases per region
            </Typography>
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
            <ResponsiveContainer width="90%" height={500}>
                <BarChart

                    data={histogramCases}
                    margin={{
                        top: 5, right: 30, left: 30, bottom: 100,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="category" interval={0} tick={<CustomizedAxisTick />} dataKey="denominazione_regione" />
                    <YAxis />
                    <Tooltip />

                    <Bar dataKey="totale_casi" name="Cases" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
}