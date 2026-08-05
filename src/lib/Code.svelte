<script lang="ts">
	/* Tiny dependency-free TS/TSX highlighter — enough for slide-sized snippets. */

	let { code, label = '' }: { code: string; label?: string } = $props();

	type Tok = { t: string; k: string };

	const RE = new RegExp(
		[
			'(\\/\\/[^\\n]*)', // 1 comment
			'(`(?:\\\\.|[^`\\\\])*`|\'(?:\\\\.|[^\'\\\\])*\'|"(?:\\\\.|[^"\\\\])*")', // 2 string
			'\\b(await|async|const|let|var|return|if|else|throw|new|import|from|export|' +
				'function|type|interface|for|of|in|try|catch|null|undefined|true|false)\\b', // 3 keyword
			'\\b(\\d+(?:\\.\\d+)?)\\b', // 4 number
			'([A-Za-z_$][\\w$]*)(?=\\s*\\()', // 5 call
			'([{}()\\[\\],;:.=><?|&+*/!-])' // 6 punctuation
		].join('|'),
		'g'
	);

	const KIND = ['', 'com', 'str', 'kw', 'num', 'fn', 'punc'];

	const tokens = $derived.by(() => {
		const out: Tok[] = [];
		const src = code.replace(/^\n+|\s+$/g, '');
		let last = 0;
		RE.lastIndex = 0;
		let m: RegExpExecArray | null;
		while ((m = RE.exec(src))) {
			if (m.index > last) out.push({ t: src.slice(last, m.index), k: '' });
			const g = m.findIndex((v, i) => i > 0 && v !== undefined);
			out.push({ t: m[0], k: KIND[g] ?? '' });
			last = m.index + m[0].length;
		}
		if (last < src.length) out.push({ t: src.slice(last), k: '' });
		return out;
	});
</script>

<figure class="code">
	{#if label}
		<figcaption>{label}</figcaption>
	{/if}
	<pre><code
			>{#each tokens as tok (tok)}{#if tok.k}<span class={tok.k}>{tok.t}</span
					>{:else}{tok.t}{/if}{/each}</code
		></pre>
</figure>

<style>
	.code {
		margin: 0;
		display: flex;
		flex-direction: column;
		min-height: 0;
		border: 1px solid var(--navy-line);
		border-radius: 12px;
		background: #101018;
		overflow: hidden;
	}

	figcaption {
		display: flex;
		align-items: center;
		gap: 0.5em;
		padding: 0.55em 0.9em;
		border-bottom: 1px solid var(--navy-line);
		background: #16161f;
		font-family: var(--font-mono);
		font-size: clamp(0.55rem, 1.05vmin, 0.8rem);
		letter-spacing: 0.06em;
		color: var(--ink-mute);
	}

	figcaption::before {
		content: '';
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--yellow);
		box-shadow: 0 0 8px var(--yellow);
		flex: none;
	}

	pre {
		margin: 0;
		padding: clamp(0.7rem, 1.5vmin, 1.15rem);
		overflow: auto;
		min-height: 0;
	}

	code {
		font-family: var(--font-mono);
		font-size: clamp(0.5rem, 1.19vmin, 0.92rem);
		line-height: 1.7;
		color: #e4e4ef;
		white-space: pre;
		tab-size: 2;
	}

	.com {
		color: #6b6b80;
		font-style: italic;
	}
	.str {
		color: var(--green);
	}
	.kw {
		color: var(--yellow);
	}
	.num {
		color: #d8a0f0;
	}
	.fn {
		color: var(--cyan);
	}
	.punc {
		color: #8a8aa0;
	}
</style>
