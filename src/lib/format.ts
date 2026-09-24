const EN_DASH = ' – ';

export function formatDateRange(start: Date, end?: Date): string {
  const s = start.getUTCFullYear();
  if (!end) return `${s}${EN_DASH}present`;
  const e = end.getUTCFullYear();
  return s === e ? `${s}` : `${s}${EN_DASH}${e}`;
}

export function formatMonthYear(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export function splitAuthors(authors: string[], self = 'Thomas Konstantinovsky') {
  return authors.map((name) => ({ name, self: name === self }));
}

export function byDateDesc<T extends { data: { date: Date } }>(a: T, b: T): number {
  return b.data.date.getTime() - a.data.date.getTime();
}

export function byEndDesc<T extends { data: { start: Date; end?: Date } }>(a: T, b: T): number {
  const open = (x: T) => (x.data.end ? 0 : 1);
  if (open(a) !== open(b)) return open(b) - open(a);
  const endA = a.data.end?.getTime() ?? 0;
  const endB = b.data.end?.getTime() ?? 0;
  if (endA !== endB) return endB - endA;
  return b.data.start.getTime() - a.data.start.getTime();
}

export const doiUrl = (doi: string) => `https://doi.org/${doi}`;
export const arxivUrl = (id: string) => `https://arxiv.org/abs/${id}`;
export const pubmedUrl = (pmid: string) => `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;

/** True when `self` is a (joint) first author: index 0, or within the first `equalContributors` when marked. */
export function isLeadAuthor(authors: string[], equalContribution: boolean, equalContributors = 2, self = 'Thomas Konstantinovsky'): boolean {
  const i = authors.indexOf(self);
  if (i < 0) return false;
  return i === 0 || (equalContribution && i < equalContributors);
}
