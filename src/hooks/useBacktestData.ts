/**
 * React hook for loading QTrader backtest data
 */

import { useState, useEffect, useCallback } from 'react';
import type {
    BacktestRun,
    ProcessedBacktestData,
} from '../lib/types/qtrader';
import {
    loadBacktestRun,
    loadChartData,
    loadTrades,
    loadEquityCurve,
    loadDrawdowns
} from '../lib/loaders/backtestLoader';
import { processChartData } from '../lib/processors/dataProcessor';

interface UseBacktestDataOptions {
    runPath: string;
    autoLoad?: boolean;
}

interface UseBacktestDataReturn {
    run: BacktestRun | null;
    processedData: ProcessedBacktestData | null;
    loading: boolean;
    error: Error | null;
    reload: () => Promise<void>;
}

export function useBacktestData({
    runPath,
    autoLoad = true,
}: UseBacktestDataOptions): UseBacktestDataReturn {
    const [run, setRun] = useState<BacktestRun | null>(null);
    const [processedData, setProcessedData] =
        useState<ProcessedBacktestData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadData = useCallback(async () => {
        if (!runPath) return;

        setLoading(true);
        setError(null);

        try {
            // Load all data in parallel
            const [backtestRun, chartData, trades, equityCurve, drawdowns] = await Promise.all([
                loadBacktestRun(runPath),
                loadChartData(runPath),
                loadTrades(runPath),
                loadEquityCurve(runPath),
                loadDrawdowns(runPath),
            ]);

            setRun(backtestRun);

            // Process data for charts
            const processed = processChartData(chartData, trades, equityCurve, drawdowns);
            setProcessedData(processed);
        } catch (err) {
            setError(
                err instanceof Error ? err : new Error('Failed to load backtest data')
            );
        } finally {
            setLoading(false);
        }
    }, [runPath]);

    useEffect(() => {
        if (autoLoad) {
            loadData();
        }
    }, [autoLoad, loadData]);

    return {
        run,
        processedData,
        loading,
        error,
        reload: loadData,
    };
}
