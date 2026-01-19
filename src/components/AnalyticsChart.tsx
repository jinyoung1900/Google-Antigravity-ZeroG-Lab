import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { TimeLog, Activity } from '../types';

interface Props {
    logs: TimeLog[];
    activities: Activity[];
}

const AnalyticsChart = ({ logs, activities }: Props) => {
    const data = useMemo(() => {
        const activityTotals: Record<string, number> = {};

        logs.forEach(log => {
            activityTotals[log.activityId] = (activityTotals[log.activityId] || 0) + log.duration;
        });

        return Object.entries(activityTotals).map(([id, duration]) => {
            const activity = activities.find(a => a.id === id);
            return {
                name: activity?.name || id,
                value: Math.round(duration / 60), // minutes
                color: activity?.color || '#8884d8'
            };
        }).filter(item => item.value > 0);
    }, [logs, activities]);

    if (data.length === 0) {
        return (
            <div style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-dim)',
                fontSize: '0.875rem',
                textAlign: 'center',
                padding: '1rem'
            }}>
                Start tracking to see your daily breakdown
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart title="Daily Breakdown (min)">
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'rgba(10, 12, 16, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#fff'
                    }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: any) => [`${value} min`, 'Duration']}
                />
                <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>{value}</span>}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default AnalyticsChart;
