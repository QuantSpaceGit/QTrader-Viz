import { useState } from 'react';
import { RunSelector } from './components/RunSelector';
import { TabNavigation, type TabId } from './components/TabNavigation';
import { OverviewTab } from './components/tabs/OverviewTab';
import { TradesTab } from './components/tabs/TradesTab';
import { DrawdownsTab } from './components/tabs/RiskTab';
import { useBacktestData } from './hooks/useBacktestData';
import './App.css';

function App() {
  const [runPath, setRunPath] = useState('/data/runs/20260107_144852');
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const { run, processedData, loading, error } = useBacktestData({
    runPath,
    autoLoad: true,
  });

  if (loading) {
    return (
      <div className="app-container">
        <h1>QTrader-Viz</h1>
        <div className="loading">Loading backtest data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <h1>QTrader-Viz</h1>
        <div className="error">
          <h2>Error Loading Data</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  if (!run || !processedData) {
    return (
      <div className="app-container">
        <h1>QTrader-Viz</h1>
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="app-layout">
      {/* Sidebar with Configuration */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>QTrader-Viz</h1>
        </div>

        <RunSelector selectedRun={runPath} onRunChange={setRunPath} />

        {/* Configuration */}
        <section className="sidebar-section">
          <h2>Metadata</h2>
          <div className="info-compact">
            <div><strong>Strategy ID:</strong> {run.metadata.backtest.strategies[0].strategy_id}</div>
            <div><strong>Backtest ID:</strong> {run.metadata.backtest.backtest_id}</div>
            <div><strong>Universe:</strong> {run.metadata.backtest.strategies[0].universe.join(', ')}</div>
            {Object.entries(run.metadata.backtest.strategies[0].config).map(([key, value]) => (
              <div key={key}>
                <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {String(value)}
              </div>
            ))}
            <div><strong>Data Source:</strong> {run.metadata.backtest.data.sources[0].name}</div>
            <div><strong>Risk Policy:</strong> {run.metadata.backtest.risk_policy.name}</div>
          </div>
        </section>

        {/* Backtest Settings */}
        <section className="sidebar-section">
          <h2>Settings</h2>
          <div className="info-compact">
            <div><strong>Period:</strong> {run.performance.start_date} to {run.performance.end_date}</div>
            <div><strong>Initial Capital:</strong> ${parseFloat(run.performance.initial_equity).toLocaleString()}</div>
            <div><strong>Final Equity:</strong> ${parseFloat(run.performance.final_equity).toLocaleString()}</div>
            <div><strong>Strategy Adj:</strong> {run.metadata.backtest.strategy_adjustment_mode}</div>
            <div><strong>Portfolio Adj:</strong> {run.metadata.backtest.portfolio_adjustment_mode}</div>
          </div>
        </section>

        {/* Run Info */}
        <section className="sidebar-section">
          <h2>Run Info</h2>
          <div className="info-compact">
            <div><strong>Status:</strong> {run.manifest.status}</div>
            <div><strong>Run ID:</strong> {run.manifest.run_id}</div>
            <div><strong>Duration:</strong> {run.manifest.metrics.duration_seconds.toFixed(1)}s</div>
            <div><strong>Bars:</strong> {run.manifest.metrics.bars_processed.toLocaleString()}</div>
            {run.manifest.git && (
              <>
                <div><strong>Branch:</strong> {run.manifest.git.branch}</div>
                <div><strong>Commit:</strong> {run.manifest.git.commit.substring(0, 7)}</div>
              </>
            )}
          </div>
        </section>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'overview' && (
          <OverviewTab data={processedData} performance={run.performance} />
        )}
        {activeTab === 'trades' && (
          <TradesTab data={processedData} />
        )}
        {activeTab === 'drawdowns' && (
          <DrawdownsTab data={processedData} performance={run.performance} />
        )}
      </main>
    </div>
  );
}

export default App;