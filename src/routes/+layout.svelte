<script>
import "../app.css";
</script>

<svelte:head>
    <title>IKON Prayer and Praise Requests</title>
    <link rel="icon" type="image/x-icon" href="favicon.png">
</svelte:head>

<slot />

<style>
/* this will apply to <body> */
:global(body) {
    background: rgb(33, 33, 33);
    color: white;
}
</style>
