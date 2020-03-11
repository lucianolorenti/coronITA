
import { makeStyles, withStyles } from '@material-ui/core';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import { GeoJSON, Map, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import MarkerCluster from 'leaflet.markercluster';
import 'react-leaflet-markercluster/dist/styles.min.css'
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import "./mapicon.css"
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
const marks = days.map((elem, index) => { return { 'value': index, 'label': elem } })
const mapStyles = makeStyles(theme => ({
    map: {
        height: "400px"
    },
    icon: {
        backgroundColor: "#EEAA22"
    }
}))
function iconCreateFunction(cluster: MarkerCluster) {
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
    return marks[i].label
}

function ValueLabelComponent(props: Props) {
    const { children, open, value } = props;

    return (
        <Tooltip open={open} enterTouchDelay={0} placement="bottom" title={sliderLabel(value)}>
            {children}
        </Tooltip>
    );
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}



const ItalyMap = () => {

    const [data, setData] = useState(null);
    const [keyMap, setKeyMap] = useState(0);
    const [markers, setMarkers] = useState([])
    const [currentDate, setCurrentDate] = useState(marks[marks.length - 1].label)

    const handleDateChange = (event: any, newValue: number) => {
        setCurrentDate(sliderLabel(newValue));
    };
    var markerCluster = React.createRef();;
    const choro = false
    const fetchData = () => {
        if (choro) {
            fetch("/map")
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    setData(data)
                    setKeyMap(keyMap + 1)
                });
        }
    }
    const fetchMarkers = () => {
        fetch("/map_markers?date=" + currentDate)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                setMarkers(data)

            });
    }
    useEffect(() => {
        fetchData()
        fetchMarkers()


    }, [])
    useEffect(() => {
        fetchMarkers()

    }, [currentDate])

    const classes = mapStyles()

    return (
        <div >
            <Map center={{
                lat: 41.29246,
                lng: 12.5736108,
            }} zoom={5}
                className={classes.map}
                maxZoom={15}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {choro ? <GeoJSON key={keyMap} data={data} /> : null}

                <MarkerClusterGroup

                    iconCreateFunction={iconCreateFunction}>
                    {markers.map((elem, idx) => {
                         const NewIcon = L.divIcon({
                            className: 'leaf-icon',
                            iconSize: L.point(18, 18, true),
                            html: elem.totale_casi
                        });
                        return (<Marker
                            icon={NewIcon}
                            position={{ lat: elem.lat, lng: elem.long }}
                            options={{ cases: elem.totale_casi}}
                            key={makeid(10) + idx.toString()} />
                    )})}
                </MarkerClusterGroup>


            </Map>
            <Slider min={0}
                onChangeCommitted={handleDateChange}
                track={false}
                ValueLabelComponent={ValueLabelComponent}
                defaultValue={marks.length - 1}
                aria-labelledby="range-slider"
                max={marks.length - 1}
                getAriaValueText={sliderLabel}
                getAriaLabel={sliderLabel}
                marks />
        </div>
    )
}
export default ItalyMap;