import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faRotate, faCircleCheck, faTriangleExclamation, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

export const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState('All');

  // Fetch system logs on mount safely
  useEffect(() => {
    let isMounted = true;

    const fetchLogs = async () => {
      try {
        if (isMounted) setLoading(true);
        const response = await fetch('/api/admin/logs', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        const logList = Array.isArray(data) ? data : data.data || data.logs || [];
        
        if (isMounted) {
          setLogs(logList);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch system logs:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLogs();

    return () => {
      isMounted = false;
    };
  }, []);

  const reloadLogs = async () => {
    try {
      const response = await fetch('/api/admin/logs', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      const logList = Array.isArray(data) ? data : data.data || data.logs || [];
      setLogs(logList);
    } catch (err) {
      console.error('Failed to reload logs:', err);
    }
  };

  // Clear system logs
  const handleClearLogs = async () => {
    if (!window.confirm('Are you sure you want to clear all system audit logs?')) return;
    try {
      await fetch('/api/admin/logs', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('System logs cleared successfully.');
      reloadLogs();
    } catch {
      alert('Failed to clear logs.');
    }
  };

  // Filter logs by level (Info, Warning, Error)
  const filteredLogs = logs.filter((log) => {
    const level = (log.level || 'info').toLowerCase();
    return levelFilter === 'All' || level === levelFilter.toLowerCase();
  });

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1E293B' }}>System Activity & Audit Logs</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>Real-time server terminal telemetry, API requests, and security audits.</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select 
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#F8FAFC',
              fontSize: '13px',
              color: '#0F172A',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Levels</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>

          <button 
            type="button"
            onClick={reloadLogs}
            style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600' }}
          >
            <FontAwesomeIcon icon={faRotate} /> Refresh
          </button>

          <button 
            type="button"
            onClick={handleClearLogs}
            style={{ background: '#FEE2E2', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', color: '#DC2626', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600' }}
          >
            <FontAwesomeIcon icon={faTrash} /> Clear Logs
          </button>
        </div>
      </div>

      {/* Terminal Log Output Window */}
      <div style={{ backgroundColor: '#0F172A', borderRadius: '10px', padding: '16px', fontFamily: 'monospace', fontSize: '13px', color: '#E2E8F0', minHeight: '320px', maxHeight: '500px', overflowY: 'auto' }}>
        {loading ? (
          <p style={{ color: '#94A3B8', textAlign: 'center', padding: '40px' }}>Loading system telemetry...</p>
        ) : filteredLogs.length === 0 ? (
          <p style={{ color: '#94A3B8', textAlign: 'center', padding: '40px' }}>No system logs recorded matching this filter.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredLogs.map((log, index) => {
              const level = (log.level || 'info').toLowerCase();
              const icon = level === 'error' ? faCircleXmark : level === 'warning' ? faTriangleExclamation : faCircleCheck;
              const color = level === 'error' ? '#EF4444' : level === 'warning' ? '#F59E0B' : '#10B981';

              return (
                <div key={log._id || index} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', borderBottom: '1px solid #1E293B', paddingBottom: '8px' }}>
                  <span style={{ color, marginTop: '2px' }}><FontAwesomeIcon icon={icon} /></span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span style={{ fontWeight: 'bold', color: '#F8FAFC' }}>{log.action || log.endpoint || 'SYSTEM_EVENT'}</span>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>{log.timestamp || new Date().toLocaleTimeString()}</span>
                    </div>
                    <p style={{ margin: 0, color: '#94A3B8', fontSize: '12px' }}>{log.message || log.details || 'Operation executed successfully.'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemLogs;