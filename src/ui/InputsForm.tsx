import React from 'react';
import { InputState } from '../valuation/inputs';

export const InputsForm: React.FC<{ value: InputState; onChange(v: InputState): void; }> = ({ value, onChange }) => {
  function update<K extends keyof InputState>(k: K, v: InputState[K]) {
    onChange({ ...value, [k]: typeof v === 'number' ? Number(v) : v } as InputState);
  }
  const numInput = (label: string, k: keyof InputState, step=0.01) => (
    <label className="flex flex-col gap-1 text-sm" key={k as string}>
      <span className="font-medium">{label}</span>
      <input type="number" step={step} value={value[k] as number}
        onChange={e => update(k, parseFloat(e.target.value))}
        className="border rounded px-2 py-1" />
    </label>
  );
  return (
    <div className="grid md:grid-cols-4 gap-4 bg-white p-4 rounded shadow">
      {numInput('Purchase Price', 'purchasePrice',1000)}
      {numInput('Loan %', 'loanPercent',0.01)}
      {numInput('Interest Rate', 'interestRate',0.001)}
      {numInput('Loan Term (yrs)', 'loanTermYears',1)}
      {numInput('Gross Annual Rent', 'grossAnnualRent',100)}
      {numInput('Rent Growth %', 'rentGrowth',0.001)}
      {numInput('Taxes (annual)', 'taxes',100)}
      {numInput('Insurance (annual)', 'insurance',50)}
      {numInput('HOA (annual)', 'hoa',50)}
      {numInput('Other Expenses (annual)', 'otherExpenses',50)}
      {numInput('Expense Growth %', 'expenseGrowth',0.001)}
      {numInput('Land %', 'landPercent',0.01)}
      {numInput('Horizon (yrs)', 'horizonYears',1)}
      {numInput('Appreciation %', 'appreciation',0.001)}
      {numInput('Selling Costs %', 'sellingCostsPercent',0.001)}
      {numInput('Tax Rate %', 'taxRate',0.001)}
      {numInput('Cap Gains Rate %', 'capGainsRate',0.001)}
    </div>
  );
};
