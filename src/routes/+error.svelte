<script lang="ts">
	import { page } from '$app/stores';
	import { Home } from 'lucide-svelte';
</script>

<div class="flex flex-col justify-center items-center mt-2 mb-2">
	<div class="overflow-hidden mt-4 mb-4">
		<div class="p-6">
			<h1 class="text-2xl font-semibold">
				{#if $page.status === 404}
					🙄 Page Not Found
				{:else if $page.status === 500}
					🪲 We have a problem!
				{:else}
					⚠️ Error {$page.status}
				{/if}
			</h1>
		</div>
		<div class="p-6">
			{#if $page.status === 404}
				<div>We can't seem to find the page you're looking for.</div>
			{:else if $page.status === 500}
				<div>We're having trouble processing your request.</div>
				<div class="mt-4">
					Please,
					<a
						href={`https://github.com/${__SITE_CONFIG__.organizationName}/${__SITE_CONFIG__.projectName}/issues`}
						target="_blank"
						rel="noindex,nofollow"
					>
						report the problem
					</a>
					and try again later.
				</div>
			{:else}
				<div>{$page.error?.message || 'Unexpected error.'}</div>
			{/if}
			<div class="mt-4">
				<a href="/" class="flex items-center">
					<Home class="mr-2" />
					<span>Go back home</span>
				</a>
			</div>
		</div>
	</div>
</div>
