import { TextField, FormControlLabel, Checkbox } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useEffect, useState } from 'react';
import { InlineMath } from 'react-katex';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CustomizedAxisTick } from './chart';
import { useStyles } from './styles';
declare var regions: any;

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

function TotalCasesTimeSeries() {
    const [totalTimeSerie, setTotalTimeSerie] = useState(null);
    const [expCoeffs, setExpCoeffs] = useState(null);
    useEffect(() => {

        fetch('/total_time_serie')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                setTotalTimeSerie(data.data)
                setExpCoeffs(data.coeffs)
            });
    }, [])

    return (<React.Fragment>
        <LineChart
            width={800}
            height={300}
            data={totalTimeSerie}
            margin={{
                top: 5, right: 30, left: 20, bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" tickCount={9} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="linear" dataKey="totale_casi" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="linear" dataKey="fitted" stroke="#AA84d8" activeDot={{ r: 8 }} />

        </LineChart>


        {expCoeffs !== null ? <InlineMath>
            {`y=${parseFloat(expCoeffs[1]).toFixed(2)} e^{${parseFloat(expCoeffs[0]).toFixed(2)}x}`}
        </InlineMath> : null}
    </React.Fragment>)
}

function GrowthRateSeries() {
    const [growthRateSerie, setGrowthRateSerie] = useState(null);

    useEffect(() => {

        fetch('/growth_rate')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                setGrowthRateSerie(data)
            });
    }, [])

    return (<React.Fragment>
        <LineChart
            width={800}
            height={300}
            data={growthRateSerie}
            margin={{
                top: 5, right: 30, left: 20, bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" tickCount={9} />
            <YAxis />
            <ReferenceLine y={1} stroke="green" />
            <Tooltip />
            <Legend />
            <Line type="linear" dataKey="gr" stroke="#8884d8" activeDot={{ r: 8 }} />

        </LineChart>
    </React.Fragment>)
}
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
        <Typography variant="h3" className={classes.title} align="center">
            Cases per province
    </Typography>
        <Autocomplete
            id="combo-box-demo"
            options={regions}
            onChange={handleCurrentRegionChange}
            getOptionLabel={function (option: string) { return option }}
            style={{ width: 300 }}
            value={currentRegion}
            renderInput={params => <TextField {...params} label="Region" variant="outlined" />}
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
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
                data={regionTimeSerie}
                margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="category" interval={0} tick={<CustomizedAxisTick />} dataKey="denominazione_provincia" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totale_casi" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    </React.Fragment>
    )
}
