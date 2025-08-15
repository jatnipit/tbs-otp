<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-50"
  >
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow">
      <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">
        ส่ง OTP Link SMS
      </h1>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <NuxtInput
          v-model="state.msisdn"
          type="tel"
          placeholder="เบอร์โทรศัพท์ (เช่น 0812345678)"
          size="lg"
          class="w-full"
          :disabled="state.loading"
          required
        />

        <NuxtButton
          block
          color="primary"
          size="lg"
          type="submit"
          class="transition-transform transform hover:scale-105 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
          :disabled="state.loading || !isFormValid"
        >
          <span class="flex items-center gap-2">
            <span>{{ state.loading ? "กำลังส่ง..." : "ส่ง SMS" }}</span>
          </span>
        </NuxtButton>
      </form>

      <div
        v-if="state.success"
        class="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded text-center"
      >
        <p class="font-medium">ส่งสำเร็จ!</p>
        <p class="text-sm mt-1">
          ลิ้งค์ยืนยันตัวตนได้ถูกส่งไปยังหมายเลข {{ state.msisdn }} แล้ว
        </p>
      </div>

      <div
        v-if="state.error"
        class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded text-center"
      >
        <p class="font-medium">เกิดข้อผิดพลาด</p>
        <p class="text-sm mt-1">{{ state.error }}</p>
      </div>

      <BackButton />
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();

const state = reactive({
  msisdn: "",
  loading: false,
  success: false,
  error: "",
});

const isFormValid = computed(() => {
  return validatePhoneNumber(state.msisdn);
});

const otpLink = computed(() => {
  if (!state.msisdn) return "";
  const encodedMsisdn = btoa(state.msisdn);
  return `${config.public.baseUrl || "https://tbs-otp.vercel.app"}/customer/otp?msisdn=${encodedMsisdn}`;
});

const smsMessage = computed(() => {
  return `กรุณากดลิ้งเพื่อยืนยันตัวตน \n${otpLink.value}`;
});

const validatePhoneNumber = (phone) => {
  if (!phone) return false;

  const cleanPhone = phone.replace(/\D/g, "");

  const thaiMobilePattern = /^(08|09|06)\d{8}$/;
  return thaiMobilePattern.test(cleanPhone);
};

const normalizePhoneNumber = (phone) => {
  let cleanPhone = phone.replace(/\D/g, "");

  if (cleanPhone.startsWith("66")) {
    cleanPhone = "0" + cleanPhone.substring(2);
  }

  return cleanPhone;
};

const clearMessages = () => {
  state.success = false;
  state.error = "";
};

const resetForm = () => {
  state.msisdn = "";
  clearMessages();
};

const sendSmsRequest = async (msisdn, message) => {
  const response = await $fetch("/api/sms/send-sms", {
    method: "POST",
    body: {
      msisdn,
      message,
    },
  });

  if (response?.error) {
    throw new Error(response.error);
  }

  return response;
};

const handleSubmit = async () => {
  const normalizedPhone = normalizePhoneNumber(state.msisdn);

  if (!validatePhoneNumber(normalizedPhone)) {
    state.error =
      "หมายเลขโทรศัพท์ไม่ถูกต้อง กรุณาใส่หมายเลขที่ขึ้นต้นด้วย 08, 09, หรือ 06";
    return;
  }

  state.loading = true;
  clearMessages();

  try {
    state.msisdn = normalizedPhone;

    const response = await sendSmsRequest(normalizedPhone, smsMessage.value);

    console.log("SMS sent successfully:", response);

    state.success = true;

    setTimeout(() => {
      resetForm();
    }, 3000);
  } catch (error) {
    console.error("Error sending SMS:", error);

    if (error.message.includes("invalid")) {
      state.error = "หมายเลขโทรศัพท์ไม่ถูกต้อง";
    } else if (
      error.message.includes("quota") ||
      error.message.includes("limit")
    ) {
      state.error = "เกินขิดจำกัดการส่ง SMS กรุณาลองใหม่ภายหลัง";
    } else if (
      error.message.includes("network") ||
      error.message.includes("timeout")
    ) {
      state.error = "เกิดปัญหาเครือข่าย กรุณาลองใหม่อีกครั้ง";
    } else {
      state.error =
        error.message || "ไม่สามารถส่ง SMS ได้ กรุณาลองใหม่อีกครั้ง";
    }
  } finally {
    state.loading = false;
  }
};

watch(
  () => state.msisdn,
  (newValue) => {
    if (newValue && (state.success || state.error)) {
      clearMessages();
    }
  }
);

onMounted(() => {
  nextTick(() => {
    const input = document.querySelector('input[type="tel"]');
    if (input) input.focus();
  });
});
</script>
