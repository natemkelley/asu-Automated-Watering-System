<template>
  <v-footer :inset="true" app>
    <span class="px-4">&copy; {{ new Date().getFullYear() }} - Nate Kelley - ASU HSE 424</span>
  </v-footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>
