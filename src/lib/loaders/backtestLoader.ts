/**
 * QTrader Backtest Data Loader
 * Loads and parses QTrader run data from local files
 */

import type {
    RunManifest,
    Metadata,
    Performance,
    ChartDataRow,
    Trade,
    EquityCurvePoint,
    Drawdown,
    BacktestRun,
} from '../types/qtrader';

/**
 * Load a complete backtest run from a directory
 */
export async function loadBacktestRun(runPath: string): Promise<BacktestRun> {
    const [manifest, metadata, performance] = await Promise.all([
        loadManifest(runPath),
        loadMetadata(runPath),
        loadPerformance(runPath),
    ]);

    return {
        manifest,
        metadata,
        performance,
    };
}

/**
 * Load run manifest
 */
export async function loadManifest(runPath: string): Promise<RunManifest> {
    const response = await fetch(`${runPath}/manifest.json`);
    if (!response.ok) {
        throw new Error(`Failed to load manifest: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Load metadata
 */
export async function loadMetadata(runPath: string): Promise<Metadata> {
    const response = await fetch(`${runPath}/metadata.json`);
    if (!response.ok) {
        throw new Error(`Failed to load metadata: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Load performance metrics
 */
export async function loadPerformance(runPath: string): Promise<Performance> {
    const response = await fetch(`${runPath}/performance.json`);
    if (!response.ok) {
        throw new Error(`Failed to load performance: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Load trades from JSON file
 */
export async function loadTrades(runPath: string): Promise<Trade[]> {
    const response = await fetch(`${runPath}/timeseries/trades.json`);
    if (!response.ok) {
        throw new Error(`Failed to load trades: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Load chart data from JSON file
 */
export async function loadChartData(runPath: string): Promise<ChartDataRow[]> {
    const response = await fetch(`${runPath}/timeseries/chart_data.json`);
    if (!response.ok) {
        throw new Error(`Failed to load chart data: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Load equity curve from JSON file
 */
export async function loadEquityCurve(runPath: string): Promise<EquityCurvePoint[]> {
    const response = await fetch(`${runPath}/timeseries/equity_curve.json`);
    if (!response.ok) {
        throw new Error(`Failed to load equity curve: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Load drawdowns from JSON file
 */
export async function loadDrawdowns(runPath: string): Promise<Drawdown[]> {
    const response = await fetch(`${runPath}/timeseries/drawdowns.json`);
    if (!response.ok) {
        throw new Error(`Failed to load drawdowns: ${response.statusText}`);
    }
    return response.json();
}

/**
 * List available runs in a directory
 */
export async function listAvailableRuns(): Promise<string[]> {
    // This would need to be implemented based on how files are served
    // For now, returns empty array - will be populated by user selection
    return [];
}
