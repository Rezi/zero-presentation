<script lang="ts">
	import Code from '$lib/Code.svelte';

	let { step }: { step: number } = $props();

	const schemaSrc = `// zero/schema.ts — mirrors your Postgres tables, fully typed
const issue = table('issue')
  .columns({
    id: string(),
    title: string(),
    status: enumeration<'open' | 'closed'>(),
    ownerID: string().optional(),
  })
  .primaryKey('id')

const issueRels = relationships(issue, ({one, many}) => ({
  owner: one({sourceField: ['ownerID'], destSchema: user, destField: ['id']}),
  comments: many({sourceField: ['id'], destSchema: comment,
                  destField: ['issueID']}),
}))`;

	const zqlSrc = `// the same query language on the client and the server
zql.issue
  .where('status', 'open')            // '=' is the default op
  .where(({cmp, or, exists}) =>
    or(cmp('priority', 'critical'), exists('comments')),
  )
  .related('comments', q =>
    q.orderBy('modified', 'desc').limit(100).related('reactions'),
  )
  .orderBy('created', 'desc')
  .limit(50)
  .start(lastRow)                     // keyset paging

zql.issue.where('id', 42).one()`;

	const ops = ['=', '!=', '<', '<=', '>', '>=', 'LIKE', 'ILIKE', 'IN', 'NOT IN', 'IS', 'IS NOT'];

	const limits = [
		'Whole rows only — you cannot select individual columns.',
		'No aggregations: no <code>count</code>, <code>sum</code>, <code>avg</code>.',
		'No <code>orderBy</code>/<code>limit</code> through a junction table.'
	];
</script>

<p class="eyebrow step on">Schema &amp; ZQL</p>
<h2 class="slide-title step on">
	One <span class="accent">typed schema</span>, one
	<span class="accent">query language</span>.
</h2>

<div class="grid">
	<div class="col">
		<div class="pane step on">
			<Code label="schema · tables + relationships" code={schemaSrc} />
		</div>

		<div class="orm step" class:on={step >= 1}>
			<h4>Already have an ORM? Generate it.</h4>
			<ul>
				<li><b>Drizzle</b><code>npx drizzle-zero generate</code></li>
				<li><b>Prisma</b><code>npx prisma generate</code></li>
			</ul>
			<p>
				Add <code>drizzle-zero</code> or the <code>generator zero</code> block and the schema stays in
				lockstep with your migrations.
			</p>
		</div>
	</div>

	<div class="col">
		<div class="pane step" class:on={step >= 2}>
			<Code label="ZQL · reads, client and server" code={zqlSrc} />
		</div>

		<div class="step" class:on={step >= 3}>
			<ul class="ops">
				{#each ops as o (o)}
					<li>{o}</li>
				{/each}
			</ul>

			<ul class="limits">
				{#each limits as l (l)}
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					<li>{@html l}</li>
				{/each}
			</ul>

		
		</div>
	</div>
</div>

<style>
	.grid {
		flex: 1;
		min-height: 0;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: clamp(0.6rem, 1.8vmin, 1.5rem);
	}

	.col {
		display: flex;
		flex-direction: column;
		gap: clamp(0.5rem, 1.4vmin, 1.1rem);
		min-height: 0;
	}

	.pane {
		display: flex;
		min-height: 0;
		flex: 0 1 auto;
	}

	.pane :global(.code) {
		flex: 1;
	}

	/* --- ORM generation --- */
	.orm {
		padding: clamp(0.55rem, 1.35vmin, 1.05rem) clamp(0.7rem, 1.6vmin, 1.2rem);
		border-radius: 12px;
		border: 1px solid var(--navy-line);
		background: #ffffff07;
	}

	.orm h4 {
		margin: 0 0 0.5em;
		font-size: clamp(0.8rem, 1.5vmin, 1.1rem);
		font-weight: 600;
		color: var(--cyan);
	}

	.orm ul {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem 1.2rem;
		margin: 0 0 0.5em;
		padding: 0;
		list-style: none;
	}

	.orm li {
		display: flex;
		align-items: baseline;
		gap: 0.5em;
		font-size: clamp(0.8rem, 1.4vmin, 1.05rem);
	}

	.orm li b {
		color: var(--ink);
		font-weight: 600;
	}

	.orm p {
		margin: 0;
		font-size: clamp(0.8rem, 1.32vmin, 0.98rem);
		line-height: 1.5;
		color: var(--ink-mute);
	}

	.orm code {
		font-family: var(--font-mono);
		font-size: 0.92em;
		color: var(--yellow);
	}

	/* --- ZQL operators --- */
	.ops {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		margin: 0 0 0.6em;
		padding: 0;
		list-style: none;
	}

	.ops li {
		padding: 0.15em 0.5em;
		border: 1px solid var(--navy-line);
		border-radius: 5px;
		background: #ffffff08;
		font-family: var(--font-mono);
		font-size: clamp(0.8rem, 1.28vmin, 0.95rem);
		color: var(--ink-dim);
	}

	/* --- what ZQL will not do --- */
	.limits {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.35em;
	}

	.limits li {
		position: relative;
		padding-left: 1.2em;
		font-size: clamp(0.8rem, 1.32vmin, 0.98rem);
		line-height: 1.5;
		color: var(--ink-mute);
	}

	.limits li::before {
		content: '×';
		position: absolute;
		left: 0;
		color: #ff8f8f;
		font-weight: 700;
	}

	.limits :global(code) {
		font-family: var(--font-mono);
		font-size: 0.92em;
		color: var(--cyan);
	}

	/* neutral fact, deliberately not marked as a limitation */
	.fact {
		margin: 0.6em 0 0;
		padding-left: 1.2em;
		border-left: 2px solid #73c37c4d;
		font-size: clamp(0.8rem, 1.32vmin, 0.98rem);
		line-height: 1.5;
		color: var(--ink-mute);
	}

	.fact code {
		font-family: var(--font-mono);
		font-size: 0.92em;
		color: var(--cyan);
	}
</style>
