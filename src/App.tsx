import { useState, useEffect, useMemo } from 'react'
import { Square, Settings2, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Edit2 } from 'lucide-react'
import { PRESET_ACTIVITIES } from './types'
import type { TimeLog, Activity } from './types'
import './App.css'

import AnalyticsChart from './components/AnalyticsChart'
import ExportPanel from './components/ExportPanel'

function App() {
  // --- State ---
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('chronos_activities');
    return saved ? JSON.parse(saved) : PRESET_ACTIVITIES;
  });

  const [logs, setLogs] = useState<TimeLog[]>(() => {
    const saved = localStorage.getItem('chronos_logs');
    return saved ? JSON.parse(saved) : [];
  });


  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSettings, setShowSettings] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tracker' | 'stats' | 'goals' | 'insights'>('tracker');
  const [logsExpanded, setLogsExpanded] = useState(false);
  const [goals, setGoals] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('chronos_goals');
    return saved ? JSON.parse(saved) : {};
  });

  // New Activity Form State
  const [newActivityName, setNewActivityName] = useState('');
  const [newActivityEmoji, setNewActivityEmoji] = useState('✨');

  // Pomodoro State
  const [pomodoroMode, setPomodoroMode] = useState(false);
  const [pomodoroState, setPomodoroState] = useState<'idle' | 'work' | 'break'>('idle');
  const [pomodoroTimeLeft, setPomodoroTimeLeft] = useState(25 * 60); // 25 mins

  // Easter Egg State
  const [, setTitleClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('chronos_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('chronos_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('chronos_goals', JSON.stringify(goals));
  }, [goals]);

  // --- Timer Tick ---
  useEffect(() => {
    let interval: any;
    const hasActiveLogs = logs.some(l => !l.endTime);

    if (hasActiveLogs || pomodoroState !== 'idle') {
      interval = setInterval(() => {
        setCurrentTime(Date.now());

        if (pomodoroMode && pomodoroState !== 'idle') {
          setPomodoroTimeLeft(prev => {
            if (prev <= 1) {
              // Switch states
              if (pomodoroState === 'work') {
                stopTimer(); // Stop all running logs when work ends
                setPomodoroState('break');
                alert("Pomodoro Work Session Over! Take a 5m break.");
                return 5 * 60;
              } else {
                setPomodoroState('idle');
                alert("Break is over! Ready to focus again?");
                return 25 * 60;
              }
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [logs, pomodoroMode, pomodoroState]);

  // --- Logic ---
  const activeLogs = useMemo(() => logs.filter(l => !l.endTime), [logs]);

  const dailyLogs = useMemo(() =>
    logs.filter(l => l.date === selectedDate && l.endTime),
    [logs, selectedDate]
  );

  const recordedDates = useMemo(() =>
    new Set(logs.map(l => l.date)),
    [logs]
  );

  const startTimer = (activityId: string) => {
    // If activity is already running, do nothing (or we could stop it)
    if (activeLogs.some(l => l.activityId === activityId)) return;

    const newLog: TimeLog = {
      id: crypto.randomUUID(),
      activityId,
      startTime: Date.now(),
      duration: 0,
      date: new Date().toISOString().split('T')[0]
    };

    setLogs(prev => [...prev, newLog]);
  };

  const stopTimer = (activityId?: string) => {
    setLogs(prev => prev.map(log => {
      if (!log.endTime && (!activityId || log.activityId === activityId)) {
        const endTime = Date.now();
        return {
          ...log,
          endTime,
          duration: Math.floor((endTime - log.startTime) / 1000)
        };
      }
      return log;
    }));
  };

  const deleteLog = (id: string) => {
    setLogs(prev => prev.filter(l => l.id !== id));
  };

  const updateLogDuration = (id: string, newMinutes: number) => {
    setLogs(prev => prev.map(l =>
      l.id === id ? { ...l, duration: newMinutes * 60 } : l
    ));
    setEditingLogId(null);
  };

  const toggleActivity = (id: string) => {
    setActivities(prev => prev.map(a =>
      a.id === id ? { ...a, enabled: !a.enabled } : a
    ));
  };

  const deleteActivity = (id: string) => {
    // Don't delete if it's currently being tracked
    if (activeLogs.some(l => l.activityId === id)) {
      alert("Cannot delete an activity while it's being tracked!");
      return;
    }
    if (confirm("Are you sure you want to delete this activity? Existing logs will remain but the activity will be removed from the tracker.")) {
      setActivities(prev => prev.filter(a => a.id !== id));
    }
  };

  const addCustomActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityName.trim()) return;

    const newActivity: Activity = {
      id: crypto.randomUUID(),
      name: newActivityName,
      emoji: newActivityEmoji,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`, // Random bright color
      enabled: true
    };

    setActivities(prev => [...prev, newActivity]);
    setNewActivityName('');
  };

  const startPomodoro = () => {
    setPomodoroState('work');
    setPomodoroTimeLeft(25 * 60);
  };

  const cancelPomodoro = () => {
    setPomodoroState('idle');
    setPomodoroTimeLeft(25 * 60);
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
  };

  const getRunningDuration = (startTime: number) => {
    return Math.floor((currentTime - startTime) / 1000);
  };

  const handleTitleClick = () => {
    setTitleClickCount(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setShowEasterEgg(true);
        return 0;
      }
      return next;
    });
  };

  const exportToCSV = () => {
    const header = "Date,Activity,Duration (min),Start Time\n";
    const rows = logs.map(log => {
      const act = activities.find(a => a.id === log.activityId);
      return `${log.date},"${act?.name}",${Math.round(log.duration / 60)},${new Date(log.startTime).toLocaleTimeString()}`;
    }).join("\n");

    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chronos_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="container" style={{ position: 'relative' }}>
      {/* Easter Egg Modal */}
      {showEasterEgg && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.9)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '2rem'
        }}>
          <div className="glass-card" style={{
            position: 'relative',
            maxWidth: '500px',
            width: '100%',
            padding: '1.5rem',
            textAlign: 'center',
            border: '2px solid var(--accent-blue)',
            boxShadow: '0 0 50px rgba(0, 229, 255, 0.3)'
          }}>
            <button
              onClick={() => setShowEasterEgg(false)}
              style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                background: 'var(--accent-blue)',
                color: 'var(--bg-dark)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000
              }}
            >
              ×
            </button>
            <img
              src="/mascot.jpg"
              alt="Easter Egg Dog"
              style={{ width: '100%', borderRadius: '12px', marginBottom: '1rem' }}
            />
            <p style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>You found the secret mascot! 🐶✨</p>
          </div>
        </div>
      )}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1
            onClick={handleTitleClick}
            style={{
              fontSize: '2.5rem',
              color: 'var(--accent-blue)',
              letterSpacing: '-0.02em',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            CHRONOS
          </h1>
          <p style={{ color: 'var(--text-dim)' }}>Precision time tracking for peak performance.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="glass-card" style={{ padding: '0.75rem' }} onClick={() => setShowSettings(!showSettings)}>
            <Settings2 size={20} color={showSettings ? 'var(--accent-blue)' : 'white'} />
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <button
          onClick={() => setActiveTab('tracker')}
          style={{
            fontSize: '0.9rem',
            fontWeight: '600',
            color: activeTab === 'tracker' ? 'var(--accent-blue)' : 'var(--text-dim)',
            padding: '0.5rem 0.75rem',
            position: 'relative'
          }}
        >
          TRACKER
          {activeTab === 'tracker' && <div style={{ position: 'absolute', bottom: '-1rem', left: 0, right: 0, height: '2px', background: 'var(--accent-blue)', boxShadow: '0 0 10px var(--accent-blue)' }} />}
        </button>
        <button
          onClick={() => setActiveTab('goals')}
          style={{
            fontSize: '0.9rem',
            fontWeight: '600',
            color: activeTab === 'goals' ? 'var(--accent-blue)' : 'var(--text-dim)',
            padding: '0.5rem 0.75rem',
            position: 'relative'
          }}
        >
          GOALS
          {activeTab === 'goals' && <div style={{ position: 'absolute', bottom: '-1rem', left: 0, right: 0, height: '2px', background: 'var(--accent-blue)', boxShadow: '0 0 10px var(--accent-blue)' }} />}
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          style={{
            fontSize: '0.9rem',
            fontWeight: '600',
            color: activeTab === 'stats' ? 'var(--accent-blue)' : 'var(--text-dim)',
            padding: '0.5rem 0.75rem',
            position: 'relative'
          }}
        >
          HISTORY
          {activeTab === 'stats' && <div style={{ position: 'absolute', bottom: '-1rem', left: 0, right: 0, height: '2px', background: 'var(--accent-blue)', boxShadow: '0 0 10px var(--accent-blue)' }} />}
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          style={{
            fontSize: '0.9rem',
            fontWeight: '600',
            color: activeTab === 'insights' ? 'var(--accent-blue)' : 'var(--text-dim)',
            padding: '0.5rem 0.75rem',
            position: 'relative'
          }}
        >
          INSIGHTS
          {activeTab === 'insights' && <div style={{ position: 'absolute', bottom: '-1rem', left: 0, right: 0, height: '2px', background: 'var(--accent-blue)', boxShadow: '0 0 10px var(--accent-blue)' }} />}
        </button>
      </nav>

      {/* Global Active Sessions (Visible on all tabs if running) */}
      {activeLogs.length > 0 && (
        <section className="glass-card" style={{ marginBottom: '2rem', border: '1px solid var(--accent-blue)', boxShadow: '0 0 30px rgba(0,229,255,0.1)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {activeLogs.map(log => {
            const activity = activities.find(a => a.id === log.activityId);
            return (
              <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-blue)' }}>Running Session</span>
                  <h2 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>
                    {activity?.emoji} {activity?.name}
                  </h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', fontFamily: 'monospace' }}>
                    {formatDuration(getRunningDuration(log.startTime))}
                  </div>
                  <button className="electric-button" style={{ background: '#ff4d4d', boxShadow: '0 4px 20px rgba(255, 77, 77, 0.3)', marginTop: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={() => stopTimer(log.activityId)}>
                    <Square size={14} fill="currentColor" /> STOP
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {activeTab === 'tracker' ? (
        <main>
          {/* Activity List - Compact Grid */}
          <section>
            <h3 style={{ marginBottom: '1.5rem', opacity: 0.8 }}>Start Tracking</h3>

            {/* Pomodoro Controls */}
            <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderColor: pomodoroMode ? 'var(--accent-blue)' : 'var(--border-color)' }}>
              <div>
                <div style={{ fontWeight: '600', fontSize: '1rem', color: pomodoroMode ? 'var(--accent-blue)' : 'white' }}>🍅 Pomodoro</div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {pomodoroMode && (
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'monospace', color: 'var(--accent-blue)' }}>
                    {Math.floor(pomodoroTimeLeft / 60)}:{(pomodoroTimeLeft % 60).toString().padStart(2, '0')}
                  </div>
                )}
                <button
                  onClick={() => {
                    if (pomodoroMode) {
                      cancelPomodoro();
                      setPomodoroMode(false);
                    } else {
                      setPomodoroMode(true);
                    }
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    background: pomodoroMode ? 'var(--accent-blue)' : 'transparent',
                    border: '1px solid var(--accent-blue)',
                    color: pomodoroMode ? 'var(--bg-dark)' : 'var(--accent-blue)',
                    fontWeight: '700',
                    fontSize: '0.75rem'
                  }}
                >
                  {pomodoroMode ? 'DISABLE' : 'ENABLE'}
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.75rem' }}>
              {activities.filter(a => a.enabled).map(activity => (
                <button
                  key={activity.id}
                  className="glass-card"
                  onClick={() => {
                    if (activeLogs.some(l => l.activityId === activity.id)) {
                      stopTimer(activity.id);
                    } else {
                      if (pomodoroMode && pomodoroState === 'idle') {
                        startPomodoro();
                      }
                      startTimer(activity.id);
                    }
                  }}
                  disabled={false}
                  title={activity.name}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    aspectRatio: '1/1',
                    padding: '0.75rem',
                    width: '100%',
                    border: activeLogs.some(l => l.activityId === activity.id) ? '2px solid var(--accent-blue)' : '1px solid var(--border-color)',
                    background: activeLogs.some(l => l.activityId === activity.id) ? 'var(--accent-blue-dim)' : 'var(--bg-card)',
                    borderRadius: '16px',
                    transition: 'var(--transition-smooth)',
                    textAlign: 'center'
                  }}
                >
                  <span style={{ fontSize: '2.25rem', lineHeight: '1', display: 'block' }}>{activity.emoji}</span>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: activeLogs.some(l => l.activityId === activity.id) ? 'var(--accent-blue)' : 'var(--text-dim)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                    display: 'block'
                  }}>
                    {activity.name}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </main>
      ) : activeTab === 'stats' ? (
        <div className="grid-layout">
          <aside style={{ width: '100%' }}>
            {/* Calendar Selector */}
            <div className="glass-card" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() - 1);
                  setSelectedDate(d.toISOString().split('T')[0]);
                }}><ChevronLeft /></button>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
                    <CalendarIcon size={16} color="var(--accent-blue)" />
                    {selectedDate}
                  </div>
                  {recordedDates.has(selectedDate) && (
                    <span style={{ fontSize: '0.6rem', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>● Recorded</span>
                  )}
                </div>
                <button onClick={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() + 1);
                  setSelectedDate(d.toISOString().split('T')[0]);
                }}><ChevronRight /></button>
              </div>
            </div>

            {/* Daily Visualization */}
            <div className="glass-card" style={{ height: '400px', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem' }}>Activity Distribution</h3>
                <button
                  onClick={exportToCSV}
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--accent-blue)',
                    border: '1px solid var(--accent-blue)',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px'
                  }}
                >
                  EXPORT CSV
                </button>
              </div>
              <div style={{ height: '320px' }}>
                <AnalyticsChart logs={dailyLogs} activities={activities} />
              </div>
            </div>
          </aside>

          <main>
            {/* Daily Logs List */}
            <div className="glass-card">
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Detailed Logs</h3>
              {dailyLogs.length === 0 ? (
                <p style={{ color: 'var(--text-dim)', fontSize: '1rem', textAlign: 'center', padding: '2rem' }}>No logs recorded for this day yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {(logsExpanded ? dailyLogs : dailyLogs.slice(0, 5)).map(log => {
                    const act = activities.find(a => a.id === log.activityId);
                    const isEditing = editingLogId === log.id;

                    return (
                      <div key={log.id} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                          <span style={{ display: 'flex', gap: '0.75rem', fontSize: '1rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.25rem' }}>{act?.emoji}</span>
                            <span style={{ fontWeight: '500' }}>{act?.name}</span>
                          </span>
                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setEditingLogId(isEditing ? null : log.id)} style={{ color: 'var(--text-dim)', opacity: 0.6 }}>
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => deleteLog(log.id)} style={{ color: '#ff4d4d', fontSize: '1.2rem', opacity: 0.6 }}>×</button>
                          </div>
                        </div>

                        {isEditing ? (
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                              type="number"
                              defaultValue={Math.round(log.duration / 60)}
                              onBlur={(e) => updateLogDuration(log.id, parseInt(e.target.value) || 0)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') updateLogDuration(log.id, parseInt((e.target as any).value) || 0)
                              }}
                              autoFocus
                              style={{ width: '80px', background: 'var(--bg-dark)', border: '1px solid var(--accent-blue)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '1rem' }}
                            />
                            <span style={{ color: 'var(--text-dim)' }}>minutes</span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '700', color: 'var(--accent-blue)', fontSize: '1.25rem', fontFamily: 'monospace' }}>
                              {formatDuration(log.duration)}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                              {new Date(log.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {dailyLogs.length > 5 && (
                    <button
                      onClick={() => setLogsExpanded(!logsExpanded)}
                      style={{
                        marginTop: '1rem',
                        padding: '0.75rem',
                        width: '100%',
                        color: 'var(--accent-blue)',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        border: '1px dashed var(--accent-blue-dim)',
                        borderRadius: '12px'
                      }}
                    >
                      {logsExpanded ? 'SHOW LESS' : `SHOW ALL (${dailyLogs.length})`}
                    </button>
                  )}
                </div>
              )}
            </div>
            {/* Data Export */}
            <ExportPanel logs={logs} activities={activities} />
          </main>
        </div>
      ) : activeTab === 'goals' ? (
        <main>
          <div className="glass-card">
            <h2 style={{ marginBottom: '2rem', color: 'var(--accent-blue)' }}>Daily Goals</h2>
            {activities.filter(a => a.enabled).map(activity => {
              const targetMin = goals[activity.id] || 0;
              const actualSec = logs
                .filter(l => l.activityId === activity.id && l.date === new Date().toISOString().split('T')[0])
                .reduce((acc, curr) => acc + (curr.duration || Math.floor((currentTime - curr.startTime) / 1000)), 0);

              const actualMin = Math.floor(actualSec / 60);
              const progress = targetMin > 0 ? Math.min((actualMin / targetMin) * 100, 100) : 0;

              return (
                <div key={activity.id} style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.5rem' }}>{activity.emoji}</span>
                      <span style={{ fontWeight: '600' }}>{activity.name}</span>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: 'var(--accent-blue)', fontWeight: '700' }}>{actualMin}m</span>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>/</span>
                      <input
                        type="number"
                        value={targetMin || ''}
                        placeholder="0"
                        onChange={(e) => setGoals(prev => ({ ...prev, [activity.id]: parseInt(e.target.value) || 0 }))}
                        style={{
                          width: '50px',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--accent-blue)',
                          padding: '2px 4px',
                          borderRadius: '4px',
                          textAlign: 'center',
                          fontSize: '0.875rem',
                          fontWeight: '700'
                        }}
                      />
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>goal</span>
                    </div>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${progress}%`,
                      background: progress >= 100 ? '#34d399' : 'var(--accent-blue)',
                      boxShadow: progress >= 100 ? '0 0 10px #34d399' : '0 0 10px var(--accent-blue)',
                      transition: 'width 0.5s ease-out'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      ) : activeTab === 'insights' ? (
        <main>
          <div style={{ display: 'grid', gap: '2rem' }}>
            <div className="glass-card">
              <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-blue)', fontSize: '1.25rem' }}>Efficiency Trends</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {activities.filter(a => a.enabled).slice(0, 4).map(activity => {
                  const todaySec = logs
                    .filter(l => l.activityId === activity.id && l.date === new Date().toISOString().split('T')[0])
                    .reduce((acc, curr) => acc + curr.duration, 0);

                  const allLogs = logs.filter(l => l.activityId === activity.id && l.endTime);
                  const daysActive = new Set(allLogs.map(l => l.date)).size || 1;
                  const avgSec = allLogs.reduce((acc, curr) => acc + curr.duration, 0) / daysActive;

                  const diff = avgSec > 0 ? ((todaySec - avgSec) / avgSec) * 100 : 0;

                  return (
                    <div key={activity.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>{activity.emoji} {activity.name}</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{Math.floor(todaySec / 60)}m</div>
                      <div style={{ fontSize: '0.75rem', color: diff >= 0 ? '#34d399' : '#fb7185', marginTop: '0.25rem' }}>
                        {diff >= 0 ? '+' : ''}{Math.round(diff)}% vs average
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card">
              <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-blue)', fontSize: '1.25rem' }}>Weekly Heatmap</h2>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[...Array(7)].map((_, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() - (6 - i));
                  const dateStr = d.toISOString().split('T')[0];
                  const dayLogs = logs.filter(l => l.date === dateStr);
                  const totalHours = dayLogs.reduce((acc, curr) => acc + curr.duration, 0) / 3600;
                  const opacity = Math.min(totalHours / 8, 1); // Max intensity at 8 hours

                  return (
                    <div
                      key={dateStr}
                      title={`${dateStr}: ${Math.round(totalHours * 10) / 10} hours`}
                      style={{
                        flex: 1,
                        aspectRatio: '1/1',
                        background: totalHours > 0 ? `rgba(0, 229, 255, ${0.1 + opacity * 0.9})` : 'rgba(255,255,255,0.05)',
                        borderRadius: '4px',
                        boxShadow: totalHours > 0 ? `0 0 10px rgba(0, 229, 255, ${opacity * 0.5})` : 'none'
                      }}
                    />
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                <span>{new Date(Date.now() - 6 * 86400000).toLocaleDateString([], { weekday: 'short' })}</span>
                <span>Today</span>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <main>
          <div className="glass-card">
            <h2 style={{ marginBottom: '2rem', color: 'var(--accent-blue)' }}>Insights</h2>
            <p style={{ color: 'var(--text-dim)' }}>Select a tab to view your performance data.</p>
          </div>
        </main>
      )}

      {/* Side Drawer Settings */}
      <div className={`drawer-overlay ${showSettings ? 'active' : ''}`} onClick={() => setShowSettings(false)} />
      <div className={`drawer ${showSettings ? 'active' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-blue)' }}>Settings</h2>
          <button onClick={() => setShowSettings(false)} style={{ color: 'var(--text-dim)', fontSize: '1.5rem' }}>×</button>
        </div>

        <section style={{ marginBottom: '2.5rem' }}>
          <h4 style={{ marginBottom: '1.25rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)' }}>Activity Visibility</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activities.map(a => (
              <div key={a.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  onClick={() => toggleActivity(a.id)}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: `1px solid ${a.enabled ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                    color: a.enabled ? 'var(--accent-blue)' : 'var(--text-dim)',
                    background: a.enabled ? 'var(--accent-blue-dim)' : 'transparent',
                    fontSize: '0.9rem',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{a.emoji}</span>
                  <span style={{ flex: 1 }}>{a.name}</span>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.enabled ? 'var(--accent-blue)' : 'transparent', border: '1px solid var(--border-color)' }} />
                </button>
                <button
                  onClick={() => deleteActivity(a.id)}
                  style={{
                    padding: '0.75rem',
                    color: '#ff4d4d',
                    opacity: 0.6,
                    fontSize: '1.2rem'
                  }}
                  title="Delete Activity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </section>

        <section style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', marginBottom: '2.5rem' }}>
          <h4 style={{ marginBottom: '1.25rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)' }}>Daily Goals (Minutes)</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activities.filter(a => a.enabled).map(a => (
              <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem' }}>{a.emoji} {a.name}</span>
                <input
                  type="number"
                  value={goals[a.id] || ''}
                  placeholder="0"
                  onChange={(e) => setGoals(prev => ({ ...prev, [a.id]: parseInt(e.target.value) || 0 }))}
                  style={{ width: '60px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', padding: '0.4rem', borderRadius: '8px', textAlign: 'center' }}
                />
              </div>
            ))}
          </div>
        </section>

        <section style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
          <h4 style={{ marginBottom: '1.25rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)' }}>Create Custom Activity</h4>
          <form onSubmit={addCustomActivity} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="icon"
                value={newActivityEmoji}
                onChange={(e) => setNewActivityEmoji(e.target.value)}
                style={{ width: '50px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', padding: '0.75rem', borderRadius: '12px', textAlign: 'center', fontSize: '1.2rem' }}
              />
              <input
                type="text"
                placeholder="Activity name..."
                value={newActivityName}
                onChange={(e) => setNewActivityName(e.target.value)}
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', padding: '0.75rem', borderRadius: '12px' }}
              />
            </div>
            <button type="submit" className="electric-button" style={{ width: '100%', justifyContent: 'center' }}>ADD NEW ACTIVITY</button>
          </form>
        </section>

        <section style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center' }}>Chronos v1.2.0 • Data is saved locally</p>
        </section>
      </div>
    </div>
  )
}

export default App
