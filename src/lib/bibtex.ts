export interface BibSource {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  type: 'journal' | 'conference' | 'preprint' | 'other';
  status?: 'published' | 'preprint' | 'in-preparation';
  doi?: string;
  arxiv?: string;
  url?: string;
  volume?: string;
  number?: string;
  pages?: string;
}

const STOP = new Set(['a', 'an', 'the', 'on', 'of', 'in', 'for', 'to', 'and', 'with', 'from', 'by', 'at']);
const slug = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');

export function bibtexKey(p: BibSource): string {
  const surname = slug(p.authors[0]?.split(' ').slice(-1)[0] ?? 'anon');
  const word = p.title.split(/[\s:]+/).map(slug).find((w) => w && !STOP.has(w)) ?? 'paper';
  return `${surname}${p.year}${word}`;
}

const esc = (s: string) => s.replace(/&/g, '\\&').replace(/%/g, '\\%');

export function toBibtex(p: BibSource): string {
  const isPreprint = p.type === 'preprint' || p.status === 'preprint';
  const kind = isPreprint ? 'misc' : p.type === 'conference' ? 'inproceedings' : 'article';
  const fields: [string, string | undefined][] = [
    ['title', `{${esc(p.title)}}`],
    ['author', p.authors.join(' and ')],
    [isPreprint ? 'howpublished' : p.type === 'conference' ? 'booktitle' : 'journal', isPreprint && p.arxiv ? undefined : esc(p.venue)],
    ['volume', p.volume],
    ['number', p.number],
    ['pages', p.pages],
    ['year', String(p.year)],
    ['doi', p.doi],
    ['eprint', isPreprint ? p.arxiv : undefined],
    ['archivePrefix', isPreprint && p.arxiv ? 'arXiv' : undefined],
    ['url', p.url ?? (p.arxiv ? `https://arxiv.org/abs/${p.arxiv}` : p.doi ? `https://doi.org/${p.doi}` : undefined)],
  ];
  const body = fields.filter(([, v]) => v).map(([k, v]) => `  ${k} = {${v}}`).join(',\n');
  return `@${kind}{${bibtexKey(p)},\n${body}\n}\n`;
}
