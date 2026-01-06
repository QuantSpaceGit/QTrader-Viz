/**
 * React hook for loading QTrader backtest data
 */

import { useState, useEffect, useCallback } from 'react';
import type {
    BacktestRun,
    ProcessedBacktestData,
} from '../lib/types/qtrader';
import { loadBacktestRun, loadTimeseries } from '../lib/loaders/backtestLoader';
import { processTimelineData } from '../lib/processors/dataProcessor';

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
            // Load manifest, metadata, and performance
            const backtestRun = await loadBacktestRun(runPath);
            setRun(backtestRun);

            // Get strategy ID from metadata
            const strategyId =
                backtestRun.metadata.backtest.strategies[0]?.strategy_id;

            if (strategyId) {
                // Load timeseries data
                const timeline = await loadTimeseries(runPath, strategyId);

                // Process data for charts
                const processed = processTimelineData(
                    timeline,
                    backtestRun.performance.trades
                );
                setProcessedData(processed);
            }
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
