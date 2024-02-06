<template>
  <p>Введите номер телефона</p>
  <input
    id="phoneNumber"
    v-model="phoneNumber"
    type="text"
    placeholder="Номер телефона*"
    class="form__input"
    @keyup.enter="requestOtpCode"
  />
  <p v-if="errorMessage" class="form__error">{{ errorMessage }}</p>

  <button class="form__btn" @click="requestOtpCode">Далее</button>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth.ts";

const store = useAuthStore();

const phoneNumber = ref("");
const errorMessage = ref("");

async function requestOtpCode() {
  try {
    await store.generateOtp(phoneNumber.value);
    errorMessage.value = "";
  } catch (error) {
    errorMessage.value = error.response.data.message;
    console.error("Error:", error);
  }
}
</script>
