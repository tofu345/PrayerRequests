<script>
import axios from '$lib/axios';
import moment from 'moment';
import { onMount } from 'svelte';
import { slide, fade } from 'svelte/transition';
import { flip } from 'svelte/animate';

/** @type {import('./$types').PageData} */
export let data;
let loadingData = true;

/** @type {string} */
const admin = data.admin;

/** @type {import('@prisma/client').Post[]} */
$: posts = [];
/** @type {import('@prisma/client').Post[]} */
$: olderPosts = [];
let olderPostsShown = false;

async function submitForm() {
    if (!textArea.value) {
        textArea.error = true;

        setTimeout(() => {
            textArea.error = false;
        }, 1000);
        return;
    }

    if (textArea.is_prayer_request === null) {
        textArea.selectingType = true;
        return;
    }

    textArea.submitting = true;
    textArea.selectingType = false;
    textArea.error = false;

    /** @type {import('axios').AxiosResponse} */
    const res = await axios
        .post("/api/create-post", {
            text: textArea.value,
            is_prayer_request: textArea.is_prayer_request
        })
        .then((res) => res)
        .catch((err) => err.response);

    textArea.is_prayer_request = null;
    if (res.status === 400) {
        textArea.submitting = false;
        textArea.error = true;

        setTimeout(() => {
            textArea.error = false;
        }, 1000);
        return;
    }

    posts.splice(0, 0, res.data);
    posts = posts; // svelte-tings
    textArea.value = "";
    textArea.submitting = false;
    textArea.selectingType = false;
    textArea.visible = false;
    textArea.error = false;
}

/** @param {number} id */
async function deletePost(id) {
    if (!window.confirm("Are you sure?")) {
        return;
    }

    /** @type {import('axios').AxiosResponse} */
    const res = await axios
        .post("/api/delete-post", { id })
        .then((res) => res)
        .catch((err) => err.response);
    if (res.status === 200) {
        posts = posts.filter(v => v.id != id);
        olderPosts = olderPosts.filter(v => v.id != id);
    }
}

const textArea = {
    value: "",
    /** @type {boolean|null} */
    is_prayer_request: null,
    selectingType: false,
    error: false,
    visible: false,
    submitting: false,
    /** @param {any} event */
    autoExpand: function(event) {
        event.target.style.height =
            Math.min(this.value.split("\n").length * 24, 150) + "px";
    },
    /** @param {KeyboardEvent} e */
    submitIfShiftEnter: async function(e) {
        if (e.key == "Enter" && e.shiftKey) {
            await submitForm();
        }
    }
}

/** @param {HTMLTextAreaElement} el */
function focusOnCreate(el) {
    el.focus();
}

onMount(() => {
    if (data.posts) {
        let date = new Date();
        date.setDate(date.getDate() - date.getDay() - 7);
        posts = data.posts.filter(v => v.createdAt >= date);
        olderPosts = data.posts.filter(v => v.createdAt < date);
        loadingData = false;
    }
});
</script>

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
        {#if loadingData}
            <div class="w-full h-36 flex justify-center items-center text-sm italic">
                Loading...
            </div>
        {:else}
            {#each posts as post (post.id)}
                <div
                    class="sm:max-w-[89%] max-w-[78%] bg-gray-600 rounded w-fit ml-4 m-1 relative"
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
                        class="w-fit absolute -bottom-[2px] -right-16 text-xs text-gray-300">
                        {moment(post.createdAt).format("ddd HH:mm")}
                    </div>
                    {#if admin}
                        <button
                            on:click={() => deletePost(post.id)}
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

            {#if olderPosts.length != 0}
                <button
                    on:click={() => olderPostsShown = !olderPostsShown}
                    out:fade={{ delay: 300, duration: 0 }}
                >
                    <div class="flex gap-2 cursor-pointer border-4 border-transparent border-l-gray-600 rounded text-sm w-full p-2 my-1">
                        {#if olderPostsShown}
                            <img src="/caret-down.svg" alt="caret-down" />
                        {:else}
                            <img src="/caret-right.svg" alt="caret-right" />
                        {/if}
                        <p> Last week </p>
                    </div>
                </button>
            {/if}

            {#if olderPostsShown}
                <div class="pl-1 w-full flex flex-col gap-2" transition:slide={{ duration: 300 }}>
                    {#each olderPosts as post (post.id)}
                        <div
                            class="sm:max-w-[89%] max-w-[78%] bg-gray-600 rounded w-fit ml-4 m-1 relative"
                            transition:fade={{ duration: 300 }}
                        >
                            <p style="overflow-wrap: break-word;" class="whitespace-pre-wrap p-1 px-2"> {post.text} </p>
                            <div
                                class="absolute text-sm top-[0.1rem] -left-[1.65rem] h-fit w-fit p-1 rounded-md"
                            >
                                {#if post.is_prayer_request} 🙏 {:else} 🎉 {/if}
                            </div>
                            <div
                                class="w-fit absolute -bottom-[2px] -right-16 text-xs text-gray-300">
                                {moment(post.createdAt).format("ddd HH:mm")}
                            </div>
                            {#if admin}
                                <button
                                    on:click={() => deletePost(post.id)}
                                    class="absolute bottom-[0.97rem] -right-[1.6rem] h-4 bg-red-400 rounded border border-transparent">
                                    <img src="/trash.svg" alt="trash" />
                                </button>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/if}
        {/if}
    </div>
</div>

<div class="w-full p-2 lg:mx-50 mb-2 flex justify-center">
    {#if textArea.submitting}
        <div
            class="flex justify-center items-center bg-gray-600 rounded-lg h-[60px] w-full sm:w-[80%] px-1 text-sm">
            <div class="loader"></div>
        </div>
    {:else if textArea.selectingType}
        <div
            class="flex justify-between items-center bg-gray-600 rounded-lg h-[60px] w-full sm:w-[80%] px-1 text-sm">
            <button
                on:click={() => {
                    textArea.is_prayer_request = true;
                    submitForm();
                }}
                class="pb-4 relative text-lg h-[80%] w-[50%] flex
                    justify-center items-center border-2 border-transparent
                    hover:border-gray-400 hover:bg-gray-500 rounded-md
                    cursor-pointer">
                🙏
                <p class="absolute bottom-1 text-xs text-gray-100">
                    Prayer request
                </p>
            </button>
            <button
                class="w-8 h-full mx-5 rounded"
                on:click={() => {
                    textArea.selectingType = false;
                    setTimeout(() => {
                        /** @type {any} */
                        const textAreaObj = document.getElementById("textarea");
                        if (textAreaObj) {
                            textAreaObj.style.height =
                                Math.min(textAreaObj.value.split("\n").length * 24, 150) + "px";
                        }
                    }, 50);
                }}>
                <img
                    id="errorSvg"
                    src="/error.svg"
                    alt="error img"
                    class="w-full"
                />
            </button>
            <button
                on:click={() => {
                    textArea.is_prayer_request = false;
                    submitForm();
                }}
                class="pb-4 relative text-lg h-[80%] w-[50%] flex
                justify-center items-center border-2 border-transparent
                hover:border-gray-400 hover:bg-gray-500 rounded-md
                cursor-pointer">
                🎉
                <p class="absolute bottom-1 text-xs text-gray-100">
                    Praise report
                </p>
            </button>
        </div>
        {:else if textArea.visible}
        <form
            on:submit|preventDefault={() => submitForm()}
            class="relative w-full sm:w-[80%] h-fit p-2 rounded-lg border-2 border-gray-400 bg-gray-600 flex justify-between">
            <textarea
                disabled={textArea.submitting}
                bind:value={textArea.value}
                on:input={textArea.autoExpand}
                on:keypress={textArea.submitIfShiftEnter}
                rows="1"
                placeholder=""
                id="textarea"
                class="bg-transparent w-full outline-none resize-none mr-[30px]"
                use:focusOnCreate
                maxlength="100"
            />
            <button class="bg-transparent p-1 absolute top-[0.25rem] right-1">
                {#if textArea.error}
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
            on:click={() => {textArea.visible = true}}
            class="outline-none border-2 border-transparent hover:border-gray-400 bg-gray-600 rounded-lg h-[44px] w-full sm:w-[80%] p-2 text-sm"
        > Submit Request </button>
    {/if}
</div>

<style>
.resize-none{
    resize: none;
}

/* .stick-bottom {
position: fixed;
bottom: 0;
}

@media (max-height: 600px) {
.stick-bottom {
position: unset;
}
} */

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

/* https://codepen.io/ericrasch/pen/kWWzzk */
/* .line-behind {
display: table;
white-space: nowrap;
&:before, &:after {
border-top: 1px solid #8c8c8c;
content: '';
display: table-cell;
position: relative;
top: 0.7em;
width: 46%;
}
&:before { right: 1%; }
&:after { left: 1%; }
} */
</style>
