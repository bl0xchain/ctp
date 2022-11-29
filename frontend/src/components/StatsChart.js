import format from "number-format.js";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const StatsChart = ({ ctpStats, ctpGroup }) => {

    const formatPrice = (price) => {
        return format( "$#,###.##", price );
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString()
    }

    const formatTooltip = (value, name, props) => {
        return formatPrice(value)
    }

    const formatTooltipLabel = (label) => {
        return new Date(label).toLocaleString()
    }

    return (
        <ResponsiveContainer width="100%" height="100%" className="clearfix">
            <LineChart
                width={1200}
                height={800}
                data={ctpStats}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis tickFormatter={formatDate} dataKey="created" />
                <YAxis tickFormatter={formatPrice} />
                <Tooltip formatter={formatTooltip} labelFormatter={formatTooltipLabel} />
                <Legend />
                {
                    ctpGroup === 'CTP10' ?
                    <Line type="linear" dot={false} dataKey="CTP10" stroke="#82ca9d" strokeWidth={2} /> :
                    <Line type="linear" dot={false} dataKey="CTP50" stroke="#82ca9d" strokeWidth={2} />
                }
                <Line type="linear" dot={false} dataKey="BITCOIN" stroke="#ffc658" />
                <Line type="linear" dot={false} dataKey="ETHEREUM" stroke="#8884d8" />
            </LineChart>
        </ResponsiveContainer>
    )
}

export default StatsChart;