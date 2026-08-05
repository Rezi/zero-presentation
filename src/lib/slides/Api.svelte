<script lang="ts">
	import Code from '$lib/Code.svelte';

	let { step }: { step: number } = $props();

	const queriesSrc = `// zero/queries.ts — one definition, used by client AND server
export const queries = defineQueries({
  posts: {
    byAuthor: defineQuery(
      z.object({authorID: z.string(), includeDrafts: z.boolean().optional()}),
      ({args: {authorID, includeDrafts}}) => {
        let q = zql.post.where('authorID', authorID)
        if (!includeDrafts) {
          q = q.where('isDraft', false)
        }
        return q
      },
    ),
  },
})`;

	const useQuerySrc = `const [posts, result] = useQuery(
  queries.posts.byAuthor({authorID: 'usr_123'}),
  {ttl: '5m'},
)

// rows are there instantly; result.type flips to
// 'complete' once the server has confirmed them`;

	const mutatorSrc = `export const mutators = defineMutators({
  addComment: defineMutator(
    z.object({id: z.string(), issueID: z.string(), text: z.string()}),
    async ({tx, ctx: {userID}, args}) => {
      // read-before-write, in the same transaction
      const issue = await tx.run(zql.issue.where('id', args.issueID).one())

      // throwing rolls the whole mutation back
      if (issue?.status === 'closed') {
        throw new Error('Issue is closed')
      }

      // userID comes from the server — unforgeable
      await tx.mutate.comment.insert({...args, authorID: userID})
    },
  ),
})`;

	const notes = [
		'Mutators run <b>more than once</b> — optimistically on the client, then authoritatively on the server.',
		'Treat everything <code>useQuery</code> returns as <b>immutable</b>.'
	];
</script>

<p class="eyebrow step on">The API surface</p>
<h2 class="slide-title step on">
	You write <span class="accent">queries</span> and <span class="accent">mutators</span>. That's the
	whole contract.
</h2>

<div class="grid">
	<div class="col">
		<div class="pane step on">
			<Code label="reads · ZQL" code={queriesSrc} />
		</div>
		<div class="pane short step" class:on={step >= 1}>
			<Code label="in your component" code={useQuerySrc} />
		</div>
	</div>

	<div class="col">
		<div class="pane step" class:on={step >= 2}>
			<Code label="writes · custom mutator" code={mutatorSrc} />
		</div>
		<ul class="notes step" class:on={step >= 3}>
			{#each notes as n (n)}
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				<li>{@html n}</li>
			{/each}
		</ul>
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
		/* hug the code, but stay shrinkable so short viewports scroll instead of overflow */
		flex: 0 1 auto;
	}

	.pane :global(.code) {
		flex: 1;
	}

	.pane.short {
		flex: 0 0 auto;
	}

	.notes {
		flex: 0 0 auto;
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.4em;
	}

	.notes li {
		position: relative;
		padding-left: 1.35em;
		font-size: clamp(0.8rem, 1.19vmin, 0.87rem);
		line-height: 1.5;
		color: var(--ink-mute);
	}

	.notes li::before {
		content: '!';
		position: absolute;
		left: 0;
		top: 0.05em;
		display: grid;
		place-items: center;
		width: 1.05em;
		height: 1.05em;
		border-radius: 50%;
		background: #fac61f26;
		color: var(--yellow);
		font-family: var(--font-mono);
		font-size: 0.82em;
		font-weight: 700;
	}

	.notes :global(b) {
		color: var(--ink-dim);
		font-weight: 600;
	}

	.notes :global(code) {
		font-family: var(--font-mono);
		font-size: 0.92em;
		color: var(--cyan);
	}
</style>
