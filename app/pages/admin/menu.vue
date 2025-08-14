<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-50"
  >
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow">
      <h1 class="text-2xl font-bold mb-6 text-center">Admin Menu</h1>
      <div class="space-y-4">
        <NuxtLink to="/admin/send-link" class="block">
          <NuxtButton
            block
            class="transition-transform transform hover:scale-105 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
            color="primary"
            size="lg"
          >
            <span class="flex items-center gap-2">
              <span>Send Link</span>
            </span>
          </NuxtButton>
        </NuxtLink>
        <NuxtLink to="/admin/check-status" class="block">
          <NuxtButton
            block
            class="transition-transform transform hover:scale-105 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
            color="primary"
            size="lg"
          >
            <span class="flex items-center gap-2">
              <span>Check Status</span>
            </span>
          </NuxtButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
