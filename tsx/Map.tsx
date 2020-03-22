
import { makeStyles, Tabs, Tab, Typography, Box, Grid } from '@material-ui/core';
import Slider, { ValueLabelProps } from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import L from 'leaflet';
import MarkerCluster from 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import React, { useState, FunctionComponent } from 'react';
import { GeoJSON } from 'react-leaflet';
import 'react-leaflet-markercluster/dist/styles.min.css';
import "./mapicon.css";
import ItalyMap from './ItalyMap';
import { Chroropleth } from './Chroropleth';
import GraphContainer from './GraphContainer';

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




const sliderLabel = (i: number) => {
    return day_list[i].label
}


 const ToolTip: FunctionComponent<ValueLabelProps>  = (props:ValueLabelProps) =>  {
    var label = ''
    if (isNaN(props.value)) {
        label = ''
    } else {
        label = sliderLabel(props.value)
    }
    return (
        <Tooltip open={props.open} enterTouchDelay={0} placement="bottom" title={label}>
            {props.children}
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
    var timeout;
    const [currentTab, setCurrentTab] = useState(0)
    const nMarks = props.isMobile ? Math.round(day_list.length / 3) : Math.round(day_list.length / 9)
    const marks = day_list.map((elem, idx) => {
        return {
            'value': elem.value,
            'label': ((idx % nMarks) == 1 ? elem.label : "")
        }
    })
    const [commitedDateIndex, setCommitedDateIndex] = useState(day_list.length-1)

 
    const handleCurrentDateChange = (event: any, newValue: number) => {    
            setCommitedDateIndex(newValue);         
    };

    const DateSelector = () => {
        return (<Grid container>
            <Grid item xs={1}>
                <Typography style={{textAlign: "center", paddingTop: "0.5em"}} id="discrete-slider" >
                    Date
      </Typography>
            </Grid>
            <Grid item xs={11}>
                <Slider min={0}         
                    onChangeCommitted={handleCurrentDateChange}      
                    track={false}
                    defaultValue={commitedDateIndex}
                    ValueLabelComponent={ToolTip}            
                    max={day_list.length - 1}
                    step={0}
                    marks={marks} />
            </Grid>
        </Grid>)
    }
    const date_str = day_list[commitedDateIndex].label;
    return (
        <GraphContainer
            setCurrentTab={setCurrentTab}
            currentTab={currentTab}
            title={props.title}
            subtitle={"Date "+  date_str}
            controls={[]}
            tabTitles={["Infected cases", "Choropleth"]}
            bottomElement={< DateSelector />}
        >
            <ItalyMap currentDate={date_str} />
            <Chroropleth currentDate={date_str} />

        </GraphContainer>
    )

}
export default MapTab;
