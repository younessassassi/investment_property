import React from 'react';
import { InputState } from '../valuation/inputs';

export const InputsForm: React.FC<{ value: InputState; onChange(v: InputState): void; }> = ({ value, onChange }) => {
  function update<K extends keyof InputState>(k: K, v: InputState[K]) {
    onChange({ ...value, [k]: typeof v === 'number' ? Number(v) : v } as InputState);
  }

  const numInput = (label: string, k: keyof InputState, step = 0.01, min = 0, desc?: string) => (
    <label className="flex flex-col gap-1 text-sm" key={k as string}>
      <span className="font-medium">{label}</span>
      {desc && <span className="text-xs text-gray-500 leading-tight">{desc}</span>}
      <input
        type="number"
        step={step}
        min={min}
        value={value[k] as number}
        onChange={(e) => {
          const parsed = parseFloat(e.target.value);
          const finalValue = isNaN(parsed) ? '' : Math.max(parsed, min);
          update(k, finalValue as any);
        }}
        className="border rounded px-2 py-1"
      />
    </label>
  );

  const textInput = (label: string, k: keyof InputState) => (
    <label className="flex flex-col gap-1 text-sm" key={k as string}>
      <span className="font-medium">{label}</span>
      <input
        type="text"
        value={(value[k] as string) || ''}
        onChange={(e) => update(k, e.target.value)}
        className="border rounded px-2 py-1"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </label>
  );

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded text-sm text-blue-800">
        <strong>How to use:</strong> Enter your property details and adjust any values to model your scenario.
      </div>
      
      <div className="bg-white p-4 rounded shadow space-y-3">
        <div className="font-semibold text-sm">Property Address (Optional)</div>
        <div className="flex gap-2">
          <div className="flex-1">
            {textInput('Address', 'address')}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4 bg-white p-4 rounded shadow">
        {numInput('Purchase Price', 'purchasePrice', 1000, 0, 'Total price of the property. Sets the basis for loan amount, depreciation, and future sale gain.')}
        {numInput('Closing Costs', 'closingCosts', 100, 0, 'One-time fees at purchase (title, escrow, etc.). Added to your upfront cash outlay, increasing the investment basis.')}
        {numInput('Loan %', 'loanPercent', 0.01, 0, 'Portion of purchase price financed (e.g. 0.7 = 70% loan). Higher leverage reduces cash needed but increases debt service.')}
        {numInput('Interest Rate', 'interestRate', 0.001, 0, 'Annual mortgage rate as a decimal (e.g. 0.065 = 6.5%). Drives monthly payment and total interest paid over the loan.')}
        {numInput('Loan Term (yrs)', 'loanTermYears', 1, 1, 'Length of the mortgage. Longer terms lower monthly payments but increase total interest paid.')}
        {numInput('Loan Points', 'loanPoints', 0.001, 0, 'Upfront fee as % of loan amount (e.g. 0.02 = 2 points). Added to cash outlay and amortized as a tax deduction over the loan term.')}
        {numInput('Gross Annual Rent', 'grossAnnualRent', 100, 0, 'Total yearly rental income before any expenses. This is your top-line revenue driving NOI and cash flow.')}
        {numInput('Rent Growth %', 'rentGrowth', 0.001, 0, 'Expected annual increase in rent as a decimal (e.g. 0.03 = 3%/yr). Compounds each year, boosting future cash flow.')}
        {numInput('Taxes (annual)', 'taxes', 100, 0, 'Yearly property tax. Part of operating expenses, subtracted from rent to calculate NOI.')}
        {numInput('Insurance (annual)', 'insurance', 50, 0, 'Yearly property insurance. Part of operating expenses, subtracted from rent to calculate NOI.')}
        {numInput('HOA (annual)', 'hoa', 50, 0, 'Yearly homeowners association fees, if any. Part of operating expenses, subtracted from rent.')}
        {numInput('Other Expenses (annual)', 'otherExpenses', 50, 0, 'Repairs, property management, vacancy, etc. Part of operating expenses that grow with expense growth rate.')}
        {numInput('Expense Growth %', 'expenseGrowth', 0.001, 0, 'Annual increase in operating expenses as a decimal (e.g. 0.025 = 2.5%/yr). Compounds each year, reducing future NOI.')}
        {numInput('Land %', 'landPercent', 0.01, 0, 'Portion of value that is land (e.g. 0.2 = 20%). Only the building portion (1 − land%) is depreciable over 27.5 years.')}
        {numInput('Horizon (yrs)', 'horizonYears', 1, 1, 'How many years you plan to hold the property. Determines how many years of cash flow and the sale timing.')}
        {numInput('Appreciation %', 'appreciation', 0.001, 0, 'Expected annual property value increase as a decimal (e.g. 0.035 = 3.5%/yr). Drives the future sale price.')}
        {numInput('Selling Costs %', 'sellingCostsPercent', 0.001, 0, 'Costs to sell as % of sale price (e.g. 0.06 = 6% for agent fees, etc.). Subtracted from gross sale proceeds.')}
        {numInput('Tax Rate %', 'taxRate', 0.001, 0, 'Marginal income tax rate as a decimal (e.g. 0.32 = 32%). Applied to taxable rental income and depreciation recapture at sale.')}
        {numInput('Cap Gains Rate %', 'capGainsRate', 0.001, 0, 'Long-term capital gains rate as a decimal (e.g. 0.15 = 15%). Applied to the capital gain portion when you sell.')}
      </div>
    </div>
  );
};
