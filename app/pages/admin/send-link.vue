<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-50"
  >
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow">
      <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">
        ส่ง OTP Link SMS
      </h1>
      <form @submit.prevent="sendSms" class="space-y-4">
        <NuxtInput
          v-model="msisdn"
          type="text"
          placeholder="เบอร์โทรศัพท์ (msisdn)"
          size="lg"
          class="w-full"
          required
        />
        <NuxtButton
          block
          color="primary"
          size="lg"
          type="submit"
          class="transition-transform transform hover:scale-105 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
          :disabled="loading"
        >
          <span class="flex items-center gap-2">
            <span>{{ loading ? "กำลังส่ง..." : "ส่ง SMS" }}</span>
          </span>
        </NuxtButton>
      </form>
      <div v-if="result" class="mt-4 text-green-600 text-center">
        ส่งสำเร็จ!
      </div>
      <div v-if="error" class="mt-4 text-red-600 text-center">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
const msisdn = ref("");
const loading = ref(false);
const result = ref(false);
const error = ref("");

async function sendSms() {
  const encodedMsisdn = btoa(msisdn.value);
  const message = `กรุณากดลิ้งเพื่อยืนยันตัวตน \nhttps://tbs-otp.vercel.app/customer/otp?msisdn=${encodedMsisdn}`;
  loading.value = true;
  result.value = false;
  error.value = "";
  try {
    const response = await $fetch("/api/sms/send-sms", {
      method: "POST",
      body: {
        msisdn: msisdn.value,
        message: message,
      },
    });
    if (response && response.error) {
      error.value = "ส่งไม่สำเร็จ: " + response.error;
    } else {
      result.value = true;
      msisdn.value = "";
    }
  } catch (e) {
    error.value = "เกิดข้อผิดพลาด";
  }
  loading.value = false;
}
</script>
