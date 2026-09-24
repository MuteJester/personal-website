import { describe, expect, it } from 'vitest';
import { arxivUrl, byEndDesc, doiUrl, formatDateRange, formatMonthYear, pubmedUrl, splitAuthors } from './format';

const d = (s: string) => new Date(s);

describe('formatDateRange', () => {
  it('renders open-ended ranges as present', () => {
    expect(formatDateRange(d('2022-06-01'))).toBe('2022 – present');
  });
  it('renders closed ranges', () => {
    expect(formatDateRange(d('2018-10-01'), d('2021-11-30'))).toBe('2018 – 2021');
  });
  it('collapses same-year ranges', () => {
    expect(formatDateRange(d('2024-02-01'), d('2024-11-01'))).toBe('2024');
  });
});

describe('formatMonthYear', () => {
  it('uses short month and year', () => {
    expect(formatMonthYear(d('2026-06-15'))).toBe('Jun 2026');
  });
});

describe('splitAuthors', () => {
  it('marks exactly the self name', () => {
    expect(splitAuthors(['Ayelet Peres', 'Thomas Konstantinovsky'])).toEqual([
      { name: 'Ayelet Peres', self: false },
      { name: 'Thomas Konstantinovsky', self: true },
    ]);
  });
  it('marks nobody when self is absent', () => {
    expect(splitAuthors(['T. Konstantinovsky']).some((a) => a.self)).toBe(false);
  });
});

describe('byEndDesc', () => {
  it('puts open-ended first, then latest end', () => {
    const items = [
      { data: { start: d('2018-01-01'), end: d('2021-01-01') } },
      { data: { start: d('2022-01-01') } },
      { data: { start: d('2020-01-01'), end: d('2023-01-01') } },
    ];
    const sorted = [...items].sort(byEndDesc).map((i) => i.data.start.getFullYear());
    expect(sorted).toEqual([2022, 2020, 2018]);
  });
});

describe('id urls', () => {
  it('builds canonical urls', () => {
    expect(doiUrl('10.1093/nar/gkaf651')).toBe('https://doi.org/10.1093/nar/gkaf651');
    expect(arxivUrl('2604.26190')).toBe('https://arxiv.org/abs/2604.26190');
    expect(pubmedUrl('40650972')).toBe('https://pubmed.ncbi.nlm.nih.gov/40650972/');
  });
});
