import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Text } from 'recharts';
import { CustomizedAxisTick } from './chart';
import { Typography, FormControlLabel, Checkbox } from '@material-ui/core';
import { useStyles } from './styles'
declare var days: Array<any>;
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
        fetch('/cases_hist?normalized=' + normalized)
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
            <Typography variant="h6">
                Date {days[days.length - 1]}
            </Typography>
            <ResponsiveContainer width="100%" height={500}>
                <BarChart

                    data={histogramCases}
                    margin={{
                        top: 5, right: 0, left: 0, bottom: 100,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="category" interval={0} tick={<CustomizedAxisTick />} dataKey="denominazione_regione" />
                    <YAxis
                        width={105}
                        label={<Text
                            x={0}
                            y={0}
                            dx={20}
                            dy={300}
                            offset={0}
                            angle={-90}
                        >  Total cases </Text>} />
                    <Tooltip />

                    <Bar dataKey="totale_casi" name="Cases" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
}
