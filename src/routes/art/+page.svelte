<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from 'svelte/transition';
    import { ChevronLeft, ChevronRight } from 'lucide-svelte';

    let selectedImageIndex = 0;
    let showModal = false;

    const images = [
        { src: "pic01.jpg", alt: "heartless", title: "heartless", description: "a very high effort drawing you shouldnt read into" },
        { src: "pic02.jpg", alt: "i want to be pretty", title: "i want to be pretty", description: "im not at all trans" },
        { src: "pic04.jpg", alt: "sinking", title: "sinking", description: "just an idea i had while washing my hands" },
        { src: "pic03.jpg", alt: "projectile weapon", title: "projectile weapon", description: "you starting to see a theme in what i draw?" },
        { src: "pic05.jpg", alt: "hole in my head", title: "hole in my head", description: "not related to the great LJG song of the same name" },
        { src: "https://avatars.githubusercontent.com/u/79297197?v=4", alt: "my pfp", title: "my pfp", description: "a fairly quick pixel art drawing of tuba (2036's crescendo bot)" },
        { src: "shorkhehe.png", alt: "robosharks logo", title: "robosharks logo", description: "logo for boulder high robotics" },
        { src: "swimmingly.png", alt: "swimmingly", title: "swimmingly", description: "may it go swimmingly (commission)" },
        { src: "goals.png", alt: "goals", title: "goals", description: "i had fun with the colors on this one" }
    ];

    function openModal(index) {
        selectedImageIndex = index;
        showModal = true;
    }

    function closeModal() {
        showModal = false;
    }

    function navigate(direction) {
        selectedImageIndex = (selectedImageIndex + direction + images.length) % images.length;
    }

    function handleKeydown(event) {
        if (!showModal) return;
        if (event.key === 'ArrowLeft') navigate(-1);
        if (event.key === 'ArrowRight') navigate(1);
        if (event.key === 'Escape') closeModal();
    }

    onMount(() => {
        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    });
</script>

<svelte:head>
    <title>site@adabit.org ~/Art</title>
</svelte:head>

<div class="content">
    <h2>Art</h2>
    <div class="image-grid">
        {#each images as image, index}
            <div class="image-item" on:click={() => openModal(index)}>
                <img src={image.src} alt={image.alt} />
                <div class="image-caption">{image.title}</div>
            </div>
        {/each}
    </div>
</div>

{#if showModal}
    <div class="modal" on:click={closeModal} transition:fade>
        <div class="modal-content" on:click|stopPropagation>
            <img src={images[selectedImageIndex].src} alt={images[selectedImageIndex].alt} />
            <h3>{images[selectedImageIndex].title}</h3>
            <p>{images[selectedImageIndex].description}</p>
        </div>
        <button class="nav-button prev" on:click|stopPropagation={() => navigate(-1)}>
            <ChevronLeft size={24} />
        </button>
        <button class="nav-button next" on:click|stopPropagation={() => navigate(1)}>
            <ChevronRight size={24} />
        </button>
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
        width: 100%;

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
            font-size: 14px;
        }
    }

    .modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background: rgba(0, 0, 0, 0.6);
        padding: 20px;
        max-width: 80%;
        max-height: 90%;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;

        img {
            max-width: 100%;
            max-height: 70vh;
            object-fit: contain;
            margin-bottom: 15px;
        }

        h3 {
            margin-bottom: 10px;
            text-align: center;
            color: white;
        }

        p {
            text-align: center;
            color: white;
        }
    }

    .nav-button {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.3s ease;

        &:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        &:focus {
            outline: none;
        }

        &.prev {
            left: 20px;
        }

        &.next {
            right: 20px;
        }
    }

    @media (max-width: 768px) {
        .image-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
        }

        .image-item .image-caption {
            font-size: 12px;
            padding: 5px;
        }

        .modal-content {
            padding: 15px;
            max-width: 90%;
        }

        .nav-button {
            width: 40px;
            height: 40px;

            &.prev {
                left: 10px;
            }

            &.next {
                right: 10px;
            }
        }
    }

    @media (max-width: 480px) {
        .image-grid {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 10px;
        }

        .image-item .image-caption {
            font-size: 10px;
            padding: 3px;
        }

        .modal-content {
            padding: 10px;
            max-width: 95%;
        }

        .nav-button {
            width: 30px;
            height: 30px;

            &.prev {
                left: 5px;
            }

            &.next {
                right: 5px;
            }
        }
    }
</style>
