// import { Cell, LabelList, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Pie, measureTextWidth } from '@ant-design/plots';
import { useEffect, useState } from 'react';

const StatsPieChart = ({ statsData }) => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const [data, setData] = useState(null);

    function renderStatistic(containerWidth, text, style) {
        const { width: textWidth, height: textHeight } = measureTextWidth(text, style);
        const R = containerWidth / 2; // r^2 = (w / 2)^2 + (h - offsetY)^2
    
        let scale = 1;
    
        if (containerWidth < textWidth) {
            scale = Math.min(Math.sqrt(Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)))), 1);
        }
    
        const textStyleStr = `width:${containerWidth}px;`;
        return `<div style="${textStyleStr};font-size:${scale}em;line-height:${scale < 1 ? 1 : 'inherit'};">${text}</div>`;
    }

    useEffect(() => {
        if(statsData) {
            setData(statsData);
        }
    }, statsData)

    const config = {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'name',
        radius: 1,
        innerRadius: 0.64,
        meta: {
          value: {
            formatter: (v) => `${v} ¥`,
          },
        },
        label: {
          type: 'inner',
          offset: '-50%',
          style: {
            textAlign: 'center',
          },
          autoRotate: false,
          content: '{value}',
        },
        statistic: {
          title: {
            offsetY: -4,
            // style: {
            //   fontSize: '32px',
            // },
            customHtml: (container, view, datum) => {
              const { width, height } = container.getBoundingClientRect();
              const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
              const text = datum ? datum.name : 'Total';
              return renderStatistic(d, text, {
                fontSize: 28,
              });
            },
          },
          content: {
            offsetY: 4,
            style: {
              fontSize: '32px',
            },
            customHtml: (container, view, datum, data) => {
              const { width } = container.getBoundingClientRect();
              const text = datum ? `${datum.value} %` : ` ${data.reduce((r, d) => r + d.value, 0)} %`;
              return renderStatistic(width, text, {
                fontSize: 32,
              });
            },
          },
        },
        interactions: [
          {
            type: 'element-selected',
          },
          {
            type: 'element-active',
          },
          {
            type: 'pie-statistic-active',
          },
        ],
        legend: {
          layout: 'horizontal',
          position: 'bottom'
        }
    };

    return (
        <>
        {
            data ?
            <Pie {...config} /> :
            <>Loading</>
        }
        </>
        
    );
}

export default StatsPieChart;