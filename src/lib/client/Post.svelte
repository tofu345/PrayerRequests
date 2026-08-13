<script lang="ts">
import moment from 'moment';

import type Prisma from '@prisma/client';

import { postTypeEmoji } from '$lib/client/utils';

// an action performed in the parent component
type Action = (id: number) => void;

type Props = {
    isAdmin: boolean,
    post: Prisma.Post,
    currentEdit: number | null,
    editIds: Map<number, string>,
    startEdit: Action,
    resetInput: Action,
    deletePost: Action,
};
let {
    isAdmin, post, currentEdit, editIds, startEdit, resetInput, deletePost
}: Props = $props();

const imageWidth = 12.25;
const imageClass = "p-[0.2rem] rounded";
</script>

<div class="text-lg mr-1 mt-1"> {postTypeEmoji(post.postType)} </div>
<div class="bg-gray-600 rounded h-fit my-auto">
    <p
        style="overflow-wrap: break-word;"
        class="truncate text-base whitespace-pre-wrap p-1 px-2"
    >
        {post.text}
    </p>
</div>
<div class="ml-[0.4rem] flex flex-col justify-between w-fit gap-[1px]">
    <div class="flex gap-1 h-5" class:w-10={isAdmin || currentEdit}>
        {#if isAdmin}
            <button
                onclick={() => deletePost(post.id)}
                class="{imageClass} bg-red-400">
                <img width="{imageWidth}" src="/trash.svg" alt="delete" />
            </button>
        {/if}

        {#if currentEdit === post.id}
            <button
                onclick={() => resetInput(post.id)}
                class="{imageClass} bg-red-400">
                <img width="{imageWidth}" src="/close.svg" alt="close" />
            </button>
        {:else if isAdmin || editIds.has(post.id)}
            <button
                onclick={() => startEdit(post.id)}
                class="{imageClass} bg-blue-400">
                <img width="{imageWidth}" src="/edit.svg" alt="edit" />
            </button>
        {/if}
    </div>
    <p class="text-xs text-gray-300 w-fit whitespace-pre-wrap">
        {moment(post.createdAt).format("ddd Do MMM")}
    </p>
</div>
