import React, { useState } from 'react';
import { initialInputs, InputState } from '../valuation/inputs';
import { computeAnalysis } from '../valuation/engine';
import { ResultsView } from './ResultsView';
import { buildCsv, downloadCsv } from '../util/csv';
import { InputsForm } from './InputsForm';

export const App: React.FC = () => {
  const [inputs, setInputs] = useState<InputState>(initialInputs);
  const analysis = computeAnalysis(inputs);
  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Rental Property Analyzer</h1>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => {
            const csv = buildCsv(analysis.cash.yearly as any, analysis.financed.yearly as any);
            downloadCsv('analysis.csv', csv);
          }}
          className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700">
          Export CSV
        </button>
      </div>
      <InputsForm value={inputs} onChange={setInputs} />
      <ResultsView analysis={analysis} />
    </div>
  );
};
