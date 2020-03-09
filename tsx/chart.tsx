import React, { PureComponent } from 'react';
import {
  BarChart, LineChart, Bar, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';


export function CustomizedAxisTick(props) {

  const {
    x, y, stroke, payload,
  } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">{payload.value}</text>
    </g>
  );
}




