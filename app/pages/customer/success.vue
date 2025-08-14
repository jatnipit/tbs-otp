<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <NuxtContainer class="w-full max-w-lg text-center bg-white rounded-2xl shadow-md">
      <div class="flex justify-center mt-6">
        <div
          class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
        >
          <svg
            class="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      <div class="space-y-6 p-6">
        <div class="space-y-3">
          <h1 class="text-2xl font-bold text-gray-900">
            คุณได้ยืนยันตัวตนและยืนยันเอกสารเสร็จสิ้นแล้ว
          </h1>

          <p class="text-gray-600 text-md leading-relaxed">
            รายละเอียดเอกสารทั้งหมดถูกส่งไปทาง SMS เรียบร้อยแล้ว<br />
            สามารถปิดหน้าเว็บนี้ได้เลย
          </p>
        </div>
      </div>
    </NuxtContainer>
  </div>
</template>

<script setup></script>
