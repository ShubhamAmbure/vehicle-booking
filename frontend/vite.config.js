 // vite.config.js
 import { defineConfig } from "vite";
 import react from "@vitejs/plugin-react"
 export default defineConfig({
   plugins: [react()],
 });


// // // vite.config.js
// // import { defineConfig } from "vite";
// // import react from "@vitejs/plugin-react";
// // import tailwindcss from "tailwindcss";
// // import autoprefixer from "autoprefixer";

// // export default defineConfig({
// //   plugins: [react()],
// //   css: {
// //     postcss: {
// //       plugins: [tailwindcss(), autoprefixer()],
// //     },
// //   },
// // });


// // vite.config.js
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/postcss";  // ✅ use the new package

// export default defineConfig({
//   plugins: [react()],
//   css: {
//     postcss: {
//       plugins: [tailwindcss()],
//     },
//   },
// });
