<script lang="ts">
	import Deck from '$lib/Deck.svelte';
	import type { Slide } from '$lib/types';
	import Title from '$lib/slides/Title.svelte';
	import Problem from '$lib/slides/Problem.svelte';
	import HowItWorks from '$lib/slides/HowItWorks.svelte';
	import Api from '$lib/slides/Api.svelte';
	import Fit from '$lib/slides/Fit.svelte';

	const slides: Slide[] = [
		{ label: 'Zero', steps: 3, component: Title },
		{ label: 'Why bother', steps: 4, component: Problem },
		{ label: 'How it works', steps: 6, component: HowItWorks },
		{ label: 'The API', steps: 4, component: Api },
		{ label: 'Reality check', steps: 5, component: Fit }
	];
</script>

<svelte:head>
	<title>Zero Sync · Applifting · Tomas Rezac</title>
	<meta
		name="description"
		content="Zero: a query-driven sync engine for TypeScript and Postgres. Internal tech talk by Tomas Rezac, Applifting."
	/>
</svelte:head>

<Deck {slides} author="Tomas Rezac" org="Applifting" />
