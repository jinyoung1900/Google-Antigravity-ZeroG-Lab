export interface Activity {
    id: string;
    name: string;
    emoji: string;
    color: string;
    enabled: boolean;
}

export interface TimeLog {
    id: string;
    activityId: string;
    startTime: number; // timestamp
    endTime?: number;  // timestamp
    duration: number;   // in seconds
    date: string;      // YYYY-MM-DD
}

export const PRESET_ACTIVITIES: Activity[] = [
    { id: 'sleep', name: 'Sleeping', emoji: '🛌', color: '#818cf8', enabled: true },
    { id: 'eat', name: 'Eating', emoji: '🍴', color: '#fbbf24', enabled: true },
    { id: 'work_other', name: 'Working (other)', emoji: '💻', color: '#60a5fa', enabled: true },
    { id: 'rest', name: 'Breaks / Rest', emoji: '☕', color: '#34d399', enabled: true },
    { id: 'deep_work', name: 'Deep Work / Coding', emoji: '🚀', color: '#00e5ff', enabled: true },
    { id: 'meetings', name: 'Meetings & Syncs', emoji: '🤝', color: '#a78bfa', enabled: true },
    { id: 'learning', name: 'Learning / Research', emoji: '📚', color: '#f472b6', enabled: true },
    { id: 'exercise', name: 'Exercise & Health', emoji: '🏃', color: '#fb7185', enabled: true },
    { id: 'admin', name: 'Admin / Email', emoji: '📧', color: '#94a3b8', enabled: true },
];
