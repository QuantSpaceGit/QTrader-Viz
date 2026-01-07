/**
 * Run selector component for choosing backtest runs
 */

import { useState } from 'react';

interface RunInfo {
    id: string;
    path: string;
    displayName: string;
}

interface RunSelectorProps {
    selectedRun: string;
    onRunChange: (runPath: string) => void;
}

// Available runs - in production, this could be fetched from an API
const AVAILABLE_RUNS: RunInfo[] = [
    {
        id: '20260107_144852',
        path: '/data/runs/20260107_144852',
        displayName: '2026-01-07 14:48:52 - Latest',
    },
];

export function RunSelector({ selectedRun, onRunChange }: RunSelectorProps) {
    const [runs] = useState<RunInfo[]>(AVAILABLE_RUNS);

    return (
        <div className="run-selector">
            <label htmlFor="run-select">Select Run:</label>
            <select
                id="run-select"
                value={selectedRun}
                onChange={(e) => onRunChange(e.target.value)}
                className="run-select"
            >
                {runs.map((run) => (
                    <option key={run.id} value={run.path}>
                        {run.displayName}
                    </option>
                ))}
            </select>
        </div>
    );
}
