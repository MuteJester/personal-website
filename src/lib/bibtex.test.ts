import { describe, expect, it } from 'vitest';
import { bibtexKey, toBibtex } from './bibtex';

const journal = {
  title: 'Enhancing sequence alignment of adaptive immune receptors through multi-task deep learning',
  authors: ['Thomas Konstantinovsky', 'Ayelet Peres', 'Gur Yaari'],
  venue: 'Nucleic Acids Research',
  year: 2025,
  type: 'journal' as const,
  status: 'published' as const,
  doi: '10.1093/nar/gkaf651',
};
const preprint = {
  title: 'Flashback: a reversible bilateral run-peeling decomposition of strings',
  authors: ['Thomas Konstantinovsky', 'Gur Yaari'],
  venue: 'arXiv',
  year: 2026,
  type: 'preprint' as const,
  status: 'preprint' as const,
  arxiv: '2604.26190',
};

describe('bibtexKey', () => {
  it('uses first author surname, year, and first significant title word', () => {
    expect(bibtexKey(journal)).toBe('konstantinovsky2025enhancing');
  });
  it('skips short words like a and the', () => {
    expect(bibtexKey(preprint)).toBe('konstantinovsky2026flashback');
  });
});

describe('toBibtex', () => {
  it('renders a journal article with doi and joined authors', () => {
    const b = toBibtex(journal);
    expect(b).toContain('@article{konstantinovsky2025enhancing,');
    expect(b).toContain('author = {Thomas Konstantinovsky and Ayelet Peres and Gur Yaari}');
    expect(b).toContain('journal = {Nucleic Acids Research}');
    expect(b).toContain('doi = {10.1093/nar/gkaf651}');
    expect(b.trim().endsWith('}')).toBe(true);
  });
  it('renders an arXiv preprint as misc with eprint fields', () => {
    const b = toBibtex(preprint);
    expect(b).toContain('@misc{konstantinovsky2026flashback,');
    expect(b).toContain('eprint = {2604.26190}');
    expect(b).toContain('archivePrefix = {arXiv}');
  });
  it('protects capitals in titles with braces', () => {
    expect(toBibtex({ ...journal, title: 'GenAIRR for AIRR data' })).toContain('title = {{GenAIRR for AIRR data}}');
  });
});

describe('toBibtex details', () => {
  it('escapes ampersands', () => {
    expect(toBibtex({ ...journal, venue: 'Epigenetics & Chromatin' })).toContain('journal = {Epigenetics \\& Chromatin}');
  });
  it('includes volume, number and pages when present', () => {
    const b = toBibtex({ ...journal, volume: '53', number: '13', pages: 'gkaf651' });
    expect(b).toContain('volume = {53}');
    expect(b).toContain('number = {13}');
    expect(b).toContain('pages = {gkaf651}');
  });
});
