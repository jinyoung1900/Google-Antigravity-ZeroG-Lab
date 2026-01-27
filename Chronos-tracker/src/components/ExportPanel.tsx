import { FileJson, FileSpreadsheet } from 'lucide-react';
import type { TimeLog, Activity } from '../types';

interface Props {
    logs: TimeLog[];
    activities: Activity[];
}

const ExportPanel = ({ logs, activities }: Props) => {
    const exportToCSV = () => {
        if (logs.length === 0) return;

        // Data Analyst friendly headers: Activity, Start, End, Duration (sec), Date
        const headers = ['ActivityName', 'StartTime', 'EndTime', 'DurationSeconds', 'Date'];
        const rows = logs.map(log => {
            const activity = activities.find(a => a.id === log.activityId);
            return [
                activity?.name || log.activityId,
                new Date(log.startTime).toISOString(),
                log.endTime ? new Date(log.endTime).toISOString() : '',
                log.duration,
                log.date
            ].join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `chronos_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToJSON = () => {
        const dataStr = JSON.stringify({ logs, activities }, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `chronos_data_${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    return (
        <div className="glass-card" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Data Export</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Export your tracking data for advanced analysis in Excel, Python, or R.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button className="electric-button" onClick={exportToCSV}>
                    <FileSpreadsheet size={18} /> EXPORT CSV
                </button>
                <button
                    className="electric-button"
                    style={{ background: 'transparent', border: '1px solid var(--accent-blue)', color: 'var(--accent-blue)', boxShadow: 'none' }}
                    onClick={exportToJSON}
                >
                    <FileJson size={18} /> EXPORT JSON
                </button>
            </div>
        </div>
    );
};

export default ExportPanel;
