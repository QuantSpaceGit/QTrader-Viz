/**
 * QTrader Data Type Definitions
 * Based on actual QTrader run output schema
 */

export interface RunManifest {
    experiment_id: string;
    run_id: string;
    started_at: string;
    finished_at: string;
    status: 'success' | 'failed' | 'running';
    config_sha256: string;
    git: {
        commit: string;
        branch: string;
        dirty: boolean;
        diff_files_count: number;
    };
    environment: {
        python_version: string;
        qtrader_version: string;
        packages: Record<string, string>;
    };
    metrics: {
        bars_processed: number;
        duration_seconds: number;
    };
    error: string | null;
}

export interface Metadata {
    metadata_version: string;
    generated_at: string;
    backtest: {
        backtest_id: string;
        start_date: string;
        end_date: string;
        initial_equity: string;
        replay_speed: number;
        display_events: string[];
        data: {
            sources: Array<{
                name: string;
                universe: string[];
            }>;
        };
        strategies: Array<{
            strategy_id: string;
            universe: string[];
            data_sources: string[];
            config: Record<string, unknown>;
        }>;
        risk_policy: {
            name: string;
            config: Record<string, unknown>;
        };
        strategy_adjustment_mode: string;
        portfolio_adjustment_mode: string;
        reporting: {
            emit_metrics_events: boolean;
            event_frequency: number;
            risk_free_rate: number;
            max_equity_points: number;
        };
    };
}

export interface Performance {
    backtest_id: string;
    start_date: string;
    end_date: string;
    duration_days: number;
    initial_equity: string;
    final_equity: string;
    total_return_pct: string;
    cagr: string;
    best_day_return_pct: string;
    worst_day_return_pct: string;
    volatility_annual_pct: string;
    max_drawdown_pct: string;
    max_drawdown_duration_days: number;
    avg_drawdown_pct: string;
    current_drawdown_pct: string;
    sharpe_ratio: string;
    sortino_ratio: string;
    calmar_ratio: string;
    risk_free_rate: string;
    total_trades: number;
    winning_trades: number;
    losing_trades: number;
    win_rate: string;
    profit_factor: string;
    avg_win: string;
    avg_loss: string;
    avg_win_pct: string;
    avg_loss_pct: string;
    largest_win: string;
    largest_loss: string;
    largest_win_pct: string;
    largest_loss_pct: string;
    expectancy: string;
    max_consecutive_wins: number;
    max_consecutive_losses: number;
    avg_trade_duration_days: string;
    total_commissions: string;
    commission_pct_of_pnl: string;
    monthly_returns: Array<{
        period: string;
        period_type: string;
        start_date: string;
        end_date: string;
        start_equity: string;
        end_equity: string;
        return_pct: string;
        num_trades: number;
        winning_trades: number;
        losing_trades: number;
    }>;
    yearly_returns?: Array<{
        period: string;
        period_type: string;
        start_date: string;
        end_date: string;
        start_equity: string;
        end_equity: string;
        return_pct: string;
        num_trades: number;
        winning_trades: number;
        losing_trades: number;
    }>;
    trades?: Array<{
        trade_id: string;
        strategy_id: string;
        symbol: string;
        side: string;
        entry_timestamp: string;
        exit_timestamp: string;
        entry_price: string;
        exit_price: string;
        quantity: string;
        realized_pnl: string;
        realized_pnl_pct: string;
        duration_days: number;
        commission: string;
    }>;
}

export interface TimelineRow {
    timestamp: string;
    strategy_id: string;
    ticker: string;
    underlying: string;
    open: number | null;
    high: number | null;
    low: number | null;
    close: number | null;
    volume: number | null;
    signal_intention: string | null;
    signal_price: number | null;
    signal_confidence: number | null;
    signal_reason: string | null;
    signal_event_id: string | null;
    signal_correlation_id: string | null;
    signal_causation_id: string | null;
    signal_source_service: string | null;
    order_id: string | null;
    order_side: string | null;
    order_type: string | null;
    order_qty: number | null;
    order_timestamp: string | null;
    order_event_id: string | null;
    order_correlation_id: string | null;
    order_causation_id: string | null;
    order_source_service: string | null;
    fill_id: string | null;
    fill_side: string | null;
    fill_qty: number | null;
    fill_price: number | null;
    fill_slippage_bps: number | null;
    fill_timestamp: string | null;
    commission: number | null;
    fill_event_id: string | null;
    fill_correlation_id: string | null;
    fill_causation_id: string | null;
    fill_source_service: string | null;
    trade_id: string | null;
    trade_status: string | null;
    trade_side: string | null;
    trade_entry_price: number | null;
    trade_exit_price: number | null;
    trade_realized_pnl: number | null;
}

export interface BacktestRun {
    manifest: RunManifest;
    metadata: Metadata;
    performance: Performance;
    timeseries?: TimelineRow[];
}

export interface OHLCVBar {
    timestamp: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export interface Signal {
    timestamp: Date;
    intention: 'BUY' | 'SELL' | 'OPEN_LONG' | 'CLOSE_LONG' | 'OPEN_SHORT' | 'CLOSE_SHORT';
    price: number;
    confidence: number;
    reason?: string;
}

export interface EquityPoint {
    timestamp: Date;
    equity: number;
}

export interface Indicator {
    name: string;
    data: Array<{ timestamp: Date; value: number }>;
}

export interface ProcessedBacktestData {
    ohlcv: OHLCVBar[];
    signals: Signal[];
    equity: EquityPoint[];
    indicators: Indicator[];
    trades: Performance['trades'];
}
