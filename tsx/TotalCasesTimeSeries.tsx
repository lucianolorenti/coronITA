import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import React, { useEffect, useState } from 'react';
import { InlineMath } from 'react-katex';
import { CartesianGrid, Legend, ResponsiveContainer, Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts';
import { useStyles } from './styles';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';


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

  return (
    <Grid container spacing={1}>
      <Grid item xs={10}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={totalTimeSerie}
            margin={{
              top: 5, right: 15, left: 30, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" tickCount={9} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="linear" dataKey="totale_casi" name="Total cases" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="linear" dataKey="fitted" name="Fitted curve" stroke="#AA84d8" activeDot={{ r: 8 }} />

          </LineChart>

        </ResponsiveContainer>
      </Grid>
      <Grid item xs={2}>
        <Typography variant="h6">
          Fitted curve
        </Typography>
        {expCoeffs !== null ? <InlineMath>
          {`y=${parseFloat(expCoeffs[1]).toFixed(2)} e^{${parseFloat(expCoeffs[0]).toFixed(2)}x}`}
        </InlineMath> : null}
      </Grid>
    </Grid>
  )
    
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

  return (<ResponsiveContainer width="100%" height={400}>
    <LineChart

      data={growthRateSerie}
      margin={{
        top: 5, right: 30, left: 30, bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="day" tickCount={9} />
      <YAxis />
      <ReferenceLine y={1} stroke="green" />
      <Tooltip />
      <Legend />
      <Line type="linear" dataKey="gr" name="Growth rate" stroke="#8884d8" activeDot={{ r: 8 }} />

    </LineChart>
  </ResponsiveContainer>)
}
export default function TotalCasesTimesSeriesTab() {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = React.useState(0);
  const handleCurrentTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };



  return (<React.Fragment>
    <Tabs value={currentTab} onChange={handleCurrentTabChange} aria-label="wrapped label tabs example">
      <Tab label="Total cases" {...a11yProps(0)} />
      <Tab label="Growth Rate" {...a11yProps(1)} />
    </Tabs>
    <TabPanel value={currentTab} index={0}>
      <TotalCasesTimeSeries />
    </TabPanel>
    <TabPanel value={currentTab} index={1}>
      <GrowthRateSeries />
    </TabPanel>
  </React.Fragment>
  )
}