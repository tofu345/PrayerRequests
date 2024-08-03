<script>
import axios from '$lib/axios';
import { setCookie } from "$lib/cookie";
import { goto } from '$app/navigation';

$: email = "";
$: password = "";
$: disabled = false;

async function submit() {
    disabled = true;

    /** @type {import('axios').AxiosResponse} */
    const res = await axios
        .post("/api/admin/token", { email, password })
        .then((res) => res)
        .catch((err) => err.response);

    if (res.status === 200 && res.data?.token) {
        setCookie("token", res.data.token, 1);
        goto('/');
    }

    disabled = false;
}
</script>

<div class="w-full h-screen flex justify-center items-center font-medium">
    <div class="p-2 sm:w-[50%] w-[90%] h-[50%] rounded-lg border-2 border-gray-400 flex flex-col justify-between items-center">
        <div class="w-full p-2 text-left mb-5">
            <h1>Admin Login</h1>
            <hr class="mt-2">
        </div>
        <form
            on:submit|preventDefault={() => submit()}
            class="flex flex-col gap-4 h-[60%] w-full px-2 mb-5 text-sm">

            <div>
                <label for="email" class="">Email address</label>
                <div class="mt-2">
                    <input
                        id="email" name="email"
                        type="email" autocomplete="email"
                        required
                        class="outline-none block w-full rounded-md p-2 py-1.5 bg-gray-600 border border-white sm:text-sm"
                        bind:value={email}>
                </div>
            </div>

            <div>
                <label for="password" class="">Password</label>
                <div class="mt-2">
                    <input
                        id="password" name="password"
                        type="password"
                        required
                        class="outline-none block w-full rounded-md p-2 py-1.5 bg-gray-600 border border-white sm:text-sm"
                        bind:value={password}>
                </div>
            </div>

            <button class="mt-2 h-fit p-2 bg-gray-600 disabled:opacity-70 border border-transparent
                    hover:border-white rounded-lg text-sm"
                {disabled}>
                Submit
            </button>

        </form>
        <div></div>
    </div>
</div>
