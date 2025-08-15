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

      <template v-if="!state.otpSent">
        <NuxtButton
          color="primary"
          size="lg"
          block
          class="mt-2"
          :disabled="state.loading"
          @click="handleSendOtp"
        >
          {{ state.loading ? "กำลังส่ง..." : "ส่งรหัส OTP" }}
        </NuxtButton>
      </template>

      <template v-else>
        <NuxtPinInput
          v-model="state.otpValue"
          type="number"
          :length="6"
          size="xl"
          otp
          class="mb-6"
          :disabled="state.loading"
        />

        <NuxtButton
          color="primary"
          size="lg"
          block
          :disabled="!isOtpValid || state.loading"
          class="mb-2"
          @click="handleVerifyOtp"
        >
          {{ state.loading ? "กำลังยืนยัน..." : "ยืนยันรหัส" }}
        </NuxtButton>

        <div
          v-if="state.error"
          class="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2 text-center"
        >
          {{ state.error }}
        </div>

        <div class="mt-4 text-sm text-gray-500">
          <span v-if="state.resendCountdown > 0">
            ขอส่งรหัสใหม่ได้ใน {{ state.resendCountdown }} วินาที
          </span>
          <span v-else>
            <NuxtButton
              variant="ghost"
              size="sm"
              :disabled="state.loading"
              @click="handleResendOtp"
            >
              ส่งรหัสอีกครั้ง
            </NuxtButton>
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();
const route = useRoute();

const state = reactive({
  msisdn: "",
  otpSent: false,
  otpValue: "",
  resendCountdown: 0,
  error: "",
  token: "",
  loading: false,
});

let resendTimer = null;

const isOtpValid = computed(() => {
  const cleanOtp = String(state.otpValue || "").replace(/[,\s]/g, "");
  return cleanOtp.length === 6;
});

const cleanOtpValue = (value) => {
  return String(value || "").replace(/[,\s]/g, "");
};

const clearError = () => {
  state.error = "";
};

const resetOtpInput = () => {
  state.otpValue = "";
  clearError();
};

const startResendCountdown = () => {
  state.resendCountdown = 60;
  clearInterval(resendTimer);

  resendTimer = setInterval(() => {
    if (state.resendCountdown > 0) {
      state.resendCountdown--;
    } else {
      clearInterval(resendTimer);
      resendTimer = null;
    }
  }, 1000);
};

const sendOtpRequest = async () => {
  if (!state.msisdn) {
    throw new Error("หมายเลขโทรศัพท์ไม่ถูกต้อง");
  }

  const response = await $fetch("/api/otp/request", {
    method: "POST",
    body: { msisdn: state.msisdn },
  });

  if (response?.error) {
    throw new Error(response.error);
  }

  if (!response?.token) {
    throw new Error("ไม่ได้รับ token จากเซิร์ฟเวอร์");
  }

  return response;
};

const verifyOtpRequest = async (pin) => {
  if (!pin || !state.token) {
    throw new Error("ข้อมูลไม่ครบถ้วน");
  }

  const response = await $fetch("/api/otp/verify", {
    method: "POST",
    body: {
      pin,
      token: state.token,
    },
  });

  if (response?.error) {
    throw new Error("รหัส OTP ไม่ถูกต้อง หรือหมดอายุ กรุณาลองใหม่อีกครั้ง");
  }

  return response;
};

const handleSendOtp = async () => {
  state.loading = true;
  clearError();

  try {
    const response = await sendOtpRequest();
    state.token = response.token;
    state.otpSent = true;
    resetOtpInput();
    startResendCountdown();

    console.log("OTP sent successfully:", response);
  } catch (error) {
    console.error("Error sending OTP:", error);
    state.error = error.message || "เกิดข้อผิดพลาดในการส่งรหัส OTP";
  } finally {
    state.loading = false;
  }
};

const handleResendOtp = async () => {
  state.loading = true;
  clearError();

  try {
    const response = await sendOtpRequest();
    state.token = response.token;
    resetOtpInput();
    startResendCountdown();

    console.log("OTP resent successfully:", response);
  } catch (error) {
    console.error("Error resending OTP:", error);
    state.error = error.message || "เกิดข้อผิดพลาดในการส่งรหัส OTP ใหม่";
  } finally {
    state.loading = false;
  }
};

const handleVerifyOtp = async () => {
  const cleanPin = cleanOtpValue(state.otpValue);

  if (!cleanPin || cleanPin.length !== 6) {
    state.error = "กรุณากรอกรหัส OTP 6 หลักให้ครบถ้วน";
    return;
  }

  state.loading = true;
  clearError();

  try {
    const response = await verifyOtpRequest(cleanPin);
    console.log("OTP verified successfully:", response);

    await router.push({
      path: "/customer/contract1",
      query: { msisdn: state.msisdn },
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    state.error = error.message || "เกิดข้อผิดพลาดในการยืนยันรหัส OTP";
  } finally {
    state.loading = false;
  }
};

onMounted(() => {
  try {
    if (route.query.msisdn) {
      state.msisdn = atob(route.query.msisdn);
    } else {
      throw new Error("ไม่พบหมายเลขโทรศัพท์");
    }
  } catch (error) {
    console.error("Error decoding msisdn:", error);
    state.error = "ข้อมูลหมายเลขโทรศัพท์ไม่ถูกต้อง";
  }
});

onBeforeUnmount(() => {
  if (resendTimer) {
    clearInterval(resendTimer);
    resendTimer = null;
  }
});
</script>
