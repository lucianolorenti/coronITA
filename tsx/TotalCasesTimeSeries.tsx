import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import React, { useEffect, useState } from 'react';
import { InlineMath } from 'react-katex';
import { CartesianGrid, Legend, ResponsiveContainer, Line, Brush, LineChart, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts';
import { useStyles } from './styles';
import { Grid, FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem, ListItemText, Chip, Input, makeStyles, Theme, createStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

declare var regions: any;
const colors = [
  '#ff0000', '#733f1d', '#ffaa00', '#234010', '#60bfac', '#3385cc', '#5a5673',
  '#d580ff', '#ff408c', '#330000', '#ffb380', '#736039', '#44ff00', '#264d45',
  '#accbe6', '#3600cc', '#392040', '#b38698', '#594343', '#bfa38f', '#b2982d',
  '#497339', '#00eeff', '#335ccc', '#bbace6', '#cc00a3', '#ff0044', '#ff9180', '#a65800',
  '#e2e6ac', '#00a62c', '#005c73', '#000f73', '#aa00ff', '#73004d', '#73000f', '#b2502d',
  '#33210d', '#ccff00', '#00ffaa', '#00294d', '#000033', '#602080', '#a60042']
const useStylesSelect = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),

    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
  }),
);

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
const renderColorfulLegendText = (coeffs:Array<any>, showFittedLine:Boolean) => (value, entry) => {
  const { color } = entry;
  if (coeffs == null) {
    return null
  }
  if ((showFittedLine) && (entry['value'] == 'Fitted curve')) {
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

interface SeriesProps {
  selectedRegions: Array<String>
}

function TotalCasesTimeSeries(props: SeriesProps) {
  const [totalTimeSerie, setTotalTimeSerie] = useState([]);
  const [expCoeffs, setExpCoeffs] = useState(null);
  const [showFittedLine, setShowFittedLine] = useState(props.selectedRegions.includes('All'));


  const handleChangeShowFittedLine = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowFittedLine(event.target.checked);
  };

  useEffect(() => {

    fetch('/total_time_serie?regions=' + props.selectedRegions)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        setTotalTimeSerie(data.data)
        if ('coeffs' in data) {
          setExpCoeffs(data.coeffs)
        }
      });
  }, [props.selectedRegions])
  const not_regions_fields = ["day", "totale_casi", "fitted", "fitted_2", "fitted_7"]
  const showFittedCurves = props.selectedRegions.includes('All') && showFittedLine
  return (
    <React.Fragment>

      <FormControlLabel
        control={
          <Checkbox disabled={!props.selectedRegions.includes('All')} checked={showFittedCurves} onChange={handleChangeShowFittedLine} />
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
          <Legend formatter={renderColorfulLegendText(expCoeffs, showFittedCurves)} />
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
            name="Fitted curve one week ago"
            stroke="#999999"
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 5" /> : null}
          : null}
          <ReferenceLine x="2020-03-09" label="LockDown" stroke="#EE5555" />
          <Brush height={20} dataKey={'day'} />
          {Object.keys(totalTimeSerie.length > 0?totalTimeSerie[1] : {})
                 .filter(name => !not_regions_fields.includes(name)  )
                 .map((elem, idx:number)=> {
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
        </LineChart>

      </ResponsiveContainer>

    </React.Fragment>
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
        console.log(data)
        setGrowthRateSerie(data)
      });
  }, [props.selectedRegions])
  const not_regions_fields = ["day", "gr"]
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
        {Object.keys(growthRateSerie.length > 0?growthRateSerie[1] : {})
                 .filter(name => !not_regions_fields.includes(name)  )
                 .map((elem, idx:number)=> {
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
        {props.selectedRegions.includes('All') ?<Line isAnimationActive={false}
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
export default function TotalCasesTimesSeriesTab() {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = React.useState(0);
  const handleCurrentTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  var regionsAll = ['All'].concat(regions)
  const [selectedRegions, setSelectedRegions] = React.useState<string[]>(['All']);
  const handleRegionsChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    console.log(event.target.value as string[])
    setSelectedRegions(event.target.value as string[])
  };
  const stylesSelect = useStylesSelect()
  return (
    <React.Fragment>
      <FormControl className={stylesSelect.formControl}>
        <InputLabel >Regions</InputLabel>
        <Select

          multiple
          value={selectedRegions}
          onChange={handleRegionsChange}
          input={<Input id="select-multiple-chip" />}
          renderValue={selected => (
            <div className={stylesSelect.chips}>
              {(selected as string[]).map(value => (
                <Chip key={value} label={value} className={stylesSelect.chip} />
              ))}
            </div>
          )}
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
      <Tabs value={currentTab} onChange={handleCurrentTabChange} aria-label="wrapped label tabs example">
        <Tab label="Total cases" {...a11yProps(0)} />
        <Tab label="Growth Rate" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={currentTab} index={0}>
        <TotalCasesTimeSeries selectedRegions={selectedRegions} />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <GrowthRateSeries selectedRegions={selectedRegions} />
      </TabPanel>
    </React.Fragment>
  )
}