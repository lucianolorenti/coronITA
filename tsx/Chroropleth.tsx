import React, { useEffect, useState, useRef } from 'react';
import { Map, TileLayer } from 'react-leaflet';
import Choropleth, { Legend } from 'react-leaflet-choropleth';
import { MapProps, mapStyles } from './Map';
import L from 'leaflet';
import Control from 'react-leaflet-control';

const style = {
    fillColor: '#F28F3B',
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.5
}
export function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
}

export function Chroropleth(props: MapProps) {
    const { currentDate } = props;
    const [cases, setCases] = useState({})
    const [geojson, setData] = useState({
        data: {
            features: []
        },
        key: 0
    });


    var map = useRef(null);
    var choropleth = useRef(null);
    const fetchData = () => {
        fetch("/map")
            .then(function (response) {
                return response.json();
            })
            .then(function (newData) {
                setData({
                    data: newData,
                    key: newData.key + 1
                });
            });
    };
    const fetchCases = () => {
        fetch("/cases_hist?date=" + currentDate)
            .then(function (response) {
                return response.json();
            })
            .then(function (newData) {
                newData = newData.reduce((result, filter) => {
                    result[filter.denominazione_regione] = filter.totale_casi;
                    return result;
                }, {});

                newData["Emilia-Romagna"] = newData["Emilia Romagna"]
                newData["Valle d'Aosta/Vallée d'Aoste"] = newData["Valle d'Aosta"]
                newData["Friuli-Venezia Giulia"] = newData["Friuli Venezia Giulia"]
                newData["Trentino-Alto Adige/Südtirol"] = newData["Trento"]
                setCases(newData)
            });
    }

    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        fetchData();
        fetchCases();
    }, [currentDate]);
    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 2,
            color: '#DDD',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }
    function resetHighlight(e) {
        e.target.setStyle({
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.5
        });
    }
    function zoomToFeature(e) {
        map.current.fitBounds(e.target.getBounds());
    }
    const classes = mapStyles();
    const valueProperty = (feature) => {
        const reg_name = feature.properties.reg_name
        if (reg_name in cases) {
            return cases[reg_name] + 0.00001
        } else {
            return 0.00001
        }
    }
    const legendList = []
    if (choropleth.current) {
        const colors = choropleth.current.getColors();

        for (var i = 0; i < colors['limits'].length; i++) {
            let elem = {}
            if (i == 0) {
                elem['lower'] = 0
            } else {
                elem['lower'] = Math.round(colors['limits'][i - 1])
            }
            elem['upper'] = Math.round(colors['limits'][i]),
                elem['color'] = colors["colors"][i]
            legendList.push(elem)
        }
    }
    return (
        <React.Fragment>
            <Map center={{
                lat: 41.29246,
                lng: 12.5736108,
            }} zoom={5}
                className={classes.map}
                maxZoom={15}

                ref={map}>
                <TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <Choropleth data={geojson.data}
                    scale={['yellow', 'red']}
                    steps={10}
                    mode='q'
                    style={style}
                    key={makeid(50)}
                    ref={choropleth}
                    onEachFeature={(feature, layer) => {
                        layer.bindPopup(
                            "<div>" +
                            "<span>" + feature.properties.reg_name + " </span> <br/>" +
                            "<span>" + Math.round(valueProperty(feature)).toString() + " Cases </span>" +
                            "</div>"
                        )
                        layer.on({
                            mouseover: highlightFeature,
                            mouseout: resetHighlight,
                            click: zoomToFeature
                        });
                    }}
                    valueProperty={valueProperty}
                />
                <Control position="bottomright" >
                    <div style={{backgroundColor: '#FFFFFFCC',
                    padding: "0.5em",
                'border': "1px solid gray"}}>
                {legendList.map((elem, idx) => {
                    return (
                        <div key={idx}>
                            <div style={{ 'background': elem.color, 
                            'height': "15px", "width": "15px",
                            display: 'inline-block',
                            marginRight:"15px" }}> </div>
                            <span style={{display: 'inline-block'}}>
                                {elem.lower} > x >= {elem.upper}
                            </span> 
                            
                        </div>)
                })}
                </div>
                </Control>
            </Map>
       
        </React.Fragment>);
}
