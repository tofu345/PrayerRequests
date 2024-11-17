<script lang="ts">
import "../app.css";

let { children } = $props();
</script>

<svelte:head>
    <title>IKON Prayer and Praise Requests</title>
    <link rel="icon" type="image/x-icon" href="/favicon.png">
</svelte:head>

{@render children()}

<style>
/* this will apply to <body> */
:global(body) {
    background: rgb(33, 33, 33);
    color: white;
}
</style>
