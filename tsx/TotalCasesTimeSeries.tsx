import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import React, { useEffect, useState } from 'react';
import { InlineMath } from 'react-katex';
import { CartesianGrid, Legend, ResponsiveContainer, Line,Brush, LineChart, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts';
import { useStyles } from './styles';
import { Grid, FormControlLabel, Checkbox } from '@material-ui/core';
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
      {value === index && children}
    </Typography>
  );
}
const renderColorfulLegendText = (coeffs) => (value, entry) => {
  const { color } = entry;
  if (coeffs == null) {
    return null
  }
  if (entry['value'] == 'Fitted curve') {
    return (
      <React.Fragment>
        <span>{value}</span>
        <span style={{ fontSize: "12px", marginLeft: "1em" }}>
          <InlineMath >
            {`y=${parseFloat(coeffs[1]).toFixed(3)} ({${parseFloat(coeffs[0]).toFixed(3)}}^x)`}
          </InlineMath>
        </span>

      </React.Fragment>)
  } else {
    return <span>{value}</span>;
  }

}

function TotalCasesTimeSeries() {
  const [totalTimeSerie, setTotalTimeSerie] = useState(null);
  const [expCoeffs, setExpCoeffs] = useState(null);
  const [showFittedLine, setShowFittedLine] = useState(true);
  const handleChangeShowFittedLine = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowFittedLine(event.target.checked);
  };

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
    <React.Fragment>
      <FormControlLabel
        control={
          <Checkbox checked={showFittedLine} onChange={handleChangeShowFittedLine} />
        }
        label="Show fitted line"
      />

      <ResponsiveContainer width="100%" height={400} >
        <LineChart

          data={totalTimeSerie}
          margin={{
            top: 5, right: 15, left: 30, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" tickCount={9} />
          <YAxis domain={[0, 'dataMax']} />
          <Tooltip />
          <Legend formatter={renderColorfulLegendText(expCoeffs)} />
          <Line isAnimationActive={false} type="linear"
            dataKey="totale_casi"
            name="Total cases"
            strokeWidth={2}
            stroke="#4668ff" activeDot={{ r: 2 }} />
          {showFittedLine ?
            <Line isAnimationActive={false}
              type="linear"
              dataKey="fitted"
              name="Fitted curve"
              stroke="#449944"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5" /> : null}
          {showFittedLine ? <Line isAnimationActive={false}
            type="linear"
            dataKey="fitted_2"
            name="Fitted curve two days ago"
            stroke="#99BB99"
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 5" /> : null}
          {showFittedLine ? <Line isAnimationActive={false}
            type="linear"
            dataKey="fitted_7"
            name="Fitted curve one week ago"
            stroke="#999999"
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 5" /> : null}
          : null}
          <ReferenceLine x="2020-03-09" label="LockDown" stroke="#EE5555" />
          <Brush height={20} dataKey={'day'}/>
        </LineChart>

      </ResponsiveContainer>

    </React.Fragment>
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

  return (

    <ResponsiveContainer width="100%" height={400}>
      <LineChart

        data={growthRateSerie}
        margin={{
          top: 5, right: 0, left: 0, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" tickCount={9} />
        <YAxis />
        <ReferenceLine y={1} stroke="green" />
        <Tooltip />
        <Legend />
        <Line isAnimationActive={false}
          type="linear"
          dataKey="gr"
          name="Growth rate"
          stroke="#8884d8"
          activeDot={{ r: 8 }} />
        <ReferenceLine x="2020-03-09" label="LockDown" stroke="#EE5555" />
      </LineChart>
    </ResponsiveContainer>

  )


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