import L from 'leaflet';
import React, { useEffect, useState } from 'react';
import { Map, Marker, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { mapStyles, iconCreateFunction, makeid, MapProps } from './Map';
import MapContainer from './Map'




function ItalyMap(props: MapProps) {
    const { currentDate } = props;
    const [markers, setMarkers] = useState([]);
    const fetchMarkers = () => {
        fetch("/map_markers?date=" + currentDate)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                setMarkers(data);
            });
    };
    useEffect(() => {
        fetchMarkers();
    }, [currentDate]);
    const classes = mapStyles();
    return (<div>
        <Map center={{
            lat: 41.29246,
            lng: 12.5736108,
        }} zoom={5} className={classes.map} maxZoom={15}>
            <TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />


            <MarkerClusterGroup iconCreateFunction={iconCreateFunction}>
                {markers.map((elem, idx) => {
                    const NewIcon = L.divIcon({
                        className: 'leaf-icon',
                        iconSize: L.point(18, 18, true),
                        html: elem.totale_casi
                    });
                    return (<Marker icon={NewIcon} position={{ lat: elem.lat, lng: elem.long }} options={{ cases: elem.totale_casi }} key={makeid(30) + "_" + idx.toString()} />);
                })}
            </MarkerClusterGroup>


        </Map>

    </div>);
}
export default MapContainer(ItalyMap)