import React, { useState } from 'react';
import { initialInputs, InputState } from '../valuation/inputs';
import { computeAnalysis } from '../valuation/engine';
import { ResultsView } from './ResultsView';
import { InputsForm } from './InputsForm';
import { AuthForm } from './AuthForm';
import { PropertyManager } from './PropertyManager';
import { OptimizationPanel } from './OptimizationPanel';
import { buildCsv, downloadCsv } from '../util/csv';
import { useAuth } from '../auth/AuthContext';
import { optimizeFinancing, getOptimizationRecommendation } from '../valuation/optimizer';

export const App: React.FC = () => {
  const { isAuthenticated, user, signOut } = useAuth();
  const [inputs, setInputs] = useState<InputState>(initialInputs);
  const analysis = computeAnalysis(inputs);
  const optimization = optimizeFinancing(inputs);
  const recommendation = getOptimizationRecommendation(optimization);

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Rental Property Analyzer</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
          <button
            onClick={signOut}
            className="bg-gray-600 text-white text-sm px-3 py-1 rounded hover:bg-gray-700"
          >
            Sign Out
          </button>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <PropertyManager
            userId={user!.id}
            currentInputs={inputs}
            onLoadProperty={setInputs}
          />
        </div>
        
        <div className="lg:col-span-3 space-y-6">
          <OptimizationPanel
            optimization={optimization}
            recommendation={recommendation}
            onApplyOptimal={(loanPercent) => setInputs({ ...inputs, loanPercent })}
          />
          
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
      </div>
    </div>
  );
};
