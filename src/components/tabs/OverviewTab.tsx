/**
 * Overview tab - All performance metrics and charts
 */

import { EquityChart } from '../EquityChart';
import { PriceChart } from '../PriceChart';
import { MonthlyReturnsHeatmap } from '../MonthlyReturnsHeatmap';
import type { ProcessedBacktestData, Performance } from '../../lib/types/qtrader';

interface OverviewTabProps {
    data: ProcessedBacktestData;
    performance: Performance;
}

export function OverviewTab({ data, performance }: OverviewTabProps) {
    return (
        <div className="tab-content">
            {/* Returns Metrics */}
            <h3 style={{ marginTop: 0, marginBottom: '12px', color: '#888', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Returns</h3>
            <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                <div className="metric-card positive">
                    <div className="metric-label">Total Return</div>
                    <div className="metric-value">{parseFloat(performance.total_return_pct).toFixed(2)}%</div>
                </div>
                <div className="metric-card positive">
                    <div className="metric-label">CAGR</div>
                    <div className="metric-value">{parseFloat(performance.cagr).toFixed(2)}%</div>
                </div>
                <div className="metric-card positive">
                    <div className="metric-label">Best Day</div>
                    <div className="metric-value">{(parseFloat(performance.best_day_return_pct) * 100).toFixed(2)}%</div>
                </div>
                <div className="metric-card negative">
                    <div className="metric-label">Worst Day</div>
                    <div className="metric-value">{(parseFloat(performance.worst_day_return_pct) * 100).toFixed(2)}%</div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Expectancy</div>
                    <div className="metric-value">${parseFloat(performance.expectancy).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                </div>
            </div>

            {/* Risk Metrics */}
            <h3 style={{ marginTop: '24px', marginBottom: '12px', color: '#888', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Risk</h3>
            <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                <div className="metric-card negative">
                    <div className="metric-label">Max Drawdown</div>
                    <div className="metric-value">-{parseFloat(performance.max_drawdown_pct).toFixed(2)}%</div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Max DD Duration</div>
                    <div className="metric-value">{performance.max_drawdown_duration_days} days</div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Avg Drawdown</div>
                    <div className="metric-value">{parseFloat(performance.avg_drawdown_pct).toFixed(2)}%</div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Volatility (Annual)</div>
                    <div className="metric-value">{parseFloat(performance.volatility_annual_pct).toFixed(2)}%</div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Sharpe Ratio</div>
                    <div className="metric-value">{parseFloat(performance.sharpe_ratio).toFixed(2)}</div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Sortino Ratio</div>
                    <div className="metric-value">{parseFloat(performance.sortino_ratio).toFixed(2)}</div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Calmar Ratio</div>
                    <div className="metric-value">{parseFloat(performance.calmar_ratio).toFixed(2)}</div>
                </div>
            </div>

            {/* Trading Performance */}
            <h3 style={{ marginTop: '24px', marginBottom: '12px', color: '#888', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Trading Performance</h3>
            <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                <div className="metric-card">
                    <div className="metric-label">Total Trades</div>
                    <div className="metric-value">{performance.total_trades}</div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Win Rate</div>
                    <div className="metric-value">{parseFloat(performance.win_rate).toFixed(2)}%</div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Profit Factor</div>
                    <div className="metric-value">{parseFloat(performance.profit_factor).toFixed(2)}</div>
                </div>
                <div className="metric-card positive">
                    <div className="metric-label">Avg Win</div>
                    <div className="metric-value">{parseFloat(performance.avg_win_pct).toFixed(2)}%</div>
                </div>
                <div className="metric-card negative">
                    <div className="metric-label">Avg Loss</div>
                    <div className="metric-value">{parseFloat(performance.avg_loss_pct).toFixed(2)}%</div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Duration</div>
                    <div className="metric-value">{performance.duration_days} days</div>
                </div>
            </div>

            {/* Price Chart with Indicators and Signals */}
            <section className="chart-section">
                <h2>Price & Signals</h2>
                <PriceChart
                    data={data.ohlcv}
                    indicators={data.indicators}
                    signals={data.signals}
                />
            </section>

            {/* Equity Curve */}
            <section className="chart-section">
                <h2>Equity Curve</h2>
                <EquityChart data={data.equity} />
            </section>

            {/* Monthly Returns Heatmap */}
            <section className="chart-section">
                <MonthlyReturnsHeatmap returns={performance.monthly_returns} />
            </section>
        </div>
    );
}
