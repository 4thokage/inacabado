export type Status = 'por-ler' | 'a-ler' | 'concluido' | 'abandonado';

export interface BookMeta {
	title: string;
	authors: string[];
	coverId?: number | null;
	workKey?: string;
	pages?: number | null;
	year?: number | null;
	genres?: string[];
}

export interface LibraryEntry {
	id: string;
	meta: BookMeta;
	status: Status;
	addedAt: string;
	startedAt?: string;
	finishedAt?: string;
	interest?: number;
	progress?: number;
}

export interface Recommendation {
	entry: LibraryEntry;
	score: number;
	reasons: string[];
	seed: number;
}

export interface StartConflict {
	current: LibraryEntry;
	requested: LibraryEntry;
}

export type ToastTone = 'info' | 'success' | 'warning' | 'danger';

export const STATUS_LABEL: Record<Status, string> = {
	'por-ler': 'Por Ler',
	'a-ler': 'A Ler',
	concluido: 'Concluídos',
	abandonado: 'Abandonados'
};
