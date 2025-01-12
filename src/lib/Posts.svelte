<script lang="ts">
import { fade } from 'svelte/transition';
import { flip } from 'svelte/animate';
import moment from 'moment';
import axios from '$lib/axios';

import { postTypeEmoji } from '$lib/utils';

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

<div class="flex flex-col gap-2">
    {#each posts as post (post.id)}
        <div
            class="w-full flex"
            in:fade={{ delay: 200, duration: 200 }}
            out:fade={{ duration: 200 }}
            animate:flip={{ delay: 200, duration: 200 }}
        >
            <div class="text-sm m-1 mr-2 self-center"> {postTypeEmoji(post.postType)} </div>
            <div class="bg-gray-600 rounded h-fit my-auto">
                <p
                    style="overflow-wrap: break-word;"
                    class="whitespace-pre-wrap p-1 px-2">
                    {post.text}
                </p>
            </div>
            <div class="mx-2 flex flex-col w-fit">
                <div class="h-full">
                    {#if admin}
                        <button
                            onclick={() => deletePost(post.id)}
                            class="bg-red-400 rounded border border-transparent">
                            <img src="/trash.svg" alt="trash" />
                        </button>
                    {/if}
                </div>
                <p
                    class="text-xs text-gray-300 w-fit whitespace-nowrap">
                    {moment(post.createdAt).format("ddd Do MMM")}
                </p>
            </div>
        </div>
    {:else}
        <div class="w-full h-36 flex justify-center items-center text-sm italic">
            None yet...
        </div>
    {/each}
</div>
