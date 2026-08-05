<script lang="ts">
	let { step }: { step: number } = $props();

	const yes = [
		'You need <b>partial sync</b> — a small, query-shaped subset of a large database.',
		'You need <b>fine-grained read and write permissions</b>, enforced by your own server code.',
		'You already run <b>Postgres</b> with a schema you like, and want to migrate off REST/GraphQL <b>incrementally</b>.',
		'Interaction speed is a product requirement — <b>Linear-class</b> productivity apps.'
	];

	const no = [
		'You want <b>local-first</b>. Zero is a client-server system with an authoritative server.',
		'You need <b>offline writes</b>. Not supported.',
		'You need <b>native mobile</b>. TypeScript clients only.',
		'Your dataset is <b>huge</b>. Keep it under ~100 GB.'
	];

	const stats = [
		{ v: '< 1s', l: 'typical app load' },
		{ v: '100 GB', l: 'recommended ceiling' },
		{ v: 'NVMe (SSD)', l: 'the replica needs it' },
		{ v: 'TS', l: 'client languages' }
	];
</script>

<p class="eyebrow step on">Reality check</p>
<h2 class="slide-title step on">
	Worth it when the data is <span class="accent">small and shared</span>.
</h2>

<div class="grid">
	<section class="list good step" class:on={step >= 1}>
		<h3><span class="mark">✓</span> Reach for Zero</h3>
		<ul>
			{#each yes as t, i (t)}
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				<li class="step" class:on={step >= 1} style="transition-delay:{i * 80}ms">{@html t}</li>
			{/each}
		</ul>
	</section>

	<section class="list bad step" class:on={step >= 2}>
		<h3><span class="mark">×</span> Look elsewhere</h3>
		<ul>
			{#each no as t, i (t)}
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				<li class="step" class:on={step >= 2} style="transition-delay:{i * 80}ms">{@html t}</li>
			{/each}
		</ul>
	</section>
</div>

<div class="stats step" class:on={step >= 3}>
	{#each stats as s, i (s.l)}
		<div class="stat" style="transition-delay:{i * 70}ms">
			<b>{s.v}</b><span>{s.l}</span>
		</div>
	{/each}
</div>

<div class="outro step" class:on={step >= 4}>
	<p class="verdict">
		<b>Verdict.</b> Zero deletes the data-fetching layer — endpoints, cache keys, invalidation, loading
		states — and charges you a stateful service to operate. For our productivity-app work, that trade
		is worth a spike.
	</p>
	<p class="links">
		<span class="thanks">Thanks — questions?</span>
		<span>Tomas Rezac <em>·</em> Applifting</span>
		<a href="https://zero.rocicorp.dev/docs">zero.rocicorp.dev/docs</a>
	</p>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: clamp(0.8rem, 2.4vmin, 2.2rem);
		min-height: 0;
	}

	.list h3 {
		display: flex;
		align-items: center;
		gap: 0.5em;
		margin: 0 0 0.6em;
		font-size: clamp(0.82rem, 1.82vmin, 1.34rem);
		font-weight: 700;
		letter-spacing: -0.01em;
	}

	.mark {
		display: grid;
		place-items: center;
		width: 1.5em;
		height: 1.5em;
		border-radius: 50%;
		font-size: 0.85em;
		font-weight: 700;
	}

	.good .mark {
		background: #73c37c26;
		color: var(--green);
	}

	.bad .mark {
		background: #ff7b7b26;
		color: #ff8f8f;
	}

	.list ul {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}

	.list li {
		position: relative;
		padding: 0 0 0 1.2em;
		font-size: clamp(0.8rem, 1.6vmin, 1.18rem);
		line-height: 1.5;
		color: var(--ink-mute);
	}

	.list li::before {
		position: absolute;
		left: 0;
		top: -0.05em;
		font-weight: 700;
	}

	.good li::before {
		content: '✓';
		color: var(--green);
	}

	.bad li::before {
		content: '×';
		color: #ff8f8f;
	}

	.list :global(b) {
		color: var(--ink-dim);
		font-weight: 600;
	}

	.bad {
		padding-left: clamp(0.8rem, 2.2vmin, 2rem);
		border-left: 1px solid #33334a;
	}

	/* --- numbers --- */
	.stats {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: clamp(0.4rem, 1.2vmin, 1rem);
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: 0.1em;
		padding: clamp(0.45rem, 1.1vmin, 0.85rem) clamp(0.6rem, 1.4vmin, 1.05rem);
		border-radius: 11px;
		border: 1px solid var(--navy-line);
		background: #ffffff07;
	}

	.stat b {
		font-size: clamp(1.05rem, 2.5vmin, 1.9rem);
		font-weight: 800;
		letter-spacing: -0.02em;
		color: var(--yellow);
	}

	.stat span {
		font-size: clamp(0.8rem, 1.3vmin, 0.95rem);
		color: var(--ink-mute);
		letter-spacing: 0.03em;
	}

	/* --- outro --- */
	.outro {
		display: flex;
		flex-direction: column;
		gap: clamp(0.4rem, 1.1vmin, 0.9rem);
	}

	.verdict {
		margin: 0;
		padding: clamp(0.55rem, 1.35vmin, 1.05rem) clamp(0.7rem, 1.6vmin, 1.2rem);
		border-radius: 12px;
		border: 1px solid #fac61f42;
		background: #fac61f12;
		font-size: clamp(0.8rem, 1.62vmin, 1.2rem);
		line-height: 1.55;
		color: var(--ink-dim);
		max-width: none;
	}

	.verdict b {
		color: var(--yellow);
		font-weight: 700;
	}

	.links {
		display: flex;
		align-items: center;
		gap: clamp(0.7rem, 2vmin, 1.6rem);
		margin: 0;
		font-size: clamp(0.8rem, 1.46vmin, 1.08rem);
		color: var(--ink-mute);
	}

	.thanks {
		font-weight: 700;
		color: var(--ink);
	}

	.links em {
		font-style: normal;
		opacity: 0.4;
		margin: 0 0.25em;
	}

	.links code {
		font-family: var(--font-mono);
		color: var(--cyan);
	}
</style>
