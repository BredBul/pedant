import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/pages/HomePage.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [{ name: "home", path: "/", component: HomePage }],
});
