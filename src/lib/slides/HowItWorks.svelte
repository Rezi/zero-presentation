<script lang="ts">
	let { step }: { step: number } = $props();

	/* step 0 = diagram only, steps 1..5 = the query/mutation lifecycle */
	const phases = [
		{
			k: 'Read locally',
			d: 'A query runs against the local store <b>first</b> and returns whatever is already there — synchronously, no network, no spinner.'
		},
		{
			k: 'Name, not SQL',
			d: 'Clients never send arbitrary queries. The client sends a query <b>name + args</b>; <code>zero-cache</code> calls your server, where you resolve it to ZQL and enforce permissions from <code>ctx</code>.'
		},
		{
			k: 'Run on the replica',
			d: '<code>zero-cache</code> executes that ZQL against its <b>SQLite replica</b> and streams the authoritative rows back into the client store.'
		},
		{
			k: 'Stay live',
			d: 'Postgres logical replication feeds the replica. <code>zero-cache</code> recomputes the affected queries and pushes <b>only the deltas</b> to every client watching them.'
		},
		{
			k: 'Write through',
			d: 'A mutator applies to the local store instantly, then runs for real in a <b>Postgres transaction</b> on your server. When the authoritative rows arrive, the optimistic effects roll back.'
		}
	];

	const active = $derived(step >= 1 ? phases[step - 1] : null);

	const ws = $derived(step >= 2);
	const wsRev = $derived(step === 3 || step === 4);
	const qs = $derived(step === 2 || step === 5);
	const repl = $derived(step === 4);
	const mut = $derived(step === 5);
	const clientHot = $derived(step === 1 || step === 5);
	const cacheHot = $derived(step === 3 || step === 4);
	const pgHot = $derived(step === 4 || step === 5);
	const srvHot = $derived(step === 2 || step === 5);
</script>

<p class="eyebrow step on">How it works</p>
<h2 class="slide-title step on">
	Two moving parts: <span class="accent">zero-client</span> and
	<span class="accent">zero-cache</span>.
</h2>

<div class="diagram">
	<svg viewBox="0 0 1000 372" role="img" aria-label="Zero architecture">
		<defs>
			<marker
				id="ar"
				viewBox="0 0 10 10"
				refX="8"
				refY="5"
				markerWidth="6"
				markerHeight="6"
				orient="auto-start-reverse"
			>
				<path d="M0 0 L10 5 L0 10 z" fill="#3a3a50" />
			</marker>
		</defs>

		<!-- ============ edges (base + animated flow overlay) ============ -->
		<!-- client <-> zero-cache -->
		<path class="base" d="M252 236 H384" marker-end="url(#ar)" marker-start="url(#ar)" />
		<path class="flow" class:on={ws} class:rev={wsRev} d="M252 236 H384" />
		<text class="edge" x="318" y="222">WebSocket</text>

		<!-- zero-cache <-> postgres -->
		<path class="base" d="M616 236 H748" marker-end="url(#ar)" marker-start="url(#ar)" />
		<path class="flow" class:on={repl} class:rev={true} d="M616 236 H748" />
		<text class="edge" x="682" y="215">logical</text>
		<text class="edge" x="682" y="228">replication</text>

		<!-- zero-cache -> your server (query resolution) -->
		<path class="base" d="M470 150 V120" marker-end="url(#ar)" marker-start="url(#ar)" />
		<path class="flow" class:on={qs} d="M470 150 V120" />
		<text class="edge left" x="484" y="133">get-queries</text>
		<text class="edge left" x="484" y="147">push</text>

		<!-- your server -> postgres (authoritative writes) -->
		<path class="base" d="M616 74 H856 V148" marker-end="url(#ar)" />
		<path class="flow" class:on={mut} d="M616 74 H856 V148" />
		<text class="edge" x="726" y="62">SQL transaction</text>

		<!-- ============ nodes ============ -->
		<!-- your server -->
		<g class="node" class:hot={srvHot}>
			<rect x="330" y="26" width="286" height="92" rx="12" />
			<text class="ttl" x="352" y="56">Your server</text>
			<text class="sub" x="352" y="78">business logic · permissions</text>
			<text class="mono" x="352" y="99">ZERO_QUERY_URL · ZERO_MUTATE_URL</text>
		</g>

		<!-- browser client -->
		<g class="node" class:hot={clientHot}>
			<rect x="30" y="152" width="222" height="168" rx="12" />
			<text class="ttl" x="52" y="182">Browser</text>
			<text class="sub" x="52" y="204">zero-client</text>
			<rect class="inner" x="52" y="218" width="178" height="36" rx="7" />
			<text class="mono in" x="66" y="241">useQuery() · mutators</text>
			<rect class="inner" x="52" y="262" width="178" height="42" rx="7" />
			<text class="mono in" x="66" y="280">local store (IndexedDB)</text>
			<text class="mono in dim" x="66" y="296">+ client-side ZQL</text>
		</g>

		<!-- zero-cache -->
		<g class="node" class:hot={cacheHot}>
			<rect x="384" y="152" width="232" height="168" rx="12" />
			<text class="ttl" x="406" y="182">zero-cache</text>
			<text class="sub" x="406" y="204">streaming query engine</text>
			<rect class="inner" x="406" y="218" width="188" height="42" rx="7" />
			<text class="mono in" x="420" y="236">SQLite replica</text>
			<text class="mono in dim" x="420" y="252">attached NVMe</text>
			<rect class="inner" x="406" y="268" width="188" height="36" rx="7" />
			<text class="mono in" x="420" y="291">incremental view maint.</text>
		</g>

		<!-- postgres -->
		<g class="node" class:hot={pgHot}>
			<rect x="748" y="152" width="222" height="168" rx="12" />
			<text class="ttl" x="770" y="182">Postgres</text>
			<text class="sub" x="770" y="204">your existing database</text>
			<rect class="inner" x="770" y="218" width="178" height="36" rx="7" />
			<text class="mono in" x="784" y="241">source of truth</text>
			<text class="mono in dim" x="770" y="284">no schema takeover,</text>
			<text class="mono in dim" x="770" y="300">no proprietary backend</text>
		</g>
	</svg>
</div>

<div class="rail">
	{#each phases as p, i (p.k)}
		<button class="pill" class:on={step === i + 1} class:past={step > i + 1} disabled>
			<b>{i + 1}</b>{p.k}
		</button>
	{/each}
</div>

<div class="explain" class:empty={!active}>
	{#if active}
		{#key active.k}
			<p class="step on">
				<span class="badge">{step}</span>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				<span>{@html active.d}</span>
			</p>
		{/key}
	{:else}
		<p class="hint-line">
			The cache holds a read-only replica of Postgres; the client holds the rows your queries
			touched.
		</p>
	{/if}
</div>

<style>
	.diagram {
		flex: 1;
		min-height: 0;
		display: flex;
		justify-content: center;
	}

	svg {
		width: 100%;
		height: 100%;
		max-height: 100%;
		overflow: visible;
	}

	/* --- nodes --- */
	.node rect {
		fill: #1a1a26;
		stroke: var(--navy-line);
		stroke-width: 1.5;
		transition:
			stroke 0.4s var(--ease),
			fill 0.4s var(--ease);
	}

	.node rect.inner {
		fill: #12121b;
		stroke: #26263a;
	}

	.node.hot > rect {
		stroke: var(--yellow);
		fill: #221f1a;
	}

	.node.hot .ttl {
		fill: var(--yellow);
	}

	.ttl {
		font-family: var(--font-sans);
		font-size: 19px;
		font-weight: 700;
		fill: var(--ink);
		transition: fill 0.4s var(--ease);
	}

	.sub {
		font-family: var(--font-sans);
		font-size: 12.5px;
		font-weight: 500;
		fill: var(--cyan);
		letter-spacing: 0.02em;
	}

	.mono {
		font-family: var(--font-mono);
		font-size: 11.5px;
		fill: var(--ink-mute);
	}

	.mono.in {
		fill: var(--ink-dim);
	}

	.mono.dim {
		fill: #6f6f85;
	}

	/* --- edges --- */
	.base {
		fill: none;
		stroke: #3a3a50;
		stroke-width: 1.5;
	}

	.flow {
		fill: none;
		stroke: var(--yellow);
		stroke-width: 2.5;
		stroke-dasharray: 9 13;
		opacity: 0;
		transition: opacity 0.35s var(--ease);
		filter: drop-shadow(0 0 5px #fac61f9e);
	}

	.flow.on {
		opacity: 1;
		animation: dash 0.85s linear infinite;
	}

	.flow.rev {
		animation-direction: reverse;
	}

	@keyframes dash {
		to {
			stroke-dashoffset: -22;
		}
	}

	.edge {
		font-family: var(--font-mono);
		font-size: 11px;
		fill: var(--ink-mute);
		text-anchor: middle;
	}

	.edge.left {
		text-anchor: start;
	}

	/* --- stepper rail --- */
	.rail {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.pill {
		display: flex;
		align-items: center;
		gap: 0.5em;
		padding: 0.4em 0.8em;
		border: 1px solid var(--navy-line);
		border-radius: 999px;
		background: #ffffff05;
		font-family: var(--font-sans);
		font-size: clamp(0.8rem, 1.18vmin, 0.88rem);
		font-weight: 500;
		color: #6f6f85;
		transition: all 0.35s var(--ease);
	}

	.pill b {
		display: grid;
		place-items: center;
		width: 1.45em;
		height: 1.45em;
		border-radius: 50%;
		background: #ffffff12;
		font-family: var(--font-mono);
		font-size: 0.85em;
		color: inherit;
	}

	.pill.past {
		color: var(--ink-mute);
		border-color: #34344a;
	}

	.pill.past b {
		background: #2e2e42;
		color: var(--ink-dim);
	}

	.pill.on {
		border-color: var(--yellow);
		background: #fac61f16;
		color: var(--ink);
		font-weight: 600;
	}

	.pill.on b {
		background: var(--yellow);
		color: var(--navy);
		font-weight: 700;
	}

	/* --- explanation --- */
	.explain {
		min-height: clamp(3.2rem, 8vmin, 4.6rem);
		display: flex;
		align-items: flex-start;
	}

	.explain p {
		display: flex;
		gap: 0.75em;
		margin: 0;
		font-size: clamp(0.8rem, 1.42vmin, 1.05rem);
		line-height: 1.55;
		color: var(--ink-dim);
		max-width: 104ch;
	}

	.explain :global(b) {
		color: var(--ink);
		font-weight: 600;
	}

	.explain :global(code) {
		font-family: var(--font-mono);
		font-size: 0.9em;
		padding: 0.1em 0.35em;
		border-radius: 4px;
		background: #ffffff0f;
		color: var(--cyan);
	}

	.badge {
		flex: none;
		display: grid;
		place-items: center;
		width: 1.75em;
		height: 1.75em;
		border-radius: 50%;
		background: var(--yellow);
		color: var(--navy);
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.92em;
	}

	.hint-line {
		color: var(--ink-mute) !important;
		font-style: italic;
	}
</style>
