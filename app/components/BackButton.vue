<template>
  <button class="text-gray-400 hover:underline mt-2" @click="goBack">
    กลับสู่หน้าก่อนหน้า
  </button>
</template>

<script setup>
const router = useRouter();

function goBack() {
  router.back();
}
</script>
