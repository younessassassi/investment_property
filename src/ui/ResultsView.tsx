import React from 'react';
import { AnalysisResult, YearResultFinanced, YearResultBase } from '../valuation/engine';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const ResultsView: React.FC<{ analysis: AnalysisResult }> = ({ analysis }) => {
  const { cash, financed } = analysis;
  const chartData = cash.yearly.map((c, idx) => {
    const f = financed.yearly[idx] as YearResultFinanced;
    return {
      year: c.year,
      cashCF: c.afterTaxCashFlow,
      finCF: f.afterTaxCashFlow,
      loanBalance: f.loanBalance,
      cumCashCF: cash.yearly.slice(0, idx+1).reduce((a,b)=>a+b.afterTaxCashFlow,0),
      cumFinCF: financed.yearly.slice(0, idx+1).reduce((a,b)=>a+b.afterTaxCashFlow,0),
    };
  });
  return (
    <div className="space-y-6">
      {financed.yearly.some(y=>y.afterTaxCashFlow < 0) && (
        <div className="p-2 text-sm bg-yellow-100 border border-yellow-300 text-yellow-800 rounded">Warning: Negative after-tax cash flow detected in financed scenario.</div>
      )}
      <div className="grid md:grid-cols-2 gap-6">
        <SummaryCard title="Cash Scenario" irr={cash.irr} total={cash.totalWealth} />
        <SummaryCard title="Financed Scenario" irr={financed.irr} total={financed.totalWealth} />
      </div>
      <div className="h-80 bg-white p-4 rounded shadow">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cumCashCF" stroke="#16a34a" name="Cumulative Cash CF" />
            <Line type="monotone" dataKey="cumFinCF" stroke="#2563eb" name="Cumulative Fin CF" />
            <Line type="monotone" dataKey="loanBalance" stroke="#dc2626" name="Loan Balance" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <TableView cash={cash.yearly} fin={financed.yearly as YearResultFinanced[]} />
    </div>
  );
};

const SummaryCard: React.FC<{ title: string; irr: number | null; total: number; }> = ({ title, irr, total }) => (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="font-semibold mb-2">{title}</h2>
    <p>IRR: {irr !== null ? (irr*100).toFixed(2)+ '%' : 'n/a'}</p>
    <p>Total Wealth: {total.toLocaleString(undefined,{maximumFractionDigits:0})}</p>
  </div>
);

const TableView: React.FC<{ cash: YearResultBase[]; fin: YearResultFinanced[]; }> = ({ cash, fin }) => (
  <div className="overflow-auto bg-white rounded shadow">
    <table className="min-w-full text-xs">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">Year</th>
          <th className="p-2 text-right">Rent</th>
          <th className="p-2 text-right">Expenses</th>
          <th className="p-2 text-right">NOI Cash</th>
          <th className="p-2 text-right">NOI Fin</th>
          <th className="p-2 text-right">Depreciation</th>
          <th className="p-2 text-right">Taxable Cash</th>
          <th className="p-2 text-right">Taxable Fin</th>
          <th className="p-2 text-right">AfterTax CF Cash</th>
          <th className="p-2 text-right">AfterTax CF Fin</th>
          <th className="p-2 text-right">Loan Balance</th>
        </tr>
      </thead>
      <tbody>
        {cash.map((c,i) => {
          const f = fin[i];
          return (
            <tr key={c.year} className={i%2? 'bg-gray-50':''}>
              <td className="p-2">{c.year}</td>
              <td className="p-2 text-right">{c.rent.toFixed(0)}</td>
              <td className="p-2 text-right">{c.expenses.toFixed(0)}</td>
              <td className="p-2 text-right">{c.noi.toFixed(0)}</td>
              <td className="p-2 text-right">{f.noi.toFixed(0)}</td>
              <td className="p-2 text-right">{c.depreciation.toFixed(0)}</td>
              <td className="p-2 text-right">{c.taxableIncome.toFixed(0)}</td>
              <td className="p-2 text-right">{f.taxableIncome.toFixed(0)}</td>
              <td className="p-2 text-right">{c.afterTaxCashFlow.toFixed(0)}</td>
              <td className="p-2 text-right">{f.afterTaxCashFlow.toFixed(0)}</td>
              <td className="p-2 text-right">{f.loanBalance.toFixed(0)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
