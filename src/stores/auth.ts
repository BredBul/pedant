import { defineStore } from "pinia";
import axios from "axios";
import config from "@/config.ts";
import { Ref, ref } from "vue";

const { url, username, password } = config;

interface User {
  CustomerName: String;
  CustomerPhone: String;
}

export const useAuthStore = defineStore("auth", () => {
  const requestSent: Ref<boolean> = ref(
    JSON.parse(localStorage.getItem("requestSent") || "false"),
  );
  const phoneNumber: Ref<string | null> = ref(
    localStorage.getItem("phoneNumber"),
  );
  const token: Ref<string | null> = ref(localStorage.getItem("token"));
  const user: Ref<User> = ref(
    JSON.parse(localStorage.getItem("user") || "null"),
  );

  const countdownRemaining: Ref<number> = ref(
    Number(sessionStorage.getItem("countdownRemaining")) || 0,
  );

  function startCountdown(countdownSeconds: number) {
    sessionStorage.setItem("countdownInterval", "true");
    countdownRemaining.value =
      Number(sessionStorage.getItem("countdownRemaining")) || countdownSeconds;

    const interval = setInterval(() => {
      countdownRemaining.value -= 1;
      sessionStorage.setItem(
        "countdownRemaining",
        countdownRemaining.value.toString(),
      );
      if (countdownRemaining.value <= 0) {
        clearInterval(interval);
        sessionStorage.removeItem("countdownInterval");
        sessionStorage.removeItem("countdownRemaining");
      }
    }, 1000);
  }

  async function generateOtp(phone_number: string) {
    try {
      await axios.post(
        `${url}/api/generate-otp`,
        { phone_number },
        {
          auth: { username, password },
          headers: { "Content-Type": "application/json" },
        },
      );
      phoneNumber.value = phone_number;
      requestSent.value = true;

      localStorage.setItem("phoneNumber", phone_number);
      localStorage.setItem("requestSent", String(true));
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async function verifyOtp(otp_code: number) {
    try {
      const response = await axios.post(
        `${url}/api/verify-otp`,
        { phone_number: phoneNumber.value, otp_code },
        {
          auth: { username, password },
          headers: { "Content-Type": "application/json" },
        },
      );

      const responseData: { access_token: string } = response.data;

      token.value = responseData.access_token;
      requestSent.value = false;

      localStorage.setItem("token", responseData.access_token);
      localStorage.setItem("requestSent", String(false));
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async function getSubscription() {
    try {
      const response = await axios.get(`${url}/api/subscriptions`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      user.value = response.data?.data;

      localStorage.setItem("user", JSON.stringify(response.data?.data));
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
  return {
    user,
    token,
    verifyOtp,
    generateOtp,
    phoneNumber,
    requestSent,
    startCountdown,
    getSubscription,
    countdownRemaining,
  };
});
