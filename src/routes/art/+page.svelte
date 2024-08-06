<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from 'svelte/transition';

    let selectedImage = null;
    let showModal = false;

    const images = [
        { src: "pic01.jpg", alt: "heartless", title: "heartless", description: "a very high effort drawing you shouldnt read into" },
        { src: "pic02.jpg", alt: "i want to be pretty", title: "i want to be pretty", description: "im not at all trans" },
        { src: "pic04.jpg", alt: "sinking", title: "sinking", description: "just an idea i had while washing my hands" },
        { src: "pic03.jpg", alt: "projectile weapon", title: "projectile weapon", description: "you starting to see a theme in what i draw?" },
        { src: "pic05.jpg", alt: "hole in my head", title: "hole in my head", description: "not related to the great LJG song of the same name" },
        { src: "https://avatars.githubusercontent.com/u/79297197?v=4", alt: "my pfp", title: "my pfp", description: "a fairly quick pixel art drawing of tuba (2036's crescendo bot)" },
        { src: "shorkhehe.png", alt: "robosharks logo", title: "robosharks logo", description: "logo for boulder high robotics" },
        { src: "goals.png", alt: "goals", title: "goals", description: "i had fun with the colors on this one" }
    ];

    function openModal(image) {
        selectedImage = image;
        showModal = true;
    }

    function closeModal() {
        showModal = false;
    }
</script>

<svelte:head>
    <title>site@adabit.org ~/Art</title>
</svelte:head>

<div class="content">
    <h2>Art</h2>
    <div class="image-grid">
        {#each images as image}
            <div class="image-item" on:click={() => openModal(image)}>
                <img src={image.src} alt={image.alt} />
                <div class="image-caption">{image.title}</div>
            </div>
        {/each}
    </div>
</div>

{#if showModal}
    <div class="modal" on:click={closeModal} transition:fade>
        <div class="modal-content" on:click|stopPropagation>
            <img src={selectedImage.src} alt={selectedImage.alt} />
            <h3>{selectedImage.title}</h3>
            <p>{selectedImage.description}</p>
        </div>
    </div>
{/if}

<style lang="scss">
    .content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }

    .image-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;
    }

    .image-item {
        position: relative;
        cursor: pointer;
        overflow: hidden;
        aspect-ratio: 1 / 1;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
            image-rendering: pixelated;
		    image-rendering: -moz-crisp-edges;
		    image-rendering: crisp-edges;
        }

        &:hover img {
            transform: scale(1.05);
        }

        .image-caption {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            text-align: center;
        }
    }

    .modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background: rgba(0,0,0,0.6);
        padding: 5px;
        max-width: 80%;
        max-height: 80%;
        overflow-y: auto;
        border-radius: 8px;

        img {
            width: 100%;
            height: auto;
            margin-bottom: 15px;
        }

        h3 {
            margin-bottom: 10px;
        }
    }
</style>
