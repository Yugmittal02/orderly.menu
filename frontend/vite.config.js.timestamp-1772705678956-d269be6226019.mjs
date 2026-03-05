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
    port: 3e3,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true
      }
    }
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJYOlxcXFxTZXZhU2h1YmhhbVxcXFx3b3dcXFxcZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIlg6XFxcXFNldmFTaHViaGFtXFxcXHdvd1xcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vWDovU2V2YVNodWJoYW0vd293L2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICdAdGFpbHdpbmRjc3Mvdml0ZSc7XHJcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgdGFpbHdpbmRjc3MoKSxcclxuICAgIFZpdGVQV0Eoe1xyXG4gICAgICByZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyxcclxuICAgICAgaW5qZWN0UmVnaXN0ZXI6IG51bGwsIC8vIFdlIGhhbmRsZSByZWdpc3RyYXRpb24gbWFudWFsbHkgaW4gaW5kZXguaHRtbFxyXG4gICAgICBtYW5pZmVzdDogZmFsc2UsIC8vIFVzZSB0aGUgbWFuaWZlc3QuanNvbiBmcm9tIHB1YmxpYyBmb2xkZXJcclxuICAgICAgZGV2T3B0aW9uczoge1xyXG4gICAgICAgIGVuYWJsZWQ6IGZhbHNlIC8vIERpc2FibGUgaW4gZGV2IHRvIGF2b2lkIGlzc3Vlc1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIF0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiB0cnVlLCAvLyBBbGxvdyBleHRlcm5hbCBhY2Nlc3MgKG1vYmlsZSlcclxuICAgIHBvcnQ6IDMwMDAsXHJcbiAgICBwcm94eToge1xyXG4gICAgICAnL2FwaSc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjUwMDAnLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgLy8gUGVyZm9ybWFuY2Ugb3B0aW1pemF0aW9ucyBmb3IgZmFzdGVyIGxvYWRpbmdcclxuICBidWlsZDoge1xyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICAvLyBTcGxpdCB2ZW5kb3IgY2h1bmtzIGZvciBiZXR0ZXIgY2FjaGluZ1xyXG4gICAgICAgIG1hbnVhbENodW5rczoge1xyXG4gICAgICAgICAgJ3ZlbmRvci1yZWFjdCc6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlci1kb20nXSxcclxuICAgICAgICAgICd2ZW5kb3ItaWNvbnMnOiBbJ3JlYWN0LWljb25zJ10sXHJcbiAgICAgICAgICAndmVuZG9yLW1vdGlvbic6IFsnZnJhbWVyLW1vdGlvbiddLFxyXG4gICAgICAgICAgJ3ZlbmRvci1tYXBzJzogWydsZWFmbGV0JywgJ3JlYWN0LWxlYWZsZXQnXSxcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBJbmNyZWFzZSBjaHVuayBzaXplIHdhcm5pbmcgbGltaXRcclxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNTAwLFxyXG4gICAgLy8gRW5hYmxlIG1pbmlmaWNhdGlvblxyXG4gICAgbWluaWZ5OiAndGVyc2VyJyxcclxuICAgIHRlcnNlck9wdGlvbnM6IHtcclxuICAgICAgY29tcHJlc3M6IHtcclxuICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsIC8vIFJlbW92ZSBjb25zb2xlLmxvZyBpbiBwcm9kdWN0aW9uXHJcbiAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEyUSxTQUFTLG9CQUFvQjtBQUN4UyxPQUFPLFdBQVc7QUFDbEIsT0FBTyxpQkFBaUI7QUFDeEIsU0FBUyxlQUFlO0FBRXhCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxNQUNOLGNBQWM7QUFBQSxNQUNkLGdCQUFnQjtBQUFBO0FBQUEsTUFDaEIsVUFBVTtBQUFBO0FBQUEsTUFDVixZQUFZO0FBQUEsUUFDVixTQUFTO0FBQUE7QUFBQSxNQUNYO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsTUFDaEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFFQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUE7QUFBQSxRQUVOLGNBQWM7QUFBQSxVQUNaLGdCQUFnQixDQUFDLFNBQVMsYUFBYSxrQkFBa0I7QUFBQSxVQUN6RCxnQkFBZ0IsQ0FBQyxhQUFhO0FBQUEsVUFDOUIsaUJBQWlCLENBQUMsZUFBZTtBQUFBLFVBQ2pDLGVBQWUsQ0FBQyxXQUFXLGVBQWU7QUFBQSxRQUM1QztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUVBLHVCQUF1QjtBQUFBO0FBQUEsSUFFdkIsUUFBUTtBQUFBLElBQ1IsZUFBZTtBQUFBLE1BQ2IsVUFBVTtBQUFBLFFBQ1IsY0FBYztBQUFBO0FBQUEsUUFDZCxlQUFlO0FBQUEsTUFDakI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
