<script lang="ts">
import { fade } from 'svelte/transition';
import { flip } from 'svelte/animate';
import moment from 'moment';
import axios from '$lib/axios';

import type Prisma from "@prisma/client";
import type { Admin } from "$lib/types";
import type { AxiosResponse } from 'axios';

let { posts = $bindable(), admin }: { posts: Prisma.Post[], admin: Admin } = $props();

async function deletePost(id: number) {
    if (!window.confirm("Are you sure?")) {
        return;
    }

    const res: AxiosResponse = await axios
        .post("/api/delete-post", { id })
        .then((res) => res)
        .catch((err) => err.response);
    if (res.status === 200) {
        posts = posts.filter(v => v.id != id);
    }
}
</script>

{#each posts as post (post.id)}
    <div
        class="sm:max-w-[89%] max-w-[78%] bg-gray-600 rounded w-fit ml-5 m-1 relative"
        in:fade={{ delay: 200, duration: 200 }}
        out:fade={{ duration: 200 }}
        animate:flip={{ delay: 200, duration: 200 }}
    >
        <p style="overflow-wrap: break-word;" class="whitespace-pre-wrap p-1 px-2"> {post.text} </p>
        <div
            class="absolute text-sm top-[0.1rem] -left-[1.65rem] h-fit w-fit p-1 rounded-md"
        >
            {#if post.is_prayer_request} 🙏 {:else} 🎉 {/if}
        </div>
        <div
            class="w-fit absolute -bottom-[2px] -right-[3.78rem] text-xs text-gray-300">
            {moment(post.createdAt).format("ddd HH:mm")}
        </div>
        {#if admin}
            <button
                onclick={() => deletePost(post.id)}
                class="absolute bottom-[0.97rem] -right-[1.6rem] h-4 bg-red-400 rounded border border-transparent">
                <img src="/trash.svg" alt="trash" />
            </button>
        {/if}
    </div>
{:else}
    <div class="w-full h-36 flex justify-center items-center text-sm italic">
        None yet...
    </div>
{/each}
