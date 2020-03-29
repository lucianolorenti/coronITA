import { Checkbox, FormControl, FormControlLabel, FormLabel, Input, InputLabel, ListItemText, MenuItem, Radio, RadioGroup, Select, Slider } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { Brush, CartesianGrid, Label, Legend, Line, LineChart, ReferenceLine, ReferenceLiney, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import GraphContainer from './GraphContainer';
import IsMobileContext from './IsMobileContext';
import names from './Names';
import { useStyles } from './styles';
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

interface TotalCasesTimeSeriesProps {
  selectedRegions: Array<String>;
  fields: Array<String>;
}
function TrendPlot(props: TotalCasesTimeSeriesProps) {
  const [totalTimeSerie, setTotalTimeSerie] = useState([]);

  useEffect(() => {

    fetch('/trend?' +
      '&regions=' + props.selectedRegions +
      '&fields=' + props.fields)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        setTotalTimeSerie(data.data)
      });
  }, [props.selectedRegions,  props.fields])



  const normalLine = (elem: string, idx: number, name: string) => {
    return (
      <Line isAnimationActive={false}
        type="linear"
        dataKey={elem}
        name={name}
        stroke={colors[idx]}
        strokeWidth={2}
        key={elem}
        activeDot={{ r: 2 }} />
    )

  }

  return (


    <IsMobileContext.Consumer>
      {isMobile =>
        <ResponsiveContainer width="100%" height={500} >
          <LineChart
            data={totalTimeSerie}
            margin={{ left: 15 }}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" scale={'log'} />

            <YAxis label=' New confirmed cases' scale={'log'} />

            
            <Tooltip />
            <Legend
              verticalAlign="top" />


            <ReferenceLine x="2020-03-09"  stroke="#EE5555">
              <Label position="top" offset={-35}>
              LockDown
              </Label>
              </ReferenceLine>>

            {Object.keys(totalTimeSerie.length > 0 ? totalTimeSerie[1] : {})
              .map((elem, idx: number) => {
                if (elem == 'day') {
                  return null
                }
                const parts = elem.split("@");
                let isFitted = false
                let region = parts[0] + ' '
                if (parts[0].startsWith('fitted')) {
                  isFitted = true
                  region = region.slice(7)
                }
                if (region == 'All ') {
                  region = 'Country '
                }
                let what = (isFitted ? 'Fitted ' : '') + names[parts[1]]

                const name = region + what

                return  normalLine(elem, idx, name)
              })}

            <Brush height={20} dataKey={'day'} />
     
          </LineChart>

        </ResponsiveContainer>}
    </IsMobileContext.Consumer>

  )

}

interface TotalCasesTimesSeriesCompoent {
  title: React.ReactNode
}
export default function TotalCasesTimesSeriesCompoent(props: TotalCasesTimesSeriesCompoent) {
  const classes = useStyles();
  var regionsAll = ['All'].concat(regions)
  const [selectedRegions, setSelectedRegions] = React.useState<string[]>(['All']);
  const [currentFields, setCurrentFields] = useState<string[]>(['totale_attualmente_positivi'])




  const handleFieldsChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCurrentFields(event.target.value as string[]);
  };

  const handleRegionsChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedRegions(event.target.value as string[])
  };



  const FieldSelector = () => {
    const fields = [
      { name: 'Total cases', value: 'totale_casi' },
      { name: 'Tamponi', value: 'tamponi' },
      { name: 'Dead', value: 'deceduti' },
      { name: 'Recovered', value: 'dimessi_guariti' },
      { name: 'Current positive', value: 'totale_attualmente_positivi' },
      { name: 'Hospitalised', value: 'ricoverati_con_sintomi' },
      { name: 'Intensive Care', value: 'terapia_intensiva' },
      { name: 'Total hospitalised', value: 'totale_ospedalizzati' },
      { name: 'Home confinement', value: 'isolamento_domiciliare' }
    ]
    return (<FormControl className={classes.formControl}>
      <InputLabel id="demo-mutiple-name-label">Name</InputLabel>
      <Select
        labelId="demo-mutiple-name-label"
        id="demo-mutiple-name"
        multiple
        value={currentFields}
        onChange={handleFieldsChange}
        input={<Input />}
        MenuProps={MenuProps}
      >
        {fields.map(elem => (
          <MenuItem key={elem.value} value={elem.value}>
            {elem.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>)
  }
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
    < RegionSelector key={5} />,
    <FieldSelector key={6} />,
  ]


  return (
    <GraphContainer
      title={props.title}
      controls={controls}
      tabTitles={["New cases trend"]}>
      <TrendPlot

        selectedRegions={selectedRegions}
        fields={currentFields}

      />
    </GraphContainer>
  )
}
