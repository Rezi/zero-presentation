import type { Component } from 'svelte';

/** One deck slide. `steps` counts the in-slide reveals (minimum 1). */
export type Slide = {
	label: string;
	steps: number;
	component: Component<{ step: number }>;
};
