import type { BookMeta } from '../types';

const SEARCH_URL = 'https://openlibrary.org/search.json';
const CACHE_PREFIX = 'entrelinhas:ol:';
const CACHE_TTL = 7 * 86_400_000;

export interface OLSearchResult {
	key: string;
	title: string;
	authors: string[];
	coverId?: number;
	year?: number;
	pages?: number;
	genres?: string[];
}

const GENRE_MAP: Array<[RegExp, string]> = [
	[/fantasy/i, 'fantasia'],
	[/science fiction|scifi|sci fi/i, 'ficção científica'],
	[/detective|mystery|crime|thriller/i, 'mistério'],
	[/romance/i, 'romance'],
	[/poetry/i, 'poesia'],
	[/biograph|memoir|autobiograph/i, 'biografia'],
	[/history|historical/i, 'história'],
	[/horror/i, 'terror'],
	[/philosophy/i, 'filosofia'],
	[/classic/i, 'clássicos'],
	[/drama|play/i, 'teatro'],
	[/essays/i, 'ensaios']
];

function classifyGenres(subjects: string[] | undefined): string[] | undefined {
	if (!subjects?.length) return undefined;
	const found = new Set<string>();
	for (const s of subjects) {
		for (const [re, genre] of GENRE_MAP) {
			if (re.test(s)) {
				found.add(genre);
				break;
			}
		}
	}
	return found.size > 0 ? [...found] : undefined;
}

interface CacheEntry {
	t: number;
	r: OLSearchResult[];
}

function readCache(query: string): OLSearchResult[] | null {
	try {
		const raw = localStorage.getItem(CACHE_PREFIX + query);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as CacheEntry;
		if (Date.now() - parsed.t > CACHE_TTL) return null;
		return parsed.r;
	} catch {
		return null;
	}
}

function writeCache(query: string, results: OLSearchResult[]): void {
	try {
		localStorage.setItem(CACHE_PREFIX + query, JSON.stringify({ t: Date.now(), r: results }));
	} catch {
		/* armazenamento indisponível — ignorar */
	}
}

export async function searchBooks(
	query: string,
	signal?: AbortSignal
): Promise<OLSearchResult[]> {
	const q = query.trim();
	if (q.length < 2) return [];

	const cached = readCache(q);
	if (cached) return cached;

	const url = new URL(SEARCH_URL);
	url.searchParams.set('q', q);
	url.searchParams.set(
		'fields',
		'key,title,author_name,cover_i,first_publish_year,number_of_pages_median,subject'
	);
	url.searchParams.set('limit', '10');

	const res = await fetch(url.toString(), {
		signal,
		headers: { 'User-Agent': 'Entrelinhas/1.0 (aplicação local de fila de leitura)' }
	});
	if (!res.ok) throw new Error(`Open Library respondeu com ${res.status}`);

	const data = (await res.json()) as {
		docs?: Array<Record<string, unknown>>;
	};

	const results: OLSearchResult[] = (data.docs ?? [])
		.filter((d) => typeof d.title === 'string' && d.title.length > 0)
		.map((d) => {
			const authors = Array.isArray(d.author_name)
				? (d.author_name as string[]).map((a) => a.trim()).filter(Boolean)
				: typeof d.author_name === 'string'
					? [d.author_name.trim()]
					: [];
			const subjects = Array.isArray(d.subject)
				? (d.subject as string[]).slice(0, 12)
				: undefined;
			return {
				key: typeof d.key === 'string' ? d.key : '',
				title: d.title as string,
				authors,
				coverId: typeof d.cover_i === 'number' ? d.cover_i : undefined,
				year:
					typeof d.first_publish_year === 'number' ? d.first_publish_year : undefined,
				pages:
					typeof d.number_of_pages_median === 'number'
						? d.number_of_pages_median
						: undefined,
				genres: classifyGenres(subjects)
			};
		});

	writeCache(q, results);
	return results;
}

export function coverUrl(coverId: number, size: 'S' | 'M' | 'L' = 'L'): string {
	return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

export function resultToMeta(r: OLSearchResult): BookMeta {
	return {
		title: r.title,
		authors: r.authors,
		coverId: r.coverId,
		workKey: r.key,
		pages: r.pages ?? null,
		year: r.year ?? null,
		genres: r.genres
	};
}
