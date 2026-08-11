import type { LibraryEntry } from '../types';
import { SEED_ENTRIES } from '../seed';

const STORAGE_KEY = 'entrelinhas:library';
const SEED_KEY = 'entrelinhas:seeded';

function hasStorage(): boolean {
	return typeof localStorage !== 'undefined';
}

export function loadEntries(): LibraryEntry[] {
	if (!hasStorage()) return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed as LibraryEntry[];
	} catch {
		return [];
	}
}

export function saveEntries(entries: LibraryEntry[]): void {
	if (!hasStorage()) return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
	} catch {
		/* armazenamento indisponível — ignorar */
	}
}

/** Semeia a biblioteca apenas na primeira execução. */
export function seedIfNeeded(): LibraryEntry[] | null {
	if (!hasStorage() || localStorage.getItem(SEED_KEY)) return null;
	try {
		localStorage.setItem(SEED_KEY, '1');
		localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ENTRIES));
		return SEED_ENTRIES;
	} catch {
		return null;
	}
}

export function isSeeded(): boolean {
	return hasStorage() && localStorage.getItem(SEED_KEY) === '1';
}
