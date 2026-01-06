/**
 * Process QTrader timeline data into chart-ready formats
 */

import type {
    TimelineRow,
    OHLCVBar,
    Signal,
    EquityPoint,
    ProcessedBacktestData,
    Performance,
} from '../types/qtrader';

/**
 * Process timeline data into structured chart data
 */
export function processTimelineData(
    timeline: TimelineRow[],
    trades?: Performance['trades']
): ProcessedBacktestData {
    const ohlcv: OHLCVBar[] = [];
    const signals: Signal[] = [];
    const equity: EquityPoint[] = [];
    const indicatorMap = new Map<string, Array<{ timestamp: Date; value: number }>>();

    for (const row of timeline) {
        const timestamp = new Date(row.timestamp);

        // Extract OHLCV data (for actual securities, not portfolio metrics)
        if (
            row.ticker !== 'EQUITY' &&
            row.ticker !== 'CASH' &&
            row.ticker !== 'POSITIONS_VALUE' &&
            !row.ticker.includes('SHARPE') &&
            !row.ticker.includes('SORTINO') &&
            !row.ticker.includes('DRAWDOWN') &&
            !row.ticker.includes('CAGR') &&
            !row.ticker.includes('CALMAR') &&
            !row.ticker.includes('EXPECTANCY') &&
            row.open !== null &&
            row.high !== null &&
            row.low !== null &&
            row.close !== null
        ) {
            ohlcv.push({
                timestamp,
                open: row.open,
                high: row.high,
                low: row.low,
                close: row.close,
                volume: row.volume ?? 0,
            });
        }

        // Extract signals
        if (row.signal_intention && row.signal_price !== null) {
            signals.push({
                timestamp,
                intention: row.signal_intention as 'BUY' | 'SELL',
                price: row.signal_price,
                confidence: row.signal_confidence ?? 1.0,
                reason: row.signal_reason ?? undefined,
            });
        }

        // Extract equity curve
        if (row.ticker === 'EQUITY' && row.close !== null) {
            equity.push({
                timestamp,
                equity: row.close,
            });
        }

        // Extract indicators (any ticker that's not a security or portfolio metric)
        if (
            row.ticker !== 'EQUITY' &&
            row.ticker !== 'CASH' &&
            row.ticker !== 'POSITIONS_VALUE' &&
            row.ticker !== 'SHARPE' &&
            row.ticker !== 'SORTINO' &&
            row.ticker !== 'CURRENT_DRAWDOWN' &&
            row.ticker !== 'CAGR' &&
            row.ticker !== 'CALMAR' &&
            row.ticker !== 'EXPECTANCY' &&
            row.ticker !== 'PROFIT_FACTOR' &&
            row.close !== null &&
            (row.ticker.includes('(') || row.ticker.includes('_IND') || row.ticker.toUpperCase() !== row.ticker.split('_')[0])
        ) {
            // Check if this ticker is an indicator (contains parentheses like SMA(20) or has indicator pattern)
            const isIndicator = row.ticker.includes('(') || row.ticker.endsWith('_IND');

            if (isIndicator || (row.ticker !== row.underlying && row.underlying !== 'PORTFOLIO')) {
                if (!indicatorMap.has(row.ticker)) {
                    indicatorMap.set(row.ticker, []);
                }
                indicatorMap.get(row.ticker)!.push({
                    timestamp,
                    value: row.close,
                });
            }
        }
    }

    // Convert indicator map to array
    const indicators = Array.from(indicatorMap.entries()).map(([name, data]) => ({
        name,
        data,
    }));

    return {
        ohlcv,
        signals,
        equity,
        indicators,
        trades: trades ?? [],
    };
}

/**
 * Extract portfolio metrics timeline from timeline data
 */
export function extractPortfolioMetrics(timeline: TimelineRow[]) {
    const metrics: Record<
        string,
        Array<{ timestamp: Date; value: number }>
    > = {
        equity: [],
        cash: [],
        positions_value: [],
        sharpe: [],
        sortino: [],
        current_drawdown: [],
        cagr: [],
        calmar: [],
        expectancy: [],
    };

    for (const row of timeline) {
        const timestamp = new Date(row.timestamp);

        if (row.close === null) continue;

        switch (row.ticker) {
            case 'EQUITY':
                metrics.equity.push({ timestamp, value: row.close });
                break;
            case 'CASH':
                metrics.cash.push({ timestamp, value: row.close });
                break;
            case 'POSITIONS_VALUE':
                metrics.positions_value.push({ timestamp, value: row.close });
                break;
            case 'SHARPE':
                metrics.sharpe.push({ timestamp, value: row.close });
                break;
            case 'SORTINO':
                metrics.sortino.push({ timestamp, value: row.close });
                break;
            case 'CURRENT_DRAWDOWN':
                metrics.current_drawdown.push({ timestamp, value: row.close });
                break;
            case 'CAGR':
                metrics.cagr.push({ timestamp, value: row.close });
                break;
            case 'CALMAR':
                metrics.calmar.push({ timestamp, value: row.close });
                break;
            case 'EXPECTANCY':
                metrics.expectancy.push({ timestamp, value: row.close });
                break;
        }
    }

    return metrics;
}

/**
 * Calculate drawdown series from equity curve
 */
export function calculateDrawdown(
    equity: EquityPoint[]
): Array<{ timestamp: Date; drawdown: number }> {
    const drawdowns: Array<{ timestamp: Date; drawdown: number }> = [];
    let peak = 0;

    for (const point of equity) {
        peak = Math.max(peak, point.equity);
        const drawdown = peak > 0 ? (point.equity - peak) / peak : 0;
        drawdowns.push({
            timestamp: point.timestamp,
            drawdown: drawdown * 100, // Convert to percentage
        });
    }

    return drawdowns;
}

/**
 * Format performance metrics for display
 */
export function formatPerformanceMetrics(performance: Performance) {
    return {
        totalReturn: parseFloat(performance.total_return_pct),
        cagr: parseFloat(performance.cagr),
        sharpeRatio: parseFloat(performance.sharpe_ratio),
        sortinoRatio: parseFloat(performance.sortino_ratio),
        calmarRatio: parseFloat(performance.calmar_ratio),
        maxDrawdown: parseFloat(performance.max_drawdown_pct),
        volatility: parseFloat(performance.volatility_annual_pct),
        winRate: parseFloat(performance.win_rate),
        profitFactor: parseFloat(performance.profit_factor),
        totalTrades: performance.total_trades,
        winningTrades: performance.winning_trades,
        losingTrades: performance.losing_trades,
        expectancy: parseFloat(performance.expectancy),
        avgWin: parseFloat(performance.avg_win),
        avgLoss: parseFloat(performance.avg_loss),
        largestWin: parseFloat(performance.largest_win),
        largestLoss: parseFloat(performance.largest_loss),
    };
}
