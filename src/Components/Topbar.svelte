<script>
    export let layout = 1;
    let layouts = [1, 2, 3];
</script>

<header class="w-full text-gray-700 bg-white border-t border-gray-100 shadow-sm body-font">
    <div class="container flex flex-col items-start justify-between p-6 mx-auto md:flex-row">
        <button class="flex items-center mb-4 font-medium text-gray-900 title-font md:mb-0">
            <i class="fa-solid fa-camera">
                 \ Multi.COM 
            </i>
        </button>
        <nav class="flex flex-wrap items-center justify-center pl-24 text-base md:ml-auto md:mr-auto">
            {#each layouts as lay }
                <button class="mr-5 font-medium hover:text-gray-900" on:click|preventDefault="{() => (layout = lay)}">Style{lay}</button>
            {/each}
        </nav>
        <div class="items-center h-full">
            <p class="mr-5 font-medium hover:text-gray-900">Current Style : {layout}</p>
        </div>
    </div>
</header>
