<script lang="ts">
import axios from '$lib/axios';
import { onMount } from 'svelte';
import { slide, fade } from 'svelte/transition';

import Posts from '$lib/Posts.svelte';
import SelectButton from '$lib/SelectButton.svelte';
import { preventDefault } from '$lib/utils';
import { deleteCookie } from '$lib/cookie';

import type { PageData } from './$types';
import type { AxiosResponse } from 'axios';

let { data }: { data: PageData }  = $props();
let loading = $state(true);

let today = new Date();
let dayOfWeek = today.getDay();
let dayOfMonth = today.getDate() - (dayOfWeek == 0 ? 6 : dayOfWeek)
let lastSunday = new Date(today.getFullYear(), today.getMonth(), dayOfMonth, 0, 0, 0);

let posts = $state(data.posts.filter(v => v.createdAt > lastSunday));
let oldPosts = $state(data.posts.filter(v => v.createdAt <= lastSunday));
let oldPostsShown = $state(false);

const States = {
    button: 0,
    textarea: 1,
    select: 2,
    submit: 3
};
let currentState = $state(States.button);
let disabled = $derived(currentState == States.submit);
let isPrayerRequest: boolean | null = null;
let submitErr = $state(false); // TODO? maybe event to trigger the animation? or js animation?
let text = $state("");

async function submitOnShiftEnter(e: KeyboardEvent) {
    if (e.key == "Enter" && e.shiftKey) {
        await submitForm(e);
    }
}

// wait for error animation
function animationDelay() {
    submitErr = true;
    setTimeout(() => {
        submitErr = false;
    }, 1000);
}

async function submitForm(_event: Event) {
    if (text === "") {
        return animationDelay();
    }

    if (isPrayerRequest === null) {
        currentState = States.select;
        return;
    }

    currentState = States.submit;
    submitErr = false;

    const res: AxiosResponse = await axios
        .post("/api/create-post", {
            text,
            is_prayer_request: isPrayerRequest
        })
        .then((res) => res)
        .catch((err) => err.response);
    isPrayerRequest = null;

    if (res.status === 400) {
        currentState = States.textarea;
        return animationDelay();
    }

    posts.splice(0, 0, res.data); // insert at beginning
    text = "";
    currentState = States.button;
}

function autoExpand (obj: any) {
    obj.style.height = Math.min(obj.scrollHeight, 150) + "px";
}

function focusOnCreate(el: HTMLTextAreaElement) {
    el.focus();
}

onMount(() => {
    loading = false;
});
</script>

{#if data.admin}
    <button
        class="absolute top-0 right-0 m-2 text-blue-300"
        onclick={() => {
            deleteCookie("token");
            window.location.reload();
        }}>
        Admin Logout
    </button>
{/if}

<div class="w-full flex justify-center mt-4">
    <a href="https://www.ikon.church">
        <img class="h-10" src="/IKON-Logo.png" alt="IKON" />
    </a>
</div>
<div class="w-full flex justify-center mb-2">
    <p class="text-sm">Prayer and Praise Requests</p>
</div>


<div class="h-fit w-full p-2 sm:flex sm:justify-center">
    <div class="p-3 rounded-lg flex flex-col border border-gray-500 sm:w-[80%] min-h-40">
        {#if loading}
            <div class="w-full h-36 flex justify-center items-center text-sm italic">
                Loading...
            </div>
        {:else}
            <Posts bind:posts={posts} admin={data.admin} />

            {#if oldPosts.length != 0}
                <div class="relative h-[36px] my-1">
                    <button
                        class="h-full w-full"
                        onclick={() => oldPostsShown = !oldPostsShown}
                        out:fade={{ delay: 300, duration: 0 }}
                    >
                        <div class="p-2 absolute -top-0 -left-[0.7rem] flex items-center gap-[0.4rem] cursor-pointer text-sm w-full">
                            {#if oldPostsShown}
                                <img src="/caret-down.svg" alt="caret-down" />
                            {:else}
                                <img src="/caret-right.svg" alt="caret-right" />
                            {/if}
                            <p> Last week </p>
                        </div>
                    </button>
                </div>
            {/if}

            {#if oldPostsShown}
                <div class="pl-1 w-full flex flex-col" transition:slide={{ duration: 300 }}>
                    <Posts bind:posts={oldPosts} admin={data.admin} />
                </div>
            {/if}
        {/if}
    </div>
</div>

<div class="w-full p-2 lg:mx-50 mb-2 flex justify-center">
    {#if currentState == States.submit}
        <div
            class="flex justify-center items-center bg-gray-600 rounded-lg h-[60px] w-full sm:w-[80%] px-1 text-sm">
            <div class="loader"></div>
        </div>

    {:else if currentState == States.select}
        <div
            class="flex justify-between items-center bg-gray-600 rounded-lg h-[60px] w-full sm:w-[80%] px-1 text-sm">
            <SelectButton
                onclick={(e) => {
                    isPrayerRequest = true;
                    submitForm(e);
                }}
                emoji="🙏"
                str="Prayer request"
            />
            <button
                class="w-8 h-full mx-5 rounded"
                onclick={() => {
                    currentState = States.textarea;
                    setTimeout(() => {
                        const obj = document.getElementById("textarea");
                        if (obj) { autoExpand(obj); }
                    }, 50);
                }}>
                <img
                    id="errorSvg"
                    src="/error.svg"
                    alt="error img"
                    class="w-full"
                />
            </button>
            <SelectButton
                onclick={(e) => {
                    isPrayerRequest = false;
                    submitForm(e);
                }}
                emoji="🎉"
                str="Praise report"
            />
        </div>

    {:else if currentState == States.textarea}
        <form
            onsubmit={preventDefault(submitForm)}
            class="relative w-full sm:w-[80%] h-fit p-2 rounded-lg border-2 border-gray-400 bg-gray-600 flex justify-between">
            <textarea
                {disabled}
                bind:value={text}
                oninput={(e) => autoExpand(e.target)}
                onkeypress={submitOnShiftEnter}
                rows="1"
                placeholder=""
                id="textarea"
                class="bg-transparent w-full outline-none resize-none mr-[30px]"
                use:focusOnCreate
                maxlength="280"
            ></textarea>
            <button class="bg-transparent p-1 absolute top-[0.25rem] right-1">
                {#if submitErr}
                    <img
                        id="errorSvg"
                        src="/error.svg"
                        alt="error img"
                        class="boop pos-y-wiggle"
                    />
                {:else}
                    <img src="/send.svg" alt="send img"/>
                {/if}
            </button>
        </form>

    {:else}
        <button
            onclick={() => {currentState = States.textarea}}
            class="outline-none border-2 border-transparent hover:border-gray-400 bg-gray-600 rounded-lg h-[44px] w-full sm:w-[80%] p-2 text-sm"
        > Submit Request </button>
    {/if}
</div>

<style>
.resize-none{
    resize: none;
}

.loader {
    width: 24px;
    height: 24px;
    border: 2px solid lightgray;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
}

@keyframes rotation {
0% {
    transform: rotate(0deg);
    -o-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
}
100% {
    transform: rotate(360deg);
    -o-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
}
}

@keyframes pos-y-wiggle {
0% {
    transform: translateX(0px);
    -o-transform: translateX(0px);
    -ms-transform: translateX(0px);
    -moz-transform: translateX(0px);
    -webkit-transform: translateX(0px);
}
20% {
    transform: translateX(10px);
    -o-transform: translateX(10px);
    -ms-transform: translateX(10px);
    -moz-transform: translateX(10px);
    -webkit-transform: translateX(10px);
}
40% {
    transform: translateX(-10px);
    -o-transform: translateX(-10px);
    -ms-transform: translateX(-10px);
    -moz-transform: translateX(-10px);
    -webkit-transform: translateX(-10px);
}
60% {
    transform: translateX(5px);
    -o-transform: translateX(5px);
    -ms-transform: translateX(5px);
    -moz-transform: translateX(5px);
    -webkit-transform: translateX(5px);
}
80% {
    transform: translateX(-5px);
    -o-transform: translateX(-5px);
    -ms-transform: translateX(-5px);
    -moz-transform: translateX(-5px);
    -webkit-transform: translateX(-5px);
}
90% {
    transform: translateX(1px);
    -o-transform: translateX(1px);
    -ms-transform: translateX(1px);
    -moz-transform: translateX(1px);
    -webkit-transform: translateX(1px);
}
95% {
    transform: translateX(-1px);
    -o-transform: translateX(-1px);
    -ms-transform: translateX(-1px);
    -moz-transform: translateX(-1px);
    -webkit-transform: translateX(-1px);
}
100% {
    transform: translateX(0px);
    -o-transform: translateX(0px);
    -ms-transform: translateX(0px);
    -moz-transform: translateX(0px);
    -webkit-transform: translateX(0px);
}
}

.boop {
    display: inline-block;
    animation-duration: 0.3s;
    animation-play-state: paused;
    animation-fill-mode: forwards;
}
.boop.pos-y-wiggle {
    animation-name: pos-y-wiggle;
    animation-play-state: running;
}
</style>
