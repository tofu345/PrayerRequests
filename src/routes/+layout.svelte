<script>
import "../app.css";
</script>

<slot />

<style>
/* this will apply to <body> */
:global(body) {
    background: rgb(33, 33, 33);
    color: white;
}
</style>
