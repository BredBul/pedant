<template>
  <input
    v-model="otpCode"
    type="text"
    placeholder="Введите код из SMS"
    class="form__input"
    @keyup.enter="sendOtpCode"
  />
  <p v-if="errorMessage" class="form__error">{{ errorMessage }}</p>

  <button class="form__btn" @click="sendOtpCode">Далее</button>

  <p>Не пришел код?</p>
  <p v-if="store.countdownRemaining">
    Отправить повторно или ввести другой номер телефона можно через
    {{ store.countdownRemaining }} секунд
  </p>
  <div v-else class="form__btns">
    <button @click="requestOtpCode">Отправить код повторно</button>
    <button @click="returnToSignin">Возврат к вводу номера</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth.ts";
const store = useAuthStore();

const otpCode = ref();
const errorMessage = ref("");

onMounted(() => {
  if (store.requestSent) {
    store.startCountdown();
  }
});

async function sendOtpCode() {
  try {
    await store.verifyOtp(otpCode.value);
    errorMessage.value = "";
  } catch (error) {
    errorMessage.value = error.response.data.message;
    console.error("Error:", error);
  }
}

async function requestOtpCode() {
  try {
    if (store.phoneNumber) {
      await store.generateOtp(store.phoneNumber);
    } else {
      returnToSignin();
    }
  } catch (error) {
    errorMessage.value = error.response.data.message;
    console.error("Error:", error);
  }
}

function returnToSignin() {
  store.requestSent = false;

  localStorage.setItem("requestSent", String(false));
}
</script>
