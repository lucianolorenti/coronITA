import React, { useEffect, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Sankey, Text, Tooltip, XAxis, YAxis } from 'recharts';
import { CustomizedAxisTick } from './chart';
import { useStyles } from './styles';
declare var regions: any;
declare var days: Array<any>;

const nodes = [
    {
        "name": "Tamponi"
    },
    {
        "name": "Positive cases"
    },
    {
        "name": "Not infected"
    },
    {
        "name": "Dead"
    },
    {
        "name": "Discharged healed"
    },
    {
        "name": "Home isolation"
    },
    {
        "name": "Total hospitalized"
    },
    {
        "name": "'Intensive therapy"
    },
    {
        "name": "Hospitalized"
    }
]
function create_links(data) {
    const { tamponi, totale_casi, deceduti,
        totale_ospedalizzati, ricoverati_con_sintomi, terapia_intensiva,
        isolamento_domiciliare, dimessi_guariti } = data

    return [
        {
            "source": 0,
            "target": 2,
            "value": tamponi - totale_casi
        },
        {
            "source": 0,
            "target": 1,
            "value": totale_casi
        },
        {
            "source": 1,
            "target": 3,
            "value": deceduti
        },
        {
            "source": 1,
            "target": 5,
            "value": isolamento_domiciliare
        },
        {
            "source": 1,
            "target": 4,
            "value": dimessi_guariti
        },
        {
            "source": 1,
            "target": 6,
            "value": totale_ospedalizzati
        },
        {
            "source": 6,
            "target": 7,
            "value": terapia_intensiva
        },
        {
            "source": 6,
            "target": 8,
            "value": ricoverati_con_sintomi
        }
    ]

}

export default function SankeyCases() {
    const classes = useStyles();
    const [data, setData] = useState({});
    const fetchData = () => {
        fetch('/last_data')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {            
                setData(data[0])
            });
    }

    useEffect(() => {
        fetchData()
    }, [])


    return (<React.Fragment>
        {'tamponi' in data ? 
        <ResponsiveContainer width="100%" height={500}>
            <Sankey
                data={{ 'nodes': nodes, 'links': create_links(data) }}
                linkCurvature={0.5}
                nodePading={300}
                linkWidth={1}
            >
                <Tooltip />
                <Legend />

            </Sankey>
        </ResponsiveContainer> : null}
    </React.Fragment>
    )
}
