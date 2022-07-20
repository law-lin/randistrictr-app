import React, { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import { PieChart as ReactMinimalPieChart } from 'react-minimal-pie-chart';
import numberWithCommas from '../utils/numberWithCommas';

function makeTooltipContent(entry) {
  return `${entry.tooltip}: ${numberWithCommas(entry.value.toFixed(0))}`;
}

function PieChart(props) {
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState();
  const [hovered, setHovered] = useState(undefined);

  useEffect(() => {
    let totalValue = 0;
    props.data.forEach((entry) => {
      totalValue += entry.value;
    });
    let otherValue = 0;
    let filteredData = props.data.filter((entry) => {
      if (entry.title !== 'Other' && entry.value / totalValue < 0.02) {
        otherValue += entry.value;
        return false;
      }
      return true;
    });
    const chartData = filteredData.map((entry, i) => {
      if (entry.title === 'Other') {
        entry.value += otherValue;
      }
      if (hovered === i) {
        return {
          ...entry,
          color: '#ff99ff',
          tooltip: entry.title,
        };
      }
      return { ...entry, tooltip: entry.title };
    });
    setData(chartData);
  }, [props.data]);

  if (!data) {
    return null;
  }
  return (
    <div data-tip='' data-for='chart'>
      <ReactMinimalPieChart
        style={{
          fontFamily:
            '"Nunito Sans", -apple-system, Helvetica, Arial, sans-serif',
          fontSize: '8px',
        }}
        data={data}
        radius={35}
        lineWidth={60}
        segmentsStyle={{ transition: 'stroke .3s', cursor: 'pointer' }}
        segmentsShift={(index) => (index === selected ? 6 : 1)}
        animate
        label={({ dataEntry }) =>
          Math.round(dataEntry.percentage * 100) / 100 + '%'
        }
        // labelPosition={100 - lineWidth / 2}
        // labelStyle={{
        //   fill: '#fff',
        //   opacity: 0.75,
        //   pointerEvents: 'none',
        // }}
        labelStyle={(index) => ({
          fill: data[index].color,
          fontSize: '4px',
          fontFamily: 'sans-serif',
        })}
        labelPosition={105}
        onClick={(_, index) => {
          setSelected(index === selected ? undefined : index);
        }}
        onMouseOver={(_, index) => {
          setHovered(index);
        }}
        onMouseOut={() => {
          setHovered(undefined);
        }}
      />
      <ReactTooltip
        id='chart'
        getContent={() =>
          typeof hovered === 'number' ? makeTooltipContent(data[hovered]) : null
        }
      />
    </div>
  );
}

export default PieChart;
