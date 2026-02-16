// vite.config.js
import { defineConfig } from "file:///X:/SevaShubham/wow/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///X:/SevaShubham/wow/frontend/node_modules/@vitejs/plugin-react/dist/index.js";
import tailwindcss from "file:///X:/SevaShubham/wow/frontend/node_modules/@tailwindcss/vite/dist/index.mjs";
import { VitePWA } from "file:///X:/SevaShubham/wow/frontend/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: null,
      // We handle registration manually in index.html
      manifest: false,
      // Use the manifest.json from public folder
      devOptions: {
        enabled: false
        // Disable in dev to avoid issues
      }
    })
  ],
  server: {
    host: true,
    // Allow external access (mobile)
    port: 3e3
  },
  // Performance optimizations for faster loading
  build: {
    rollupOptions: {
      output: {
        // Split vendor chunks for better caching
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-icons": ["react-icons"],
          "vendor-motion": ["framer-motion"],
          "vendor-maps": ["leaflet", "react-leaflet"]
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 500,
    // Enable minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        // Remove console.log in production
        drop_debugger: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJYOlxcXFxTZXZhU2h1YmhhbVxcXFx3b3dcXFxcZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIlg6XFxcXFNldmFTaHViaGFtXFxcXHdvd1xcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vWDovU2V2YVNodWJoYW0vd293L2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICdAdGFpbHdpbmRjc3Mvdml0ZSc7XHJcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgdGFpbHdpbmRjc3MoKSxcclxuICAgIFZpdGVQV0Eoe1xyXG4gICAgICByZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyxcclxuICAgICAgaW5qZWN0UmVnaXN0ZXI6IG51bGwsIC8vIFdlIGhhbmRsZSByZWdpc3RyYXRpb24gbWFudWFsbHkgaW4gaW5kZXguaHRtbFxyXG4gICAgICBtYW5pZmVzdDogZmFsc2UsIC8vIFVzZSB0aGUgbWFuaWZlc3QuanNvbiBmcm9tIHB1YmxpYyBmb2xkZXJcclxuICAgICAgZGV2T3B0aW9uczoge1xyXG4gICAgICAgIGVuYWJsZWQ6IGZhbHNlIC8vIERpc2FibGUgaW4gZGV2IHRvIGF2b2lkIGlzc3Vlc1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIF0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiB0cnVlLCAvLyBBbGxvdyBleHRlcm5hbCBhY2Nlc3MgKG1vYmlsZSlcclxuICAgIHBvcnQ6IDMwMDAsXHJcbiAgfSxcclxuICAvLyBQZXJmb3JtYW5jZSBvcHRpbWl6YXRpb25zIGZvciBmYXN0ZXIgbG9hZGluZ1xyXG4gIGJ1aWxkOiB7XHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIC8vIFNwbGl0IHZlbmRvciBjaHVua3MgZm9yIGJldHRlciBjYWNoaW5nXHJcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XHJcbiAgICAgICAgICAndmVuZG9yLXJlYWN0JzogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3Qtcm91dGVyLWRvbSddLFxyXG4gICAgICAgICAgJ3ZlbmRvci1pY29ucyc6IFsncmVhY3QtaWNvbnMnXSxcclxuICAgICAgICAgICd2ZW5kb3ItbW90aW9uJzogWydmcmFtZXItbW90aW9uJ10sXHJcbiAgICAgICAgICAndmVuZG9yLW1hcHMnOiBbJ2xlYWZsZXQnLCAncmVhY3QtbGVhZmxldCddLFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIEluY3JlYXNlIGNodW5rIHNpemUgd2FybmluZyBsaW1pdFxyXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiA1MDAsXHJcbiAgICAvLyBFbmFibGUgbWluaWZpY2F0aW9uXHJcbiAgICBtaW5pZnk6ICd0ZXJzZXInLFxyXG4gICAgdGVyc2VyT3B0aW9uczoge1xyXG4gICAgICBjb21wcmVzczoge1xyXG4gICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSwgLy8gUmVtb3ZlIGNvbnNvbGUubG9nIGluIHByb2R1Y3Rpb25cclxuICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTJRLFNBQVMsb0JBQW9CO0FBQ3hTLE9BQU8sV0FBVztBQUNsQixPQUFPLGlCQUFpQjtBQUN4QixTQUFTLGVBQWU7QUFFeEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLE1BQ04sY0FBYztBQUFBLE1BQ2QsZ0JBQWdCO0FBQUE7QUFBQSxNQUNoQixVQUFVO0FBQUE7QUFBQSxNQUNWLFlBQVk7QUFBQSxRQUNWLFNBQVM7QUFBQTtBQUFBLE1BQ1g7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUE7QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUE7QUFBQSxFQUVBLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQTtBQUFBLFFBRU4sY0FBYztBQUFBLFVBQ1osZ0JBQWdCLENBQUMsU0FBUyxhQUFhLGtCQUFrQjtBQUFBLFVBQ3pELGdCQUFnQixDQUFDLGFBQWE7QUFBQSxVQUM5QixpQkFBaUIsQ0FBQyxlQUFlO0FBQUEsVUFDakMsZUFBZSxDQUFDLFdBQVcsZUFBZTtBQUFBLFFBQzVDO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQTtBQUFBLElBRUEsdUJBQXVCO0FBQUE7QUFBQSxJQUV2QixRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDYixVQUFVO0FBQUEsUUFDUixjQUFjO0FBQUE7QUFBQSxRQUNkLGVBQWU7QUFBQSxNQUNqQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
