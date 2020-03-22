import { AppBar, Checkbox, Toolbar, Chip, createStyles, FormControl, FormControlLabel, Grid, Input, InputLabel, ListItemText, makeStyles, MenuItem, Select, Slider, Theme } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import MathJax from 'react-mathjax';
import { Brush, CartesianGrid, Label, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Text, Tooltip, XAxis, YAxis } from 'recharts';
import { useStyles } from './styles';
import GraphContainer from './GraphContainer'
import IsMobileContext from './IsMobileContext';

declare var regions: any;
const colors = [
  '#ff0000', '#733f1d', '#ffaa00', '#234010', '#60bfac', '#3385cc', '#5a5673',
  '#d580ff', '#ff408c', '#330000', '#ffb380', '#736039', '#44ff00', '#264d45',
  '#accbe6', '#3600cc', '#392040', '#b38698', '#594343', '#bfa38f', '#b2982d',
  '#497339', '#00eeff', '#335ccc', '#bbace6', '#cc00a3', '#ff0044', '#ff9180', '#a65800',
  '#e2e6ac', '#00a62c', '#005c73', '#000f73', '#aa00ff', '#73004d', '#73000f', '#b2502d',
  '#33210d', '#ccff00', '#00ffaa', '#00294d', '#000033', '#602080', '#a60042']

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};




const renderColorfulLegendText = (coeffs: Array<number>, showFittedLine: Boolean) => (value, entry) => {
  const { color } = entry;
  if (coeffs == null) {
    return null
  }
  var [L, k, x0, b] = coeffs.map((elem) => elem.toFixed(2))
  if ((showFittedLine) && (entry['value'] == 'Fitted curve')) {
    return ( <span>{value}</span>)
  } else {
    return <span>{value}</span>;
  }
            /*<MathJax.Provider>
          <span style={{ fontSize: "12px", marginLeft: "1em" }}>
            <MathJax.Node inline formula={`y=${b} + \\dfrac{${L}}{1 + e^{-${k}(x-${x0})}}`} />
          </span>
        </MathJax.Provider>*/

}
interface SeriesProps {
  selectedRegions: Array<String>
}
interface TotalCasesTimeSeriesProps {
  showFittedLine: boolean;
  predictedDays: number;
  selectedRegions: Array<String>;
}
const marks = [
  {
    value: 0,
    label: '0'
  },
  {
    value: 3,
    label: '3'
  },
]
function TotalCasesTimeSeries(props: TotalCasesTimeSeriesProps) {
  const [totalTimeSerie, setTotalTimeSerie] = useState([]);
  const [expCoeffs, setExpCoeffs] = useState(null);




  useEffect(() => {

    fetch('/total_time_serie?predictedDays=' + props.predictedDays + '&regions=' + props.selectedRegions)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        setTotalTimeSerie(data.data)
        if ('coeffs' in data) {
          setExpCoeffs(data.coeffs)
        }
      });
  }, [props.selectedRegions, props.predictedDays])
  const not_regions_fields = ["day", "totale_casi", "fitted", "fitted_2", "fitted_7"]
  const showFittedCurves = props.selectedRegions.includes('All') && props.showFittedLine

  return (


    <IsMobileContext.Consumer>
      {isMobile =>
        <ResponsiveContainer width="100%" height={500} >
          <LineChart
            data={totalTimeSerie}

          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" interval={Math.ceil(totalTimeSerie.length / (isMobile ? 2 : 10))} />

            <YAxis domain={[0, (v) => v.toFixed(0)]} width={105} >

              <Label dx={-35} angle={-90}> Total cases</Label>

            </YAxis>
            <Tooltip />
            <Legend
              verticalAlign="top"

              formatter={renderColorfulLegendText(expCoeffs, showFittedCurves)} />

            {props.selectedRegions.includes('All') ?
              <Line isAnimationActive={false} type="linear"
                dataKey="totale_casi"
                name="Total cases"
                strokeWidth={2}
                stroke="#4668ff" activeDot={{ r: 2 }} /> : null}
            {showFittedCurves ?
              <Line isAnimationActive={false}
                type="linear"
                dataKey="fitted"
                name="Fitted curve"
                stroke="#449944"
                strokeWidth={2}
                dot={false}
                strokeDasharray="5 5" /> : null}
            {showFittedCurves ? <Line isAnimationActive={false}
              type="linear"
              dataKey="fitted_2"
              name="Fitted curve two days ago"
              stroke="#99BB99"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5" /> : null}
            {showFittedCurves ? <Line isAnimationActive={false}
              type="linear"
              dataKey="fitted_7"
              name="Fitted curve five days ago"
              stroke="#999999"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5" /> : null}
            : null}
          <ReferenceLine x="2020-03-09" label="LockDown" stroke="#EE5555" />

            {Object.keys(totalTimeSerie.length > 0 ? totalTimeSerie[1] : {})
              .filter(name => !not_regions_fields.includes(name))
              .map((elem, idx: number) => {
                return (
                  <Line isAnimationActive={false}
                    type="linear"
                    dataKey={elem}
                    name={elem.slice(12)}
                    stroke={colors[idx]}
                    strokeWidth={2}
                    key={elem}
                    activeDot={{ r: 2 }} />
                )
              })}
            <Brush height={20} dataKey={'day'} />
          </LineChart>

        </ResponsiveContainer>}
    </IsMobileContext.Consumer>

  )

}

function GrowthRateSeries(props: SeriesProps) {
  const [growthRateSerie, setGrowthRateSerie] = useState([]);


  useEffect(() => {

    fetch('/growth_rate?regions=' + props.selectedRegions)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        setGrowthRateSerie(data)
      });
  }, [props.selectedRegions])
  const not_regions_fields = ["day", "gr"]
  return (

    <ResponsiveContainer width="100%" height={500} key="growth_rate">
      <LineChart
        data={growthRateSerie}

      >
        <CartesianGrid strokeDasharray="3 3" />
        <IsMobileContext.Consumer>
          {isMobile => <XAxis dataKey="day" interval={Math.ceil(growthRateSerie.length / (isMobile ? 2 : 15))} />}
        </IsMobileContext.Consumer>


        <YAxis
          width={105}
          label={<Text
            x={0}
            y={0}
            dx={20}
            dy={300}
            offset={0}
            angle={-90}
          >  Total cases day i / Total cases day i -1 </Text>} />






        <ReferenceLine y={1} stroke="green" />
        <Tooltip />
        {Object.keys(growthRateSerie.length > 0 ? growthRateSerie[1] : {})
          .filter(name => !not_regions_fields.includes(name))
          .map((elem, idx: number) => {
            return (
              <Line isAnimationActive={false}
                type="linear"
                dataKey={elem}
                name={elem.slice(3)}
                stroke={colors[idx]}
                strokeWidth={2}
                key={elem}
                activeDot={{ r: 2 }} />
            )
          })}
        <Legend />
        {props.selectedRegions.includes('All') ? <Line isAnimationActive={false}
          type="linear"
          dataKey="gr"
          name="Growth rate"
          stroke="#8884d8"
          activeDot={{ r: 8 }} /> : null}
        <ReferenceLine x="2020-03-09" label="LockDown" stroke="#EE5555" />

      </LineChart>
    </ResponsiveContainer>

  )
}

interface TotalCasesTimesSeriesCompoent {
  title: React.ReactNode
}
export default function TotalCasesTimesSeriesCompoent(props: TotalCasesTimesSeriesCompoent) {
  const classes = useStyles();
  var regionsAll = ['All'].concat(regions)
  const [selectedRegions, setSelectedRegions] = React.useState<string[]>(['All']);
  const [showFittedLine, setShowFittedLine] = useState(selectedRegions.includes('All'));
  const [predictedDays, setPredictedDay] = useState(0)
  const [currentTab, setCurrentTab] = useState(0)
  const handleDateChange = (event: any, newValue: number) => {
    setPredictedDay(newValue);
  };
  const handleChangeShowFittedLine = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowFittedLine(event.target.checked);
  };
  const handleRegionsChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedRegions(event.target.value as string[])
  };
  const showFittedCurves = selectedRegions.includes('All') && showFittedLine
  const RegionSelector = () => {
    return (
      <FormControl className={classes.formControl}>

        <InputLabel >Regions</InputLabel>
        <Select

          multiple
          value={selectedRegions}
          onChange={handleRegionsChange}
          input={<Input />}
          renderValue={selected => (selected as string[]).join(', ')}
          MenuProps={MenuProps}
        >
          {regionsAll.map(name => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={selectedRegions.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )

  }

  const controls = [
    < RegionSelector key={5} />
  ]
  if (currentTab == 0) {
    controls.push(<FormControl key={0}>
      <FormControlLabel
        control={
          <Checkbox disabled={!selectedRegions.includes('All')} checked={showFittedCurves} onChange={handleChangeShowFittedLine} />
        }
        label="Show fitted line"
      />
    </FormControl>)
    controls.push(<FormControl key={1}>

      <Typography id="discrete-slider" gutterBottom>
        Predicted future days
    </Typography>

      <Slider key={2}
        marks={marks}
        defaultValue={0}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={1}
        onChangeCommitted={handleDateChange}
        disabled={!selectedRegions.includes('All') || !showFittedCurves}
        min={0}
        max={3}
      />

    </FormControl>)
  }

  return (
    <GraphContainer
      setCurrentTab={setCurrentTab}
      currentTab={currentTab}
      title={props.title}
      controls={controls}
      tabTitles={["Total Cases", "Growth Rate"]}>
      <TotalCasesTimeSeries
        showFittedLine={showFittedCurves}
        predictedDays={predictedDays}
        selectedRegions={selectedRegions} />
      <GrowthRateSeries
        selectedRegions={selectedRegions} />
    </GraphContainer>
  )
}
