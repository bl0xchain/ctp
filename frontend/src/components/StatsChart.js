import { useEffect, useState } from "react";
import { Line } from '@ant-design/plots';

const StatsChart = ({ ctpStats, ctpGroup }) => {

    const [data, setData] = useState(null);

    useEffect(() => {
        const stats = [];
        if(ctpStats) {
            if(ctpGroup === 'CTP50') {
                ctpStats.forEach(item => {
                    stats.push({
                        created: item.created,
                        value: item.CTP50,
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
                        value: item.CTP10,
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
                formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
            },
        },
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