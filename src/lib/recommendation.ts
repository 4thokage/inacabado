import type { LibraryEntry, Recommendation } from './types';

function mulberry32(seed: number): () => number {
	let a = seed >>> 0;
	return () => {
		a += 0x6d2b79f5;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function daysBetween(from: string): number {
	const start = Date.parse(from);
	if (Number.isNaN(start)) return 0;
	return Math.floor((Date.now() - start) / 86_400_000);
}

function fmtDays(n: number): string {
	return n === 1 ? 'dia' : 'dias';
}

/**
 * Recomendação determinística a partir da pilha de "por ler".
 * Factores: dias na pilha · interesse marcado · diversidade de género
 * (penaliza repetir o último género concluído) · ruído semeado para o
 * "Escolher outra" re-embaralhar sem perder determinismo.
 */
export function recommend(
	entries: LibraryEntry[],
	opts: { lastGenre?: string; seed?: number } = {}
): Recommendation | null {
	const candidates = entries.filter((e) => e.status === 'por-ler');
	if (candidates.length === 0) return null;

	const seed = (opts.seed ?? 1) >>> 0;
	const rand = mulberry32(seed);
	const lastGenre = opts.lastGenre?.toLowerCase();

	const scored = candidates.map((entry) => {
		const days = Math.max(1, daysBetween(entry.addedAt));
		const interest = entry.interest ?? 2.5;
		const genre = entry.meta.genres?.[0]?.toLowerCase();

		let score = 0;
		score += Math.min(60, days);
		score += interest * 6;
		if (lastGenre && genre === lastGenre) score -= 28;
		score += rand() * 18;

		return { entry, score, days, interest, genre };
	});

	scored.sort((a, b) => b.score - a.score);
	const top = scored[0];

	const reasons: string[] = [];
	if (top.days >= 14) {
		reasons.push(`Está na pilha há ${top.days} ${fmtDays(top.days)}.`);
	} else if (top.days >= 3) {
		reasons.push(`Já espera há ${top.days} ${fmtDays(top.days)}.`);
	} else {
		reasons.push(`Acabou de chegar à pilha.`);
	}
	if (entryInterest(top.entry) > 3.5) {
		reasons.push(`Interesse marcado ${top.interest.toFixed(0)} em 5.`);
	}
	if (lastGenre && top.genre === lastGenre) {
		reasons.push(`Volta ao género de «${top.genre}» que acabaste.`);
	} else if (lastGenre) {
		reasons.push(`Muda de registo depois de «${lastGenre}».`);
	}

	return { entry: top.entry, score: top.score, reasons, seed };
}

function entryInterest(entry: LibraryEntry): number {
	return entry.interest ?? 2.5;
}

/** Semente seguinte para o "Escolher outra" re-embaralhar. */
export function nextSeed(current: number): number {
	return (current + 1013) >>> 0;
}
