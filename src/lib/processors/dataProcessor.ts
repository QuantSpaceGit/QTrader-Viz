/**
 * Process QTrader chart data into chart-ready formats
 */

import type {
    ChartDataRow,
    OHLCVBar,
    Signal,
    EquityCurvePoint,
    ProcessedBacktestData,
    Performance,
    Trade,
    Drawdown,
} from '../types/qtrader';

/**
 * Process chart data into structured chart data
 */
export function processChartData(
    chartData: ChartDataRow[],
    trades: Trade[],
    equityCurve: EquityCurvePoint[],
    drawdowns: Drawdown[]
): ProcessedBacktestData {
    const ohlcv: OHLCVBar[] = [];
    const signals: Signal[] = [];
    const indicatorMap = new Map<string, Array<{ timestamp: Date; value: number }>>();

    // Process chart data rows
    for (const row of chartData) {
        const timestamp = new Date(row.timestamp);

        // Extract OHLCV data
        if (
            row.open !== null &&
            row.high !== null &&
            row.low !== null &&
            row.close !== null &&
            row.volume !== null
        ) {
            ohlcv.push({
                timestamp,
                open: row.open,
                high: row.high,
                low: row.low,
                close: row.close,
                volume: row.volume,
            });
        }

        // Extract signals
        if (row.signal_intention && row.signal_price !== null) {
            signals.push({
                timestamp,
                intention: row.signal_intention as Signal['intention'],
                price: row.signal_price,
                confidence: row.signal_confidence ?? 0,
                reason: row.signal_reason ?? undefined,
            });
        }
    }

    // Deduplicate consecutive identical signals (same intention on consecutive days)
    const deduplicatedSignals: Signal[] = [];
    for (let i = 0; i < signals.length; i++) {
        if (i === 0 || signals[i].intention !== signals[i - 1].intention) {
            deduplicatedSignals.push(signals[i]);
        }
    }

    // Extract indicators from additional rows (rows without OHLCV but with ticker containing '(')
    const indicatorRows = chartData.filter(
        row => row.ticker.includes('(') && row.close !== null
    );

    for (const row of indicatorRows) {
        const indicatorName = row.ticker;
        if (!indicatorMap.has(indicatorName)) {
            indicatorMap.set(indicatorName, []);
        }
        indicatorMap.get(indicatorName)!.push({
            timestamp: new Date(row.timestamp),
            value: row.close!,
        });
    }

    const indicators = Array.from(indicatorMap.entries()).map(([name, data]) => ({
        name,
        data,
    }));

    // Process equity curve to match expected format
    const equity: EquityCurvePoint[] = equityCurve.map(point => ({
        timestamp: point.timestamp,
        equity: point.equity,
        cash: point.cash,
        positions_value: point.positions_value,
    }));

    return {
        ohlcv,
        signals: deduplicatedSignals,
        equity,
        indicators,
        trades,
        drawdowns,
    };
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
        avgWin: parseFloat(performance.avg_win),
        avgLoss: parseFloat(performance.avg_loss),
        largestWin: parseFloat(performance.largest_win),
        largestLoss: parseFloat(performance.largest_loss),
        expectancy: parseFloat(performance.expectancy),
        maxConsecutiveWins: performance.max_consecutive_wins,
        maxConsecutiveLosses: performance.max_consecutive_losses,
        avgTradeDuration: parseFloat(performance.avg_trade_duration_days),
    };
}
