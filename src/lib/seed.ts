import type { LibraryEntry, Status } from './types';

const DAY = 86_400_000;

function daysAgo(n: number, hour = 10): string {
	const d = new Date(Date.now() - n * DAY);
	d.setHours(hour, 0, 0, 0);
	return d.toISOString();
}

interface SeedSpec {
	title: string;
	authors: string[];
	coverId: number | null;
	year: number | null;
	pages: number | null;
	genres: string[];
	status: Status;
	addedDaysAgo: number;
	interest?: number;
	startedDaysAgo?: number;
	finishedDaysAgo?: number;
	progress?: number;
}

const SPECS: SeedSpec[] = [
	{
		title: 'Os Maias',
		authors: ['Eça de Queiroz'],
		coverId: 104218,
		year: 1900,
		pages: 634,
		genres: ['clássicos'],
		status: 'por-ler',
		addedDaysAgo: 47,
		interest: 4
	},
	{
		title: 'Ensaio sobre a Cegueira',
		authors: ['José Saramago'],
		coverId: 10482411,
		year: 1995,
		pages: 352,
		genres: ['ficção'],
		status: 'a-ler',
		addedDaysAgo: 21,
		startedDaysAgo: 6,
		progress: 41
	},
	{
		title: 'O Ano da Morte de Ricardo Reis',
		authors: ['José Saramago'],
		coverId: 10781832,
		year: 2016,
		pages: 493,
		genres: ['clássicos'],
		status: 'por-ler',
		addedDaysAgo: 38,
		interest: 3
	},
	{
		title: 'A Máquina de Fazer Espanhóis',
		authors: ['Valter Hugo Mãe'],
		coverId: 12921134,
		year: 2010,
		pages: 287,
		genres: ['ficção'],
		status: 'abandonado',
		addedDaysAgo: 30,
		startedDaysAgo: 16,
		finishedDaysAgo: 12,
		progress: 22
	},
	{
		title: 'Cem Anos de Solidão',
		authors: ['Gabriel García Márquez'],
		coverId: 12627383,
		year: 1967,
		pages: 432,
		genres: ['clássicos'],
		status: 'por-ler',
		addedDaysAgo: 60,
		interest: 5
	},
	{
		title: 'Ficções',
		authors: ['Jorge Luis Borges'],
		coverId: 10832290,
		year: 1945,
		pages: 196,
		genres: ['clássicos'],
		status: 'por-ler',
		addedDaysAgo: 41,
		interest: 4
	},
	{
		title: '1984',
		authors: ['George Orwell'],
		coverId: 9267242,
		year: 1949,
		pages: 318,
		genres: ['ficção científica'],
		status: 'por-ler',
		addedDaysAgo: 9,
		interest: 5
	},
	{
		title: 'Fahrenheit 451',
		authors: ['Ray Bradbury'],
		coverId: 12993656,
		year: 1953,
		pages: 190,
		genres: ['ficção científica'],
		status: 'por-ler',
		addedDaysAgo: 33,
		interest: 4
	},
	{
		title: 'O Senhor dos Anéis',
		authors: ['J.R.R. Tolkien'],
		coverId: 14625765,
		year: 1954,
		pages: 1193,
		genres: ['fantasia'],
		status: 'por-ler',
		addedDaysAgo: 55,
		interest: 3
	},
	{
		title: 'Duna',
		authors: ['Frank Herbert'],
		coverId: 11481354,
		year: 1965,
		pages: 605,
		genres: ['ficção científica'],
		status: 'por-ler',
		addedDaysAgo: 26,
		interest: 4
	},
	{
		title: 'Neuromancer',
		authors: ['William Gibson'],
		coverId: 283860,
		year: 1984,
		pages: 317,
		genres: ['ficção científica'],
		status: 'por-ler',
		addedDaysAgo: 18,
		interest: 3
	},
	{
		title: 'O Guia do Mochileiro das Galáxias',
		authors: ['Douglas Adams'],
		coverId: 12986869,
		year: 1979,
		pages: 216,
		genres: ['ficção científica'],
		status: 'concluido',
		addedDaysAgo: 74,
		startedDaysAgo: 12,
		finishedDaysAgo: 3,
		progress: 100
	},
	{
		title: 'Crime e Castigo',
		authors: ['Fyodor Dostoyevsky'],
		coverId: 9411873,
		year: 1866,
		pages: 520,
		genres: ['clássicos'],
		status: 'por-ler',
		addedDaysAgo: 14,
		interest: 4
	},
	{
		title: 'Anna Karenina',
		authors: ['Lev Tolstoi'],
		coverId: 2560652,
		year: 1876,
		pages: 658,
		genres: ['clássicos'],
		status: 'por-ler',
		addedDaysAgo: 50
	},
	{
		title: 'O Estrangeiro',
		authors: ['Albert Camus'],
		coverId: 13151269,
		year: 1942,
		pages: 143,
		genres: ['clássicos'],
		status: 'concluido',
		addedDaysAgo: 96,
		startedDaysAgo: 45,
		finishedDaysAgo: 40,
		progress: 100
	},
	{
		title: 'A Metamorfose',
		authors: ['Franz Kafka'],
		coverId: 13219431,
		year: 2017,
		pages: 104,
		genres: ['clássicos'],
		status: 'concluido',
		addedDaysAgo: 110,
		startedDaysAgo: 22,
		finishedDaysAgo: 18,
		progress: 100
	},
	{
		title: 'Orgulho e Preconceito',
		authors: ['Jane Austen'],
		coverId: 14348537,
		year: 1813,
		pages: 351,
		genres: ['romance'],
		status: 'por-ler',
		addedDaysAgo: 5,
		interest: 2
	},
	{
		title: 'Mataram a Cotovia',
		authors: ['Harper Lee'],
		coverId: 14351077,
		year: 1960,
		pages: 320,
		genres: ['clássicos'],
		status: 'por-ler',
		addedDaysAgo: 44,
		interest: 4
	},
	{
		title: 'O Apanhador no Campo de Centeio',
		authors: ['J. D. Salinger'],
		coverId: 9273490,
		year: 1945,
		pages: 240,
		genres: ['clássicos'],
		status: 'por-ler',
		addedDaysAgo: 12,
		interest: 3
	},
	{
		title: 'Grande Sertão: Veredas',
		authors: ['João Guimarães Rosa'],
		coverId: 13909068,
		year: 1956,
		pages: 504,
		genres: ['clássicos'],
		status: 'por-ler',
		addedDaysAgo: 28,
		interest: 5
	}
];

function build(spec: SeedSpec, index: number): LibraryEntry {
	const entry: LibraryEntry = {
		id: `seed-${String(index + 1).padStart(2, '0')}`,
		meta: {
			title: spec.title,
			authors: spec.authors,
			coverId: spec.coverId,
			workKey: undefined,
			pages: spec.pages,
			year: spec.year,
			genres: spec.genres
		},
		status: spec.status,
		addedAt: daysAgo(spec.addedDaysAgo)
	};
	if (spec.interest !== undefined) entry.interest = spec.interest;
	if (spec.startedDaysAgo !== undefined) entry.startedAt = daysAgo(spec.startedDaysAgo, 20);
	if (spec.finishedDaysAgo !== undefined) entry.finishedAt = daysAgo(spec.finishedDaysAgo, 21);
	if (spec.progress !== undefined) entry.progress = spec.progress;
	return entry;
}

export const SEED_ENTRIES: LibraryEntry[] = SPECS.map(build);
