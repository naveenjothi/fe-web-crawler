<template>
  <div class="">
    <div>
      <img src="../assets/nodata.svg" class="max-w-full h-64 mx-auto" alt="" />
      <div class="text-base font-semibold text-gray-900 text-center -mt-8">
        <slot name="message" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
