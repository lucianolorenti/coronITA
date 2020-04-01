
import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import Slider, { ValueLabelProps } from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import L from 'leaflet';
import MarkerCluster from 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import React, { FunctionComponent, useState } from 'react';
import 'react-leaflet-markercluster/dist/styles.min.css';

import GraphContainer from './GraphContainer';

import "./mapicon.css";
import {plotHeight} from './styles'

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
        height: plotHeight - 50 + "px"
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
interface MapsContainerProps {
    isMobile:boolean,
    title:string

}
const MapContainer = Contained => (props: MapsContainerProps) => {
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
            tabTitles={["Infected cases"]}
            bottomElement={< DateSelector />}
        >
            <Contained currentDate={date_str} />
    

        </GraphContainer>
    )

}

export default MapContainer;