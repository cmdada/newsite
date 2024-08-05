<script lang="ts">
    import type { PageData } from "./$types"
    // import sites from "$lib/constants/sites";

	import { onMount } from "svelte";
	export let galleryID;
	export let images;
	
</script>

<svelte:head>
    <title>site@adabit.org ~/Art</title>
    <style>
    div.gallery {
      border: 1px solid #ccc;
      margin: 7px;
      float: left;
      width: 168.2px;
    }
    
    div.gallery:hover {
      border: 1px solid #777;
    }
    
    div.gallery img {
      width: 100%;
      height: auto;
    }
    
    div.desc {
      padding: 15px;
      text-align: center;
    }
    </style>
</svelte:head>

<div class="content">
  <h2>Art</h2>
    <div class="gallery">
      <img src="pic01.jpg" alt="heartless" width="600" height="400">
      <div class="desc">heartless</div>
      <div class="desc">a very high effort drawing you shouldnt read into</div>
    </div>
    <div class="gallery">
      <img src="pic02.jpg" alt="i want to be pretty" width="600" height="400">
      <div class="desc">i want to be pretty</div>
      <div class="desc">im not at all trans</div>
    </div>
    <div class="gallery">
      <img src="pic04.jpg" alt="sinking" width="600" height="400">
      <div class="desc">sinking</div>
      <div class="desc">just an idea i had while washing my hands</div>
    </div>
    <div class="gallery">
      <img src="pic03.jpg" alt="projectile weapon" width="600" height="400">
      <div class="desc">projectile weapon</div>
      <div class="desc">you starting to see a theme in what i draw?</div>
    </div>
    <div class="gallery">
      <img src="pic05.jpg" alt="hole in my head" width="600" height="400">
      <div class="desc">heartless</div>
      <div class="desc">not related to the great LJG song of the same name</div>
    </div>
    <div class="gallery">
      <img src="https://avatars.githubusercontent.com/u/79297197?v=4" alt="my pfp" width="600" height="400">
      <div class="desc">my pfp</div>
      <div class="desc">a fairly quick pixel art drawing of tuba (2036's crescendo bot)</div>
    </div>
    <div class="gallery">
      <img src="shorkhehe.png" alt="robosharks logo" width="600" height="400">
      <div class="desc">robosharks logo</div>
      <div class="desc">logo for boulder high robotics</div>
    </div>
    <div class="gallery">
      <img src="goals.png" alt="goals" width="600" height="400">
      <div class="desc">goals</div>
      <div class="desc">i had fun with the colors on this one</div>
    </div>
    
</div>
<style lang="scss">
    .para {
        margin: 1em auto;

        & p {
            margin-top: 0;
            margin-bottom: 0;
        }
    }
</style>
