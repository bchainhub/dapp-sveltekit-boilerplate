<script>
	export let id = '';
	export let name = '';
	export let checked = false;
	export let onChange = () => {};
	export let label = '';
</script>

<div class="flex items-center gap-2">
	<label
		class="relative inline-block h-7 w-[48px] cursor-pointer rounded-full bg-gray-900 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-[#1976D2]"
	>
		<input
			type="checkbox"
			id={id}
			name={name}
			bind:checked
			class="peer sr-only"
			on:change={onChange}
		/>
		<span
			class="absolute inset-y-0 start-0 m-1 size-5 rounded-full bg-gray-300 ring-[5px] ring-inset ring-white transition-all peer-checked:start-7 bg-gray-900 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent"
		></span>
	</label>
	{#if label}
		<label for={id} class="text-sm text-gray-700">{label}</label>
	{/if}
</div>
