import { YearResultFinanced, YearResultBase } from '../valuation/engine';

export function buildCsv(cash: YearResultBase[], fin: YearResultFinanced[]): string {
  const headers = [
    'Year','Rent','Expenses','NOI Cash','NOI Fin','Depreciation','Taxable Cash','Taxable Fin','AfterTax CF Cash','AfterTax CF Fin','AfterTax CF Cash (No Dep)','AfterTax CF Fin (No Dep)','Depreciation Tax Shield Cash','Depreciation Tax Shield Fin','Loan Balance'
  ];
  const rows = cash.map((c,i) => {
    const f = fin[i];
    return [
      c.year,c.rent,c.expenses,c.noi,f.noi,c.depreciation,c.taxableIncome,f.taxableIncome,c.afterTaxCashFlow,f.afterTaxCashFlow,c.afterTaxCFBeforeDep,f.afterTaxCFBeforeDep,c.taxShieldDep,f.taxShieldDep,f.loanBalance
    ].map(v => typeof v === 'number' ? v.toFixed(2) : v);
  });
  return [headers.join(','), ...rows.map(r=>r.join(','))].join('\n');
}

export function downloadCsv(name: string, csv: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}