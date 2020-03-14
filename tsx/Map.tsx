
import { makeStyles, Tabs, Tab, Typography, Box } from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import L from 'leaflet';
import MarkerCluster from 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import React, { useState } from 'react';
import { GeoJSON } from 'react-leaflet';
import 'react-leaflet-markercluster/dist/styles.min.css';
import "./mapicon.css";
import  ItalyMap  from './ItalyMap';
import { Chroropleth } from './Chroropleth';

declare function require(name: string);
declare var days: Array<any>;
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: "static" + require('leaflet/dist/images/marker-icon-2x.png').default,
    iconUrl: "static" + require('leaflet/dist/images/marker-icon.png').default,
    shadowUrl: "static" + require('leaflet/dist/images/marker-shadow.png').default,
    className: ""
});
var day_list = days.map((elem, index) => { return { 'value': index, 'label': elem } })



export const mapStyles = makeStyles(theme => ({
    map: {
        height: "400px"
    },
    icon: {
        backgroundColor: "#EEAA22"
    }
}))
export function iconCreateFunction(cluster: MarkerCluster) {
    const markers = cluster.getAllChildMarkers()
    const total_cases = markers.reduce((total: number, value: any) => {
        const cases = value.options.options.cases
        return total + cases;
    }, 0)
    const size = Math.log(total_cases) * 10
    return L.divIcon({
        html: '<div class="circle">' + total_cases + '</div>',
        className: "icon",
        iconSize: L.point(size, size, true),
    });

}



interface Props {
    children: React.ReactElement;
    open: boolean;
    value: number;
}
const sliderLabel = (i: number) => {
    return day_list[i].label
}


function ValueLabelComponent(props: Props) {
    const { children, open, value } = props;

    return (
        <Tooltip open={open} enterTouchDelay={0} placement="bottom" title={sliderLabel(value)}>
            {children}
        </Tooltip>
    );
}

export function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
export interface MapProps {
    currentDate: String
}

function a11yProps(index: any) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
  }
function TabPanel(props: TabPanelProps) {
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
const MapTab = (props) => {
    const [value, setValue] = React.useState(0);
    const nMarks = props.isMobile ? Math.round(day_list.length / 3) : Math.round(day_list.length / 9)
    console.log(nMarks)
    const marks = day_list.map((elem, idx) => { return { 
        'value': elem.value, 
        'label': ((idx%nMarks)==1? elem.label : "") } })
    console.log(marks.length)
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };
    const [currentDate, setCurrentDate] = useState(day_list[day_list.length - 1].label)

    const handleDateChange = (event: any, newValue: number) => {
        setCurrentDate(sliderLabel(newValue));
    };
    return (
        <React.Fragment>
            
            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                <Tab label="Infected cases" {...a11yProps(0)} />
                <Tab label="Choropleth" {...a11yProps(1)} />                
            </Tabs>
            <Typography variant="h6">
            Selected date {currentDate}
                </Typography>
            <TabPanel value={value} index={0}>
                <ItalyMap currentDate={currentDate }/>
 </TabPanel>
            <TabPanel value={value} index={1}>
                <Chroropleth  currentDate={currentDate }/>
 </TabPanel>
 <Typography id="discrete-slider" gutterBottom>
        Select the date
      </Typography>
 <Slider min={0}
                onChangeCommitted={handleDateChange}
                track={false}
                ValueLabelComponent={ValueLabelComponent}
                defaultValue={day_list.length - 1}
                max={day_list.length - 1}
                step={0}
                marks={marks} />
        </React.Fragment>
    )
}
export default MapTab;
