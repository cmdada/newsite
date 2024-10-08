import { sveltekit } from '@sveltejs/kit/vite';
import Icons from "unplugin-icons/vite"
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        sveltekit(),
        Icons({ compiler: "svelte", defaultStyle: "vertical-align: middle; color: #e0def4" })
    ]
})
