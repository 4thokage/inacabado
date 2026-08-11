import { browser } from '$app/environment';
import { loadEntries, saveEntries, seedIfNeeded } from '../storage/repository';
import { nextSeed, recommend } from '../recommendation';
import type {
	BookMeta,
	LibraryEntry,
	Recommendation,
	StartConflict
} from '../types';

function uid(): string {
	return typeof crypto !== 'undefined' && 'randomUUID' in crypto
		? crypto.randomUUID()
		: `id-${Math.random().toString(36).slice(2, 10)}`;
}

function norm(s: string): string {
	return s.trim().toLocaleLowerCase('pt');
}

class LibraryStore {
	entries = $state<LibraryEntry[]>([]);
	ready = $state(false);
	recommendationSeed = $state(1);

	porLer = $derived(this.entries.filter((e) => e.status === 'por-ler'));
	aLer = $derived(this.entries.filter((e) => e.status === 'a-ler'));
	concluidos = $derived(this.entries.filter((e) => e.status === 'concluido'));
	abandonados = $derived(this.entries.filter((e) => e.status === 'abandonado'));
	reading = $derived(this.aLer[0] ?? null);

	lastGenre = $derived.by(() => {
		const done = [...this.concluidos].sort((a, b) =>
			(b.finishedAt ?? '').localeCompare(a.finishedAt ?? '')
		);
		return done[0]?.meta.genres?.[0];
	});

	constructor() {
		if (!browser) return;
		const seeded = seedIfNeeded();
		this.entries = seeded ?? loadEntries();
		this.ready = true;
	}

	#persist(): void {
		saveEntries(this.entries);
	}

	addBook(meta: BookMeta): LibraryEntry | null {
		const key = norm(meta.title);
		if (this.entries.some((e) => norm(e.meta.title) === key)) return null;
		const entry: LibraryEntry = {
			id: uid(),
			meta,
			status: 'por-ler',
			addedAt: new Date().toISOString(),
			progress: 0
		};
		this.entries = [entry, ...this.entries];
		this.#persist();
		return entry;
	}

	/** Devolve o conflito se já houver leitura a decorrer; senão inicia. */
	startReading(id: string): StartConflict | null {
		const requested = this.entries.find((e) => e.id === id);
		if (!requested || requested.status === 'a-ler') return null;
		const current = this.reading;
		if (current) return { current, requested };
		this.#setReading(id);
		return null;
	}

	#setReading(id: string): void {
		const entry = this.entries.find((e) => e.id === id);
		if (!entry) return;
		this.entries = this.entries.map((e) =>
			e.id === id
				? {
						...e,
						status: 'a-ler',
						startedAt: new Date().toISOString(),
						progress: e.progress ?? 0
					}
				: e
		);
		this.#persist();
	}

	/** Confirmação do diálogo: devolve a leitura atual à pilha e inicia a nova. */
	forceSwap(id: string): void {
		const current = this.reading;
		if (current && current.id !== id) {
			this.entries = this.entries.map((e) =>
				e.id === current.id
					? { ...e, status: 'por-ler', startedAt: undefined, progress: e.progress ?? 0 }
					: e
			);
		}
		this.#setReading(id);
	}

	updateProgress(id: string, pct: number): void {
		const clamped = Math.max(0, Math.min(100, Math.round(pct)));
		this.entries = this.entries.map((e) => (e.id === id ? { ...e, progress: clamped } : e));
		this.#persist();
	}

	completeReading(id: string): void {
		this.entries = this.entries.map((e) =>
			e.id === id
				? { ...e, status: 'concluido', finishedAt: new Date().toISOString(), progress: 100 }
				: e
		);
		this.#persist();
	}

	abandonReading(id: string): void {
		this.entries = this.entries.map((e) =>
			e.id === id
				? { ...e, status: 'abandonado', finishedAt: new Date().toISOString() }
				: e
		);
		this.#persist();
	}

	backToPile(id: string): void {
		this.entries = this.entries.map((e) =>
			e.id === id
				? { ...e, status: 'por-ler', startedAt: undefined, finishedAt: undefined, progress: 0 }
				: e
		);
		this.#persist();
	}

	setInterest(id: string, n: number): void {
		this.entries = this.entries.map((e) => (e.id === id ? { ...e, interest: n } : e));
		this.#persist();
	}

	remove(id: string): void {
		this.entries = this.entries.filter((e) => e.id !== id);
		this.#persist();
	}

	recommendation(seed?: number): Recommendation | null {
		return recommend(this.porLer, {
			lastGenre: this.lastGenre,
			seed: seed ?? this.recommendationSeed
		});
	}

	reroll(): Recommendation | null {
		this.recommendationSeed = nextSeed(this.recommendationSeed);
		return this.recommendation();
	}
}

export const library = new LibraryStore();
