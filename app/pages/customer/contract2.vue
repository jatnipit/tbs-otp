<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4">
    <NuxtCard class="w-full max-w-2xl">
      <h1 class="text-center text-xl font-semibold mb-4">สัญญา 2</h1>

      <div
        ref="contractBox"
        class="border border-gray-300 rounded-md p-4 h-[60vh] overflow-y-auto bg-white"
        @scroll="handleScroll"
      >
        <p v-for="n in contractParagraphs" :key="n" class="mb-2">
          {{ n }}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
          do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      <div class="mt-4 flex items-center space-x-2">
        <NuxtCheckbox
          v-model="isChecked"
          :disabled="!hasScrolledToBottom"
          label="ฉันได้อ่านและยอมรับเงื่อนไขในสัญญา"
        />
      </div>
      <div class="mt-4 flex justify-center space-x-5">
        <NuxtButton @click="rejectContract" color="error">
          ไม่ยอมรับ
        </NuxtButton>
        <NuxtButton :disabled="!isChecked" @click="confirmContract">
          ยอมรับ
        </NuxtButton>
      </div>
    </NuxtCard>
  </div>
</template>

<script setup>
const isChecked = ref(false);
const hasScrolledToBottom = ref(false);
const contractBox = ref(null);

const contractParagraphs = Array.from({ length: 50 }, (_, i) => i + 1);

const handleScroll = () => {
  const el = contractBox.value;
  if (!el) return;

  const bottomReached =
    Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight;
  if (bottomReached) {
    hasScrolledToBottom.value = true;
  }
};

function rejectContract() {
  console.log("สัญญาถูกปฏิเสธ");
}

function confirmContract() {
  console.log("สัญญาถูกยอมรับ");
}

onMounted(() => {
  const el = contractBox.value;
  if (el && el.scrollHeight <= el.clientHeight) {
    hasScrolledToBottom.value = true;
  }
});
</script>
