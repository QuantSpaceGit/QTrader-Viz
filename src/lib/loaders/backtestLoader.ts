/**
 * QTrader Backtest Data Loader
 * Loads and parses QTrader run data from local files
 */

import type {
    RunManifest,
    Metadata,
    Performance,
    TimelineRow,
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
    const response = await fetch(`${runPath}/run_manifest.json`);
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
 * Load timeseries CSV data
 * Note: This is a basic CSV parser. For production, consider using Papa Parse or similar
 */
export async function loadTimeseries(
    runPath: string,
    strategyId: string
): Promise<TimelineRow[]> {
    const response = await fetch(
        `${runPath}/timeseries/timeline_${strategyId}.csv`
    );
    if (!response.ok) {
        throw new Error(`Failed to load timeseries: ${response.statusText}`);
    }

    const csvText = await response.text();
    return parseTimelineCSV(csvText);
}

/**
 * Parse timeline CSV into typed rows
 */
function parseTimelineCSV(csvText: string): TimelineRow[] {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',');
    const rows: TimelineRow[] = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const row: Record<string, string | number | null> = {};

        headers.forEach((header, index) => {
            const value = values[index]?.trim();
            row[header] = value === '' ? null : parseValue(value);
        });

        rows.push(row as unknown as TimelineRow);
    }

    return rows;
}

/**
 * Parse a CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current);
    return result;
}

/**
 * Parse a value to appropriate type
 */
function parseValue(value: string): string | number {
    if (value === '') return '';

    // Try parsing as number
    const num = Number(value);
    if (!isNaN(num)) return num;

    return value;
}

/**
 * List available runs in a directory
 */
export async function listAvailableRuns(): Promise<string[]> {
    // This would need to be implemented based on how files are served
    // For now, returns empty array - will be populated by user selection
    return [];
}
