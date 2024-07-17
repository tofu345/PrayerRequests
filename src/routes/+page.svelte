<script>
import axios from '$lib/axios';
import { fade } from 'svelte/transition';

/** @type {import('./$types').PageData} */
export let data;
$: ({ posts } = data)

async function submitForm() {
    textArea.submitting = true;
    textArea.error = true;

    if (textArea.value.trim() === "") {
        textArea.submitting = false;
        textArea.error = true;
        setTimeout(() => {
            textArea.error = false;
        }, 1000);
        return;
    }

    /** @type {import('axios').AxiosResponse} */
    const res = await axios
        .post("/api/create-post", { content: textArea.value })
        .then((res) => res)
        .catch((err) => err.response);
    if (res.status === 400) {
        textArea.submitting = false;
        textArea.error = true;

        console.error(res.data);

        setTimeout(() => {
            textArea.error = false;
        }, 1000);
        return;
    }

    posts.push(res.data);
    posts = posts; // svelte-tings
    textArea.value = "";
    textArea.submitting = false;
    textArea.visible = false;
    textArea.error = false;
}

const textArea = {
    value: "",
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
</script>

<div class="w-full flex justify-center mt-2">
    <h1 class="font-bold text-2xl">IKON</h1>
</div>
<div class="w-full flex justify-center mb-2">
    <p class="text-sm">Prayer and Praise Requests</p>
</div>

<div class="w-full p-2 sm:flex sm:justify-center">
    <div class="p-2 rounded-lg flex flex-col gap-2 border border-gray-400 sm:w-[80%]">
        {#each posts as post}
            <div
                class="bg-gray-600 rounded w-fit p-1 px-2"
                transition:fade={{ delay: 250, duration: 300 }}
            >
                <p> {post.content} </p>
            </div>
        {:else}
            <div class="w-full flex justify-center items-center text-sm italic h-20">
                None yet...
            </div>
        {/each}
    </div>
</div>

<div class="stick-bottom w-full p-2 lg:mx-50 mb-2 flex justify-center">
    {#if textArea.visible}
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
                class="bg-transparent w-full outline-none resize-none mr-[30px]"
                use:focusOnCreate
                maxlength="100"
            />
            <button class="bg-transparent p-1 absolute top-[0.25rem] right-1">
                {#if textArea.submitting}
                    <span class="loader"></span>
                {:else if textArea.error}
                    <img 
                        id="errorSvg" 
                        src="error.svg" 
                        alt="error img" 
                        class="boop pos-y-wiggle" 
                    />
                {:else}
                    <img src="send.svg" alt="send img"/>
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
    animation-duration: 0.5s;
    animation-play-state: paused;
    animation-fill-mode: forwards;
}
.boop.pos-y-wiggle {
    animation-name: pos-y-wiggle;
    animation-play-state: running;
}
</style>
