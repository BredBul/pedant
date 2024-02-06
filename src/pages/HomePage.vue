<template>
  <div class="user">
    <div class="user__container _container">
      <div v-if="store.user" class="user__body">
        <h1 class="user__title">Личный кабинет</h1>
        <div class="user__card">
          <p class="user__name">{{ store.user.CustomerName }}</p>
          <p class="user__phone">{{ store.user.CustomerPhone }}</p>
        </div>
      </div>
      <div v-else-if="store.token">Loading</div>
      <div v-else class="user__form form">
        <h1 class="user__title">Вход в личный кабинет</h1>
        <SignIn v-if="!store.requestSent" />
        <Verification v-else />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useAuthStore } from "@/stores/auth.ts";

import SignIn from "@/components/SignInForm.vue";
import Verification from "@/components/VerificationForm.vue";

const store = useAuthStore();

onMounted(() => {
  if (store.token) {
    store.getSubscription();
  }
});

watch(
  () => store.token,
  (token) => {
    if (token) {
      store.getSubscription();
    }
  },
);
</script>

<style lang="scss" src="./style.scss" />
