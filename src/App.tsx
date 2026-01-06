import { useState } from 'react';
import { RunSelector } from './components/RunSelector';
import { PriceChart } from './components/PriceChart';
import { EquityChart } from './components/EquityChart';
import { TradesTable } from './components/TradesTable';
import { useBacktestData } from './hooks/useBacktestData';
import { formatPerformanceMetrics } from './lib/processors/dataProcessor';
import './App.css';

function App() {
  const [runPath, setRunPath] = useState('/data/examples/runs/20251224_162255');

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

  const metrics = formatPerformanceMetrics(run.performance);

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>QTrader-Viz</h1>
        </div>

        <RunSelector selectedRun={runPath} onRunChange={setRunPath} />

        {/* Performance Metrics */}
        <section className="sidebar-section">
          <h2>Performance</h2>
          <div className="metrics-compact">
            <div className="metric-row">
              <span className="metric-label">Total Return</span>
              <span className="metric-value positive">
                {metrics.totalReturn.toFixed(2)}%
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-label">CAGR</span>
              <span className="metric-value positive">
                {metrics.cagr.toFixed(2)}%
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Sharpe</span>
              <span className="metric-value">
                {metrics.sharpeRatio.toFixed(2)}
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Max DD</span>
              <span className="metric-value negative">
                -{metrics.maxDrawdown.toFixed(2)}%
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Win Rate</span>
              <span className="metric-value">
                {metrics.winRate.toFixed(2)}%
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Profit Factor</span>
              <span className="metric-value">
                {metrics.profitFactor.toFixed(2)}
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Total Trades</span>
              <span className="metric-value">{metrics.totalTrades}</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Expectancy</span>
              <span className="metric-value">
                ${metrics.expectancy.toFixed(2)}
              </span>
            </div>
          </div>
        </section>

        {/* Run Info */}
        <section className="sidebar-section">
          <h2>Run Info</h2>
          <div className="info-compact">
            <div><strong>Status:</strong> {run.manifest.status}</div>
            <div><strong>Duration:</strong> {run.manifest.metrics.duration_seconds.toFixed(1)}s</div>
            <div><strong>Bars:</strong> {run.manifest.metrics.bars_processed.toLocaleString()}</div>
            <div><strong>Version:</strong> {run.manifest.environment.qtrader_version}</div>
          </div>
        </section>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Charts */}
        <section className="chart-section">
          <h2>Price Chart</h2>
          <PriceChart
            data={processedData.ohlcv}
            signals={processedData.signals}
            indicators={processedData.indicators}
          />
        </section>

        <section className="chart-section">
          <h2>Equity Curve</h2>
          <EquityChart data={processedData.equity} />
        </section>

        {/* Trades Table */}
        <section className="chart-section">
          <h2>Trades ({processedData.trades?.length ?? 0})</h2>
          <TradesTable trades={processedData.trades} />
        </section>
      </main>
    </div>
  );
}

export default App;
