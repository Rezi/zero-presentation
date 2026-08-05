<script lang="ts">
	let { step }: { step: number } = $props();
</script>

<div class="title-slide">
	<p class="eyebrow step on">
		Applifting <span>·</span> ⚡️Frontend Lightning Talks⚡️ <span>·</span> August 2026
	</p>

	<h1 class="hero step on">
		Zero<em>.</em>
	</h1>

	<div class="rule step" class:on={step >= 1}></div>

	<p class="claim step" class:on={step >= 1}>
		A <b>query-driven sync engine</b> for TypeScript apps &mdash; it replicates Postgres, then syncs exactly
		the rows your queries ask for.
	</p>

	<blockquote class="quote step" class:on={step >= 1}>
		&ldquo;Build absurdly <i>fast</i> web applications.&rdquo;
		<cite>rocicorp.dev</cite>
	</blockquote>

	<ul class="chips step" class:on={step >= 2}>
		<li>Instant reads</li>
		<li>Instant writes</li>
		<li>Reactive by default</li>
		<li class="hot">&lt; 1s load</li>
	</ul>

	
</div>

<style>
	.title-slide {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: clamp(0.5rem, 1.5vmin, 1.2rem);
		height: 100%;
		max-width: 68ch;
	}

	.eyebrow span {
		opacity: 0.45;
		margin: 0 0.15em;
	}

	.hero {
		margin: 0;
		font-size: clamp(4rem, 17vmin, 15rem);
		font-weight: 900;
		letter-spacing: -0.055em;
		line-height: 0.86;
		background: linear-gradient(96deg, #ffffff 12%, #ffe9a8 52%, var(--yellow) 96%);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		filter: drop-shadow(0 12px 60px #fac61f2b);
	}

	.hero em {
		font-style: normal;
		color: var(--yellow);
		-webkit-text-fill-color: var(--yellow);
	}

	.rule {
		width: clamp(3rem, 9vmin, 7rem);
		height: 4px;
		border-radius: 2px;
		background: var(--yellow);
		box-shadow: 0 0 16px #fac61f80;
	}

	.claim {
		margin: 0;
		max-width: 46ch;
		font-size: clamp(0.9rem, 2.15vmin, 1.6rem);
		font-weight: 400;
		line-height: 1.5;
		color: var(--ink-dim);
	}

	.claim b {
		color: var(--ink);
		font-weight: 600;
	}

	.quote {
		margin: 0;
		padding-left: clamp(0.7rem, 1.6vmin, 1.2rem);
		border-left: 2px solid var(--navy-line);
		font-size: clamp(0.8rem, 1.5vmin, 1.1rem);
		color: var(--ink-mute);
	}

	.quote i {
		color: var(--cyan);
		font-weight: 500;
	}

	.quote cite {
		display: block;
		margin-top: 0.3em;
		font-family: var(--font-mono);
		font-size: 0.8em;
		font-style: normal;
		letter-spacing: 0.05em;
		opacity: 0.7;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 0.2rem 0 0;
		padding: 0;
		list-style: none;
	}

	.chips li {
		padding: 0.42em 0.85em;
		border: 1px solid var(--navy-line);
		border-radius: 999px;
		background: #ffffff08;
		font-size: clamp(0.8rem, 1.2vmin, 0.9rem);
		font-weight: 500;
		color: var(--ink-dim);
	}

	.chips .hot {
		border-color: #fac61f5c;
		background: #fac61f14;
		color: var(--yellow);
		font-weight: 600;
	}

	.by {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		margin: clamp(0.3rem, 1.2vmin, 1rem) 0 0;
		font-size: clamp(0.8rem, 1.3vmin, 1.0rem);
	}

	.who {
		font-weight: 600;
		color: var(--ink);
	}

	.sep {
		width: clamp(1.5rem, 5vmin, 4rem);
		height: 1px;
		background: var(--navy-line);
	}

	.nudge {
		display: flex;
		align-items: center;
		gap: 0.35em;
		color: var(--ink-mute);
		font-size: 0.9em;
	}
</style>
