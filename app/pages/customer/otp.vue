<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div
      class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center space-y-4"
    >
      <h1 class="text-2xl font-semibold text-gray-800 mb-2 tracking-wide">
        กรอกรหัส OTP
      </h1>
      <p class="text-gray-500 text-center my-6 leading-relaxed">
        กรุณากรอกรหัส 6 หลักที่ส่งไปยังโทรศัพท์ของคุณ
      </p>
      <template v-if="!otpSent">
        <NuxtButton
          color="primary"
          size="lg"
          block
          class="mt-2"
          @click="sendOtp"
        >
          ส่งรหัส OTP
        </NuxtButton>
      </template>
      <template v-else>
        <NuxtPinInput
          v-model="otpValue"
          type="number"
          :length="6"
          size="xl"
          otp
          class="mb-6"
        />
        <NuxtButton
          color="primary"
          size="lg"
          block
          :disabled="otpValue.length !== 6"
          class="mb-2"
          @click="verifyOtp"
        >
          ยืนยันรหัส
        </NuxtButton>
        <div class="mt-4 text-sm text-gray-500">
          <span v-if="resendCountdown > 0">
            ขอส่งรหัสใหม่ได้ใน {{ resendCountdown }} วินาที
          </span>
          <span v-else>
            <button
              class="text-primary-600 hover:underline"
              @click="resendOtp"
              type="button"
            >
              ส่งรหัสอีกครั้ง
            </button>
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const msisdn = ref("");
const otpSent = ref(false);
const otpValue = ref("");
const resendCountdown = ref(0);
let timer = null;

onMounted(() => {
  msisdn.value = atob(route.query.msisdn);
});

function sendOtp() {
  

  otpSent.value = true;
  otpValue.value = "";
  startResendCountdown();
}

function resendOtp() {
  otpValue.value = "";
  startResendCountdown();
}

function startResendCountdown() {
  resendCountdown.value = 60;
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    if (resendCountdown.value > 0) {
      resendCountdown.value--;
    } else {
      clearInterval(timer);
    }
  }, 1000);
}

watch(otpValue, (val) => {
  if (val.length === 6) {
    verifyOtp();
  }
});

function verifyOtp() {
  console.log("Verifying OTP:", otpValue.value);
}

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>
