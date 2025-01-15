<script lang="ts">
import type { EventCallback } from "./utils";

type Props = {
    onclick: EventCallback,
    emoji: string,
    str: string,
};

let { onclick, emoji, str }: Props = $props();
</script>

<!-- probably not necessary, this component -->
<!-- Will remove this next, eventually... -->
<button
    {onclick}
    class="pb-5 relative text-lg h-[80%] w-[50%] flex justify-center
        items-center border-2 border-transparent hover:border-gray-400
        hover:bg-gray-500 rounded-md cursor-pointer"
    >
    {emoji}
    <p class="absolute bottom-1 text-xs text-gray-100">
        {str}
    </p>
</button>
