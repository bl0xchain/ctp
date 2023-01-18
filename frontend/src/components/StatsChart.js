import { useEffect, useState } from "react";
import { Line } from '@ant-design/plots';
import format from 'number-format.js';

const StatsChart = ({ ctpStats, ctpGroup }) => {

    const [data, setData] = useState(null);

    useEffect(() => {
        const stats = [];
        if(ctpStats) {
            if(ctpGroup === 'CTP50') {
                ctpStats.forEach(item => {
                    stats.push({
                        created: item.created,
                        value: Math.round(item.CTP50 * 100) / 100,
                        category: 'CTP50'
                    });
                    stats.push({
                        created: item.created,
                        value: item.BITCOIN,
                        category: 'BITCOIN'
                    });
                    stats.push({
                        created: item.created,
                        value: item.ETHEREUM,
                        category: 'ETHEREUM'
                    });
                });
            } else {
                ctpStats.forEach(item => {
                    stats.push({
                        created: item.created,
                        value: Math.round(item.CTP10 * 100) / 100,
                        category: 'CTP10'
                    });
                    stats.push({
                        created: item.created,
                        value: item.BITCOIN,
                        category: 'BITCOIN'
                    });
                    stats.push({
                        created: item.created,
                        value: item.ETHEREUM,
                        category: 'ETHEREUM'
                    });
                });
            }
            setData(stats);
        }
    }, [ctpStats, ctpGroup]);

    const config = {
        data,
        xField: 'created',
        yField: 'value',
        seriesField: 'category',
        xAxis: {
            type: 'time',
        },
        yAxis: {
            label: {
                formatter: (v) => `$${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
            },
        },
        tooltip: {
            formatter: (datum) => ({
                name: datum.category,
                value: format( "$#,###.00", datum.value ),
            }),
            customItems: (originalItems) => {
                let filteredItems = originalItems.filter(function(item) {
                    return item.name === "CTP10" || item.name === "CTP50";
                });
                return filteredItems;
            }
        },
        color: ['#D62A0D', '#FF9900', '#444971']
    };

    return (
        <>
        {
            data &&
            <Line {...config} />
        }
        </>
    );
    
}

export default StatsChart;