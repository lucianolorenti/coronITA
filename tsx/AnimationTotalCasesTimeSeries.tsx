import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { InlineMath } from 'react-katex';
import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis, Label } from 'recharts';

interface ArrayConstructor {
    from<T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): Array<U>;
    from<T>(arrayLike: ArrayLike<T>): Array<T>;
}


const renderColorfulLegendText = (coeffs) => (value, entry) => {
    const { color } = entry;
    if (coeffs == null) {
        return null
    }
    if (entry['value'] == 'Fitted curve') {
        return (
            <React.Fragment>
                <span>{value}</span>
                <span style={{ fontSize: "12px", marginLeft: "1em" }}>
                    <InlineMath >
                        {`y=${parseFloat(coeffs[1]).toFixed(3)} ({${parseFloat(coeffs[0]).toFixed(3)}}^x)`}
                    </InlineMath>
                </span>

            </React.Fragment>)
    } else {
        return <span>{value}</span>;
    }

}

export default function AnimationTotalCasesTimeSeries() {
    const [data, setData] = useState({data:[], n:0, max_value:0});




    useEffect(() => {

        fetch('/total_time_serie_animation')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data)
                setData(data)
        
            });
    }, [])

    return (
        <React.Fragment>

            <ResponsiveContainer width="100%" height={400} >
                <LineChart

                    data={data.data}
                    margin={{
                        top: 5, right: 15, left: 30, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" tickCount={9} allowDuplicatedCategory={false} />
                    <YAxis domain={[0, data.max_value]} />
                    <Tooltip />
                    <Legend />
                    <Line isAnimationActive={false} type="linear"
                        dataKey="totale_casi"
                        name="Total cases"
                        strokeWidth={2}
                        stroke="#4668ff" activeDot={{ r: 2 }} />
                    {Array.from(Array(data.n).keys()).map((idx) => {
                        return (
                            <Line isAnimationActive={false}
                                type="linear"
                                dataKey={'fitted_'+ idx.toString()}
                                name="Fitted curve"
                                stroke="#777777"
                                strokeWidth={2}                                
                                dot={false}
                                key={idx}
                                strokeDasharray="5 5" />
                        )
                    })}
                    
        <ReferenceLine x="2020-03-09" stroke="#EE5555">
            <Label>  LockDown </Label>
        </ReferenceLine>

        <ReferenceLine x="2020-05-04" stroke="#EE5555">
            <Label>  Fase 2 </Label>
        </ReferenceLine>

        <ReferenceLine x="2020-06-15" stroke="#EE5555">
            <Label>  Fase 3 </Label>
        </ReferenceLine>
                </LineChart>

            </ResponsiveContainer>

        </React.Fragment>
    )

}

