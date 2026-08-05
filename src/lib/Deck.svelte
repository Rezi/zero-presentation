<script lang="ts">
	import { fly } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';
	import type { Slide } from '$lib/types';

	let { slides, author, org }: { slides: Slide[]; author: string; org: string } = $props();

	let index = $state(0);
	let step = $state(0);
	let dir = $state(1);

	const current = $derived(slides[index]);

	/* Granular progress: every reveal inside every slide counts. */
	const totalSteps = $derived(slides.reduce((n, s) => n + s.steps, 0));
	const doneSteps = $derived(slides.slice(0, index).reduce((n, s) => n + s.steps, 0) + step + 1);
	const progress = $derived((doneSteps / totalSteps) * 100);

	function next() {
		if (step < current.steps - 1) {
			step += 1;
		} else if (index < slides.length - 1) {
			dir = 1;
			index += 1;
			step = 0;
		}
	}

	function prev() {
		if (step > 0) {
			step -= 1;
		} else if (index > 0) {
			dir = -1;
			index -= 1;
			step = slides[index].steps - 1; // land on a fully-revealed slide
		}
	}

	function goto(i: number) {
		dir = i > index ? 1 : -1;
		index = i;
		step = 0;
	}

	/* Deep links: #3 is slide 3, #3.2 is slide 3 at its second reveal. */
	function readHash() {
		const m = /^#(\d+)(?:\.(\d+))?$/.exec(location.hash);
		if (!m) return;
		const i = Math.min(Math.max(+m[1] - 1, 0), slides.length - 1);
		index = i;
		step = Math.min(Math.max(+(m[2] ?? 1) - 1, 0), slides[i].steps - 1);
	}

	$effect(() => {
		readHash();
		const on = () => readHash();
		window.addEventListener('hashchange', on);
		return () => window.removeEventListener('hashchange', on);
	});

	$effect(() => {
		const hash = `#${index + 1}${step > 0 ? `.${step + 1}` : ''}`;
		if (location.hash !== hash) history.replaceState(null, '', hash);
	});

	function onKeydown(e: KeyboardEvent) {
		if (e.metaKey || e.ctrlKey || e.altKey) return;
		switch (e.key) {
			case 'ArrowRight':
			case 'ArrowDown':
			case 'PageDown':
			case ' ':
			case 'Enter':
				e.preventDefault();
				next();
				break;
			case 'ArrowLeft':
			case 'ArrowUp':
			case 'PageUp':
			case 'Backspace':
				e.preventDefault();
				prev();
				break;
			case 'Home':
				e.preventDefault();
				goto(0);
				break;
			case 'End':
				e.preventDefault();
				goto(slides.length - 1);
				step = slides[slides.length - 1].steps - 1;
				break;
			case 'f':
				e.preventDefault();
				if (document.fullscreenElement) document.exitFullscreen();
				else document.documentElement.requestFullscreen?.();
				break;
		}
	}

	/* Click anywhere advances; the left 20% goes back. Controls opt out via [data-nav]. */
	/* function onClick(e: MouseEvent) {
		if ((e.target as HTMLElement).closest('[data-nav]')) return;
		if (e.clientX < window.innerWidth * 0.2) prev();
		else next();
	} */
</script>

<svelte:window on:keydown={onKeydown} />

<div class="deck" >
	<div class="ambient" aria-hidden="true">
		<span class="glow glow-a"></span>
		<span class="glow glow-b"></span>
		<span class="orbit orbit-1"></span>
		<span class="orbit orbit-2"></span>
	</div>

	<div class="progress" aria-hidden="true"><i style="width:{progress}%"></i></div>

	<header class="chrome top">
		<span class="brand"><b>Zero</b> Sync <em>·</em> {org}</span>
		<span class="hint" data-nav>
			<kbd>←</kbd><kbd>→</kbd><kbd>space</kbd> <em>·</em> <kbd>F</kbd> fullscreen
		</span>
	</header>

	<main class="stage">
		{#key index}
			{@const Slide = current.component}
			<section
				class="slide"
				in:fly={{ x: dir * 70, duration: 560, easing: expoOut, opacity: 0 }}
				out:fly={{ x: dir * -45, duration: 280, opacity: 0 }}
			>
				<Slide {step} />
			</section>
		{/key}
	</main>

	<footer class="chrome bottom">
		<span class="author">{author}</span>
		<nav class="dots" data-nav aria-label="Slides">
			{#each slides as s, i (s.label)}
				<button
					class="dot"
					class:active={i === index}
					aria-label={s.label}
					aria-current={i === index}
					onclick={() => goto(i)}
				></button>
			{/each}
		</nav>
		<span class="count"><b>{index + 1}</b> / {slides.length}</span>
	</footer>
</div>

<style>
	.deck {
		position: relative;
		height: 100dvh;
		width: 100vw;
		display: grid;
		grid-template-rows: auto 1fr auto;
		overflow: hidden;
		background: radial-gradient(1200px 700px at 78% -10%, #1e1e2e 0%, transparent 60%), var(--navy);
	}

	/* ---- ambient decoration ---- */
	.ambient {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.glow {
		position: absolute;
		border-radius: 50%;
		filter: blur(90px);
		opacity: 0.16;
	}

	.glow-a {
		width: 46vw;
		height: 46vw;
		top: -16vw;
		right: -10vw;
		background: var(--yellow);
	}

	.glow-b {
		width: 38vw;
		height: 38vw;
		bottom: -18vw;
		left: -12vw;
		background: var(--cyan);
		opacity: 0.12;
	}

	/* "digital orbit" nod to the Applifting brand line */
	.orbit {
		position: absolute;
		border: 1px solid #ffffff0d;
		border-radius: 50%;
		top: 50%;
		left: 50%;
	}

	.orbit-1 {
		width: 108vmin;
		height: 108vmin;
		margin: -54vmin 0 0 -54vmin;
		border-top-color: #fac61f2e;
		animation: spin 46s linear infinite;
	}

	.orbit-2 {
		width: 150vmin;
		height: 150vmin;
		margin: -75vmin 0 0 -75vmin;
		border-left-color: #5ecae72b;
		animation: spin 74s linear infinite reverse;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* ---- chrome ---- */
	.progress {
		position: absolute;
		inset: 0 0 auto 0;
		height: 3px;
		background: #ffffff0f;
		z-index: 5;
	}

	.progress i {
		display: block;
		height: 100%;
		background: linear-gradient(90deg, var(--yellow), #ffe07a);
		box-shadow: 0 0 14px #fac61f8c;
		transition: width 0.45s var(--ease);
	}

	.chrome {
		position: relative;
		z-index: 3;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: clamp(0.8rem, 2.2vmin, 1.7rem) clamp(1.1rem, 4vmin, 3.4rem);
		font-size: clamp(0.8rem, 1.1vmin, 0.85rem);
		color: var(--ink-mute);
		letter-spacing: 0.04em;
	}

	.brand b {
		color: var(--ink);
		font-weight: 700;
	}

	.brand em,
	.hint em {
		font-style: normal;
		opacity: 0.4;
		margin: 0 0.35em;
	}

	.hint {
		display: flex;
		align-items: center;
		gap: 0.25em;
		opacity: 0.75;
	}

	.author {
		color: var(--ink-dim);
		font-weight: 500;
	}

	.count b {
		color: var(--yellow);
		font-weight: 700;
	}

	.dots {
		display: flex;
		gap: 0.6rem;
		cursor: default;
	}

	.dot {
		width: 9px;
		height: 9px;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: #ffffff26;
		cursor: pointer;
		transition: all 0.3s var(--ease);
	}

	.dot:hover {
		background: #ffffff59;
	}

	.dot.active {
		width: 30px;
		border-radius: 5px;
		background: var(--yellow);
		box-shadow: 0 0 12px #fac61f7a;
	}

	/* ---- stage ---- */
	.stage {
		position: relative;
		z-index: 2;
		min-height: 0;
	}

	.slide {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: clamp(0.7rem, 2vmin, 1.6rem);
		padding: 0 clamp(1.1rem, 4vmin, 3.4rem) clamp(0.4rem, 1vmin, 1rem);
		min-height: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.orbit {
			animation: none;
		}
	}
</style>
