
import { Checkbox, Chip, FormControlLabel, FormLabel, Input, InputLabel, ListItemText, MenuItem, RadioGroup, Select, FormHelperText, Radio, Divider, Grid, Typography } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
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
export default function StackedRegions() {
    const theme = useTheme();

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
    const handleChangeNormalize = (event, newValue) => {
        setNormalize(newValue)
    }
    const handleRegionsChange = (event: React.ChangeEvent<{ value: unknown }>) => {        
        setSelectedRegions(event.target.value as string[])
    };
    const handleWhatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWhat((event.target as HTMLInputElement).value)
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
    return (
        <React.Fragment>
            <FormControl className={stylesSelect.formControl}>
                <InputLabel id="demo-mutiple-chip-label">Chip</InputLabel>
                <Select
                    labelId="demo-mutiple-chip-label"
                    id="demo-mutiple-chip"
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
                    {regions.map(name => (
                        <MenuItem key={name} value={name}>
                            <Checkbox checked={selectedRegions.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl> <br />
            <FormControl className={stylesSelect.formControl}>
                <FormControlLabel
                    control={
                        <Checkbox checked={normalize} onChange={handleChangeNormalize} />
                    }
                    label="Normalize"
                />
            </FormControl>
            <FormControl component="fieldset" className={stylesSelect.formControl}>
                <FormLabel component="legend">What to visualize</FormLabel>
                <RadioGroup row aria-label="what" name="what" value={what} onChange={handleWhatChange}>

                    {
                        Object.keys(options).sort().map((key, idx) => {
                            return (

                                <FormControlLabel
                                    style={{ paddingRight: "2em" }}
                                    key={key}
                                    value={key}
                                    control={<Radio color="primary" />}
                                    label={options[key]}
                                    labelPlacement="end"
                                />
                            )

                        })
                    }


                </RadioGroup>
            </FormControl>
            <Typography variant="h5" color="inherit" style={{textAlign: "center"}}>
                {options[what]}
                </Typography>
            <ResponsiveContainer width="100%" height={400}>
                <AreaChart
                    width={500}
                    height={400}
                    data={data}
                    stackOffset={normalize ? "expand" : "none"}
                    margin={{
                        top: 10, right: 0, left: 0, bottom: 0,
                    }}
                >
                    <ReferenceLine x="2020-03-09" label="LockDown" stroke="#EE5555" />
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />

                    {selectedRegions.map((elem) => {
                        return <Area type="monotone"
                            key={elem}
                            name={elem}
                            dataKey={elem} stackId="1" stroke={colors[regions.indexOf(elem)]} fill={colors[regions.indexOf(elem)]} />
                    })}


                    <Legend />
                    
                </AreaChart>
            </ResponsiveContainer>
        </React.Fragment>)
}