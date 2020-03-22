
import { Checkbox, Chip, FormControlLabel, FormLabel, Input, InputLabel, ListItemText, MenuItem, RadioGroup, Select, FormHelperText, Radio, Divider, Grid, Typography, Switch } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { Area, Text, Brush, AreaChart, LineChart, Line, CartesianGrid, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import GraphContainer from './GraphContainer';
declare var regions: any;

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

export const toolTipStyles = makeStyles(theme => ({
    tooltip: {
        margin: "0px",
        padding: "10px",
        backgroundColor: "rgb(255, 255, 255)",
        border: "1px solid rgb(204, 204, 204)",
        whiteSpace: "nowrap"
    }
}))

const CustomTooltip = ({ active, payload, label }) => {
    const classes = toolTipStyles()
    if (active) {
        return (
            <div className={classes.tooltip}>
                <p className="">{`${label}`} </p>
                <p>
                    <span className="label">Dead : </span>
                    <span className="intro">{`${payload[0].payload.deceduti}`}</span>
                </p>
                <p>
                    <span className="label">Cases : </span>
                    <span className="intro">{`${payload[0].payload.totale_casi}`}</span>
                </p>
                <p>
                    <span className="label">Cases : </span>
                    <span className="intro">{`${payload[0].payload.percentage}`} %</span>
                </p>

            </div>
        );
    }

    return null;
};
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
function getStyles(name: string, personName: string[], theme: Theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}
const options = {
    'ricoverati_con_sintomi': 'Hospitalized',
    'terapia_intensiva': 'Intensive therapy',
    'totale_ospedalizzati': 'Total hospitalized',
    'isolamento_domiciliare': 'Home isolation',
    'totale_attualmente_positivi': 'Total currently positive',
    'dimessi_guariti': 'Discharged healed',
    'deceduti': 'Died',
    'totale_casi': 'Total cases',
    'tamponi': 'Tamponi'
}
interface StackedRegionsProps {
    title: React.ReactNode
}
export default function StackedRegions(props: StackedRegionsProps) {

    const [useAreas, setUseAreas] = useState(true)
    const [data, setData] = useState(null);

    const [normalize, setNormalize] = useState(false);
    const [what, setWhat] = useState('totale_casi');

    const [selectedRegions, setSelectedRegions] = React.useState<string[]>(['Lombardia', 'Veneto']);
    const fetchData = (regions: string[]) => {
        fetch('/stacked_area_regions?regions=' + regions + "&what=" + what)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                setData(data)
            });
    }
    const handleuseAreaChange = (event) => {
        setUseAreas(event.target.checked)
    }
    const handleChangeNormalize = (event, newValue) => {
        setNormalize(newValue)
    }
    const handleRegionsChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedRegions(event.target.value as string[])
    };
    const handleWhatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWhat((event.target as HTMLInputElement).value)
    }
    const RegionSelector = () => {
        return (
            <FormControl className={stylesSelect.formControl}>
                <InputLabel id="demo-mutiple-chip-label">Region</InputLabel>
                <Select

                    multiple
                    value={selectedRegions}
                    onChange={handleRegionsChange}
                    input={<Input />}
                    renderValue={selected => (selected as string[]).join(', ')}
                    MenuProps={MenuProps}
                >
                    {regions.map(name => (
                        <MenuItem key={name} value={name}>
                            <Checkbox checked={selectedRegions.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        )
    }
    const AreaLinesSwitcher = () => {
        return (
            <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item>Curves</Grid>
                <Grid item>
                    <Switch
                        checked={useAreas}
                        onChange={handleuseAreaChange}
                    />
                </Grid>
                <Grid item>Areas</Grid>
            </Grid>
        )
    }
    const AreaNormalizer = () => {
        return (<FormControl className={stylesSelect.formControl}>
            <FormControlLabel
                control={
                    <Checkbox checked={normalize} onChange={handleChangeNormalize} />
                }
                label="Normalize"
            />
        </FormControl>)
    }
    const TrendsAreaChart = () => {
        return (<AreaChart
            data={data}
            stackOffset={normalize ? "expand" : "none"}
            margin={{
                top: 10, right: 0, left: 0, bottom: 0,
            }}
        >
            <ReferenceLine x="2020-03-09" label="LockDown" stroke="#EE5555" />
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis
                width={105}
                label={<Text
                    x={0}
                    y={0}
                    dx={20}
                    dy={180}
                    offset={0}
                    angle={-90}
                > {normalize ? "Proportion per day" : "Total cases"} </Text>} />
            <Tooltip />

            {selectedRegions.map((elem) => {
                return <Area type="monotone"
                    key={elem}
                    name={elem}
                    dataKey={elem} stackId="1" stroke={colors[regions.indexOf(elem)]} fill={colors[regions.indexOf(elem)]} />
            })}


            <Legend />
            <Brush height={20} dataKey={'day'} />
        </AreaChart>)
    }
    const TrendsLineChart = () => {

        return (<LineChart
            data={data}
            margin={{
                top: 10, right: 0, left: 0, bottom: 0,
            }}
        >
            <ReferenceLine x="2020-03-09" label="LockDown" stroke="#EE5555" />
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis
                width={105}
                label={<Text
                    x={0}
                    y={0}
                    dx={20}
                    dy={150}
                    offset={0}
                    angle={-90}
                >  Total cases </Text>} />
            <Tooltip />

            {selectedRegions.map((elem) => {
                return <Line type="monotone"
                    key={elem}
                    name={elem}
                    dataKey={elem} stroke={colors[regions.indexOf(elem)]} fill={colors[regions.indexOf(elem)]} />
            })}


            <Legend />
            <Brush height={20} dataKey={'day'} />
        </LineChart>)

    }
    const WhatToVisualizeChooser = () => {
        return (
            <FormControl >
                <Select value={what} onChange={handleWhatChange} displayEmpty >
                    <MenuItem value="" disabled>
                        What to visualize
    </MenuItem>
                    {
                        Object.keys(options).sort().map((key, idx) => {
                            return (
                                <MenuItem
                                    key={key}
                                    value={key}>
                                    {options[key]}
                                </MenuItem>
                            )

                        })
                    }
                </Select>
                <FormHelperText>What to visualize</FormHelperText>
            </FormControl>)
    }
    useEffect(() => {
        fetchData(selectedRegions)
    }, [selectedRegions, what])
    const colors = [
        '#ff0000', '#733f1d', '#ffaa00', '#234010', '#60bfac', '#3385cc', '#5a5673',
        '#d580ff', '#ff408c', '#330000', '#ffb380', '#736039', '#44ff00', '#264d45',
        '#accbe6', '#3600cc', '#392040', '#b38698', '#594343', '#bfa38f', '#b2982d',
        '#497339', '#00eeff', '#335ccc', '#bbace6', '#cc00a3', '#ff0044', '#ff9180', '#a65800',
        '#e2e6ac', '#00a62c', '#005c73', '#000f73', '#aa00ff', '#73004d', '#73000f', '#b2502d',
        '#33210d', '#ccff00', '#00ffaa', '#00294d', '#000033', '#602080', '#a60042']
    const stylesSelect = useStylesSelect()
    const controls = [
        RegionSelector(),
        WhatToVisualizeChooser(),
        AreaLinesSwitcher()]
    if (useAreas) {
        controls.push(AreaNormalizer())
    }
    return (
        <GraphContainer

            title={props.title}
            controls={controls}
            tabTitles={["Total Cases", "Growth Rate"]}>
            <ResponsiveContainer width="100%" height={400}>
                {useAreas ? TrendsAreaChart() : TrendsLineChart()}
            </ResponsiveContainer>
        </GraphContainer>
    )

}