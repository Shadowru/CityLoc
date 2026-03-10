import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      '$lib': path.resolve(__dirname, './src'),
      '$components': path.resolve(__dirname, './src/components'),
      '$stores': path.resolve(__dirname, './src/stores'),
      '$services': path.resolve(__dirname, './src/services'),
      '$features': path.resolve(__dirname, './src/features')
    }
  },
  server: {
    port: 5173,
    host: '0.0.0.0', // Listen on all network interfaces
    https: (() => {
      if (process.env.VITE_HTTPS === 'true') {
        try {
          // Try to use pre-generated certificates
          const keyPath = './localhost-key.pem'
          const certPath = './localhost.pem'
          if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
            console.log('Using pre-generated SSL certificates for HTTPS')
            return {
              key: fs.readFileSync(keyPath),
              cert: fs.readFileSync(certPath),
              // Modern TLS configuration for browser compatibility
              ciphers: [
                'TLS_AES_128_GCM_SHA256',
                'TLS_AES_256_GCM_SHA384',
                'TLS_CHACHA20_POLY1305_SHA256',
                'ECDHE-RSA-AES128-GCM-SHA256',
                'ECDHE-RSA-AES256-GCM-SHA384',
                'ECDHE-RSA-CHACHA20-POLY1305',
                'DHE-RSA-AES128-GCM-SHA256',
                'DHE-RSA-AES256-GCM-SHA384'
              ].join(':'),
              minVersion: 'TLSv1.2',
              honorCipherOrder: true,
              secureOptions: crypto.constants.SSL_OP_NO_SSLv2 |
                            crypto.constants.SSL_OP_NO_SSLv3 |
                            crypto.constants.SSL_OP_NO_TLSv1 |
                            crypto.constants.SSL_OP_NO_TLSv1_1
            }
          } else {
            console.warn('SSL certificate files not found. Generating auto-certificate...')
            console.warn('Run "npm run generate-cert" to generate persistent certificates')
          }
        } catch (err) {
          console.warn('Failed to load SSL certificates:', err.message)
        }
      }
      // Auto-generated self-signed certificate with modern settings
      console.log('Using auto-generated SSL certificate for HTTPS with modern TLS settings')
      return {
        // Let Vite generate certificate, but with modern settings
        ciphers: [
          'TLS_AES_128_GCM_SHA256',
          'TLS_AES_256_GCM_SHA384',
          'TLS_CHACHA20_POLY1305_SHA256',
          'ECDHE-RSA-AES128-GCM-SHA256',
          'ECDHE-RSA-AES256-GCM-SHA384'
        ].join(':'),
        minVersion: 'TLSv1.2'
      }
    })(),
    strictPort: true
  }
})