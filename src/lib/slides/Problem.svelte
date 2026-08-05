<script lang="ts">
	let { step }: { step: number } = $props();

	const pains = [
		{
			n: '01',
			k: 'Slow',
			d: 'Every interaction is a round trip — <b>hundreds of milliseconds</b> before the UI can respond. So you build spinners, skeletons and optimistic patches by hand.'
		},
		{
			n: '02',
			k: 'Stale',
			d: 'The client has <b>no idea when data changes</b>. You set up polling, cache keys and invalidation rules, and still ship stale screens.'
		},
		{
			n: '03',
			k: 'Fragile',
			d: 'Lose the network and the app <b>stops working entirely</b> — the data was never really on the device.'
		}
	];

	const gaps = [
		'Weak authorization',
		'Poor partial sync',
		'Non-standard backends',
		'Limited business logic'
	];
</script>

<p class="eyebrow step on">Why bother</p>
<h2 class="slide-title step on">
	Request/response is a <span class="accent">latency tax</span> on every click.
</h2>

<div class="cols">
	<div class="pains">
		{#each pains as p, i (p.n)}
			<article class="card pain step" class:on={step >= 1} style="transition-delay:{i * 90}ms">
				<span class="num">{p.n}</span>
				<h3>{p.k}</h3>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				<p>{@html p.d}</p>
			</article>
		{/each}
	</div>

	<aside class="side">
		<div class="block step" class:on={step >= 2}>
			<h4>The fix is known: a sync engine</h4>
			<p>
				Keep a local copy of the data on the device. Read and write locally, sync in the background.
				Instant UI, live updates, offline reads. The idea dates back to <b>Lotus Notes, 1989</b>.
			</p>
		</div>

		<div class="block step" class:on={step >= 2}>
			<h4>So why none use it?</h4>
			<p>
				&ldquo;Sync engines are <b>very hard to build</b>.&rdquo; Google Docs, Figma and Linear each
				built their own — at significant cost.
			</p>
		</div>

		<div class="block step" class:on={step >= 3}>
			<h4>General-purpose attempts fell short</h4>
			<p class="prior">Meteor <i>·</i> Firebase <i>·</i> PouchDB <i>·</i> Replicache</p>
			<ul class="gaps">
				{#each gaps as g (g)}
					<li>{g}</li>
				{/each}
			</ul>
		</div>

		<p class="punch step" class:on={step >= 3}>
			Zero targets exactly those four &mdash; on <b>your</b> Postgres, behind <b>your</b> server.
		</p>
	</aside>
</div>

<style>
	.cols {
		display: grid;
		grid-template-columns: 1.05fr 0.95fr;
		gap: clamp(0.9rem, 2.6vmin, 2.4rem);
		align-items: start;
		min-height: 0;
	}

	.pains {
		display: flex;
		flex-direction: column;
		gap: clamp(0.5rem, 1.3vmin, 1rem);
	}

	.pain {
		position: relative;
		padding-left: clamp(2.6rem, 6vmin, 4.4rem);
	}

	.num {
		position: absolute;
		left: clamp(0.9rem, 1.9vmin, 1.5rem);
		top: clamp(0.85rem, 1.8vmin, 1.45rem);
		font-family: var(--font-mono);
		font-size: clamp(0.8rem, 1.42vmin, 1.05rem);
		font-weight: 600;
		color: var(--yellow);
		opacity: 0.75;
	}

	.pain h3 {
		margin: 0 0 0.25em;
		font-size: clamp(0.95rem, 2.25vmin, 1.65rem);
		font-weight: 700;
		letter-spacing: -0.01em;
	}

	.pain p {
		margin: 0;
		font-size: clamp(0.8rem, 1.6vmin, 1.18rem);
		line-height: 1.55;
		color: var(--ink-mute);
	}

	.pain :global(b) {
		color: var(--ink-dim);
		font-weight: 600;
	}

	.side {
		display: flex;
		flex-direction: column;
		gap: clamp(0.5rem, 1.5vmin, 1.15rem);
		padding-left: clamp(0.8rem, 2.2vmin, 2rem);
		border-left: 1px solid var(--navy-line);
	}

	.block h4 {
		margin: 0 0 0.3em;
		font-size: clamp(0.8rem, 1.66vmin, 1.22rem);
		font-weight: 600;
		color: var(--cyan);
	}

	.block p {
		margin: 0;
		font-size: clamp(0.8rem, 1.54vmin, 1.14rem);
		line-height: 1.55;
		color: var(--ink-mute);
	}

	.block b {
		color: var(--ink-dim);
		font-weight: 600;
	}

	.prior {
		font-family: var(--font-mono);
		font-size: clamp(0.8rem, 1.36vmin, 1rem) !important;
		color: var(--ink-dim) !important;
		margin-bottom: 0.5em !important;
	}

	.prior i {
		opacity: 0.4;
		font-style: normal;
		margin: 0 0.2em;
	}

	.gaps {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.3rem 0.7rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.gaps li {
		display: flex;
		align-items: baseline;
		gap: 0.45em;
		font-size: clamp(0.8rem, 1.44vmin, 1.06rem);
		color: var(--ink-dim);
	}

	.gaps li::before {
		content: '×';
		color: #ff7b7b;
		font-weight: 700;
		flex: none;
	}

	.punch {
		margin: 0.1rem 0 0;
		padding: clamp(0.55rem, 1.3vmin, 1rem) clamp(0.7rem, 1.5vmin, 1.15rem);
		border-radius: 12px;
		border: 1px solid #fac61f42;
		background: #fac61f12;
		font-size: clamp(0.8rem, 1.62vmin, 1.2rem);
		line-height: 1.5;
		color: var(--ink);
	}

	.punch b {
		color: var(--yellow);
		font-weight: 700;
	}
</style>
