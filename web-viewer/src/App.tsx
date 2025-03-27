import React, { useEffect, useState } from 'react';
import './App.css';

interface ToolStats {
  totalCalls: number;
  errorRate: number;
  byTool: Array<{
    tool_name: string;
    count: number;
    avg_duration: number;
  }>;
}

interface ResourceStats {
  totalRequests: number;
  errorRate: number;
  byResource: Array<{
    resource_name: string;
    count: number;
    avg_duration: number;
  }>;
}

interface DailyStats {
  day: string;
  tool_name: string;
  calls: number;
  avg_duration: number;
  error_count: number;
}

interface TopTool {
  tool_name: string;
  count: number;
  avg_duration: number;
  error_count?: number;
  total_calls?: number;
  error_rate?: number;
}

function App() {
  const [stats, setStats] = useState<{ toolStats: ToolStats; resourceStats: ResourceStats } | null>(null);
  const [topTools, setTopTools] = useState<TopTool[]>([]);
  const [slowestTools, setSlowestTools] = useState<TopTool[]>([]);
  const [errorProneTools, setErrorProneTools] = useState<any[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, topToolsRes, slowestToolsRes, errorProneToolsRes, dailyStatsRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/tools/top'),
          fetch('/api/tools/slowest'),
          fetch('/api/tools/error-prone'),
          fetch('/api/tools/daily')
        ]);

        const [statsData, topToolsData, slowestToolsData, errorProneToolsData, dailyStatsData] = await Promise.all([
          statsRes.json(),
          topToolsRes.json(),
          slowestToolsRes.json(),
          errorProneToolsRes.json(),
          dailyStatsRes.json()
        ]);

        setStats(statsData);
        setTopTools(topToolsData);
        setSlowestTools(slowestToolsData);
        setErrorProneTools(errorProneToolsData);
        setDailyStats(dailyStatsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  return (
    <div className="app">
      <header>
        <h1>MCP Analytics Dashboard</h1>
      </header>

      <main>
        <section className="overview">
          <h2>Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Tool Calls</h3>
              <p>{stats?.toolStats.totalCalls || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Tool Error Rate</h3>
              <p className="error-rate">
                {stats?.toolStats.errorRate?.toFixed(2) || '0'}%
              </p>
            </div>
            <div className="stat-card">
              <h3>Total Resource Requests</h3>
              <p>{stats?.resourceStats.totalRequests || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Resource Error Rate</h3>
              <p className="error-rate">
                {stats?.resourceStats.errorRate?.toFixed(2) || '0'}%
              </p>
            </div>
          </div>
        </section>

        <section className="tools">
          <h2>Top Tools</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Tool</th>
                  <th>Calls</th>
                  <th>Avg Duration</th>
                  <th>Error Rate</th>
                </tr>
              </thead>
              <tbody>
                {topTools.map((tool, index) => {
                  // Since topTools doesn't include error info, use the overall error rate or 0
                  // We could fetch the error rate per tool in the future if needed
                  return (
                    <tr key={index}>
                      <td>{tool.tool_name}</td>
                      <td>{tool.count}</td>
                      <td>{tool.avg_duration.toFixed(2)}ms</td>
                      <td className="error-rate">
                        {tool.error_rate !== undefined 
                          ? tool.error_rate.toFixed(2) 
                          : tool.error_count !== undefined && tool.total_calls 
                            ? ((tool.error_count / tool.total_calls) * 100).toFixed(2)
                            : '0.00'}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="daily">
          <h2>Daily Usage</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Tool</th>
                  <th>Calls</th>
                  <th>Avg Duration</th>
                  <th>Error Rate</th>
                </tr>
              </thead>
              <tbody>
                {dailyStats.map((stat, index) => (
                  <tr key={index}>
                    <td>{stat.day}</td>
                    <td>{stat.tool_name}</td>
                    <td>{stat.calls}</td>
                    <td>{stat.avg_duration.toFixed(2)}ms</td>
                    <td className="error-rate">
                      {((stat.error_count / stat.calls) * 100).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App; 
