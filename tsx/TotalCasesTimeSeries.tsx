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
  showFittedLine: boolean;
  predictedDays: number;
  selectedRegions: Array<String>;
  fields: Array<String>;
  transformation: string
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
  {
    value: 7,
    label: '7'
  },
]
function TotalCasesTimeSeries(props: TotalCasesTimeSeriesProps) {
  const [totalTimeSerie, setTotalTimeSerie] = useState([]);

  useEffect(() => {
    

    fetch('/total_time_serie?' +
      'predictedDays=' + props.predictedDays +
      '&regions=' + props.selectedRegions +
      '&fields=' + props.fields +
      '&transformation=' + props.transformation)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data.data)
        setTotalTimeSerie(data.data)
      });
  }, [props.selectedRegions, props.predictedDays, props.fields, props.transformation])

  const fittedLine = (elem: string, idx: number, name: string) => {
    if (!props.showFittedLine) {
      return null;
    }
    return (<Line isAnimationActive={false}
      type="linear"
      dataKey={elem}
      name={name}
      stroke={colors[idx]}
      key={elem}
      strokeWidth={2}
      dot={false}
      strokeDasharray="5 5" />
    )
  }
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
  const data_min = () => {
    if (props.transformation == 'gr') {
      return 0.5
    } else {
      return 'dataMin'
    }
  }
  const yAxisLabel = () => {
    const labels = {
      'raw': <Label dx={-35} angle={-90}> Total cases </Label> ,
      'gr': <Label dx={-35} angle={-90}>Cases day i / Cases day i-1 </Label>,
      'diff': <Label dx={-35} angle={-90}>Cases day i - Cases day i-1 </Label>,
      'log': <Label dx={-35} angle={-90}> Logarithm of cases </Label>
    }
    return labels[props.transformation];
  }
  return (


    <IsMobileContext.Consumer>
      {isMobile =>
        <ResponsiveContainer width="100%" height={500} >
          <LineChart
            data={totalTimeSerie}
            margin={{ left: 15 }}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" interval={Math.ceil(totalTimeSerie.length / (isMobile ? 2 : 10))} />

            <YAxis domain={[data_min(), 'dataMax']} scale={props.transformation == 'log' ? 'log' : 'linear'} >

               {yAxisLabel()} 

            </YAxis>
            <Tooltip />
            <Legend
              verticalAlign="top" />


            <ReferenceLine x="2020-03-09" label="LockDown" stroke="#EE5555" />

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

                return isFitted ? fittedLine(elem, idx, name) : normalLine(elem, idx, name)
              })}
            {props.transformation == 'gr' ?
              <ReferenceLine
                y={1}
                strokeWidth={2}
                stroke="green" />
              : null}
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
  const fitteableFields = ['totale_attualmente_positivi', 'totale_casi']
  const hasFittedFields = (fitteableFields.filter(field => currentFields.includes(field))).length > 0
  const [showFittedLine, setShowFittedLine] = useState(hasFittedFields);
  const [predictedDays, setPredictedDay] = useState(0)

  const [dataTransformation, setDataTransformation] = useState('raw')
  const showFittedCurves = hasFittedFields && showFittedLine


  const handleFieldsChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCurrentFields(event.target.value as string[]);
  };
  const handlePredictedDaysCommited = (event: any, newValue: number) => {
    setPredictedDay(newValue);
  };

  const handleChangeShowFittedLine = (event: React.ChangeEvent<HTMLInputElement>) => {

    setShowFittedLine(event.target.checked);
    if (!event.target.checked) {
      setPredictedDay(0)
    }
  };
  const handleRegionsChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedRegions(event.target.value as string[])
  };
  const handleDataTransformationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDataTransformation((event.target as HTMLInputElement).value);
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
  const TransformationMethodSelector = () => {
    return (
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Data tranformation</FormLabel>
        <RadioGroup
          aria-label="transformation"
          name="transformation"
          value={dataTransformation}
          defaultValue="raw"
          onChange={handleDataTransformationChange}>
          <FormControlLabel value="raw" control={<Radio />} label="Raw data" />
          <FormControlLabel value="log" control={<Radio />} label="Logarithm" />
          <FormControlLabel value="gr" control={<Radio />} label="Quotient" />
          <FormControlLabel value="diff" control={<Radio />} label="Difference" />

        </RadioGroup>
      </FormControl>
    )
  }

  const ShowFittedLineControl = () => {
    return (
      <FormControl key={0} >
        <FormControlLabel
          control={
            <Checkbox
              disabled={!hasFittedFields}
              checked={showFittedCurves}
              onChange={handleChangeShowFittedLine} />
          }
          label="Show fitted line"
        />
      </FormControl>)
  }
  const FutureDaySelector = () => {
    return (
      <FormControl key={1}>

        <Typography id="discrete-slider" gutterBottom>
          Predicted future days
</Typography>

        <Slider

          marks={marks}
          defaultValue={predictedDays}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={1}
          onChangeCommitted={handlePredictedDaysCommited}

          disabled={!hasFittedFields || !showFittedCurves}
          min={0}
          max={7}
        />

      </FormControl>
    )
  }
  const controls = [
    < RegionSelector key={5} />,
    <FieldSelector key={6} />,
    <ShowFittedLineControl />,
    <FutureDaySelector />,
    <TransformationMethodSelector />
  ]


  return (
    <GraphContainer
      title={props.title}
      controls={controls}
      tabTitles={["Total Cases"]}>
      <TotalCasesTimeSeries
        showFittedLine={showFittedCurves}
        predictedDays={predictedDays}
        selectedRegions={selectedRegions}
        fields={currentFields}
        transformation={dataTransformation}
      />
    </GraphContainer>
  )
}
