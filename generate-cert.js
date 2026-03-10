import selfsigned from 'selfsigned'
import fs from 'fs'
import os from 'os'

// Get all network interfaces IPv4 addresses
function getLocalIPs() {
  const interfaces = os.networkInterfaces()
  const ips = []
  
  for (const iface of Object.values(interfaces)) {
    if (iface) {
      for (const config of iface) {
        if (config.family === 'IPv4' && !config.internal) {
          ips.push(config.address)
        }
      }
    }
  }
  
  return ips
}

const localIPs = getLocalIPs()
console.log('Found local IP addresses:', localIPs)

const attrs = [{ name: 'commonName', value: 'localhost' }]
const altNames = [
  { type: 2, value: 'localhost' },
  { type: 2, value: '127.0.0.1' },
  { type: 2, value: '::1' },
  // Add all local IPs
  ...localIPs.map(ip => ({ type: 7, ip })) // type 7 is IP address
]

const options = {
  keySize: 2048,
  days: 365,
  algorithm: 'sha256',
  extensions: [
    {
      name: 'subjectAltName',
      altNames
    },
    {
      name: 'basicConstraints',
      cA: false
    },
    {
      name: 'keyUsage',
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true
    },
    {
      name: 'extKeyUsage',
      serverAuth: true,
      clientAuth: true
    }
  ]
}

console.log('Generating self-signed SSL certificate...')

// Use callback style
selfsigned.generate(attrs, options, function (err, pems) {
  if (err) {
    console.error('Failed to generate certificate:', err)
    process.exit(1)
  }
  
  console.log('Certificate generated successfully')
  fs.writeFileSync('localhost-key.pem', pems.private)
  fs.writeFileSync('localhost.pem', pems.cert)
  
  console.log('\nCertificate generated:')
  console.log('  - Private key: localhost-key.pem')
  console.log('  - Certificate: localhost.pem')
  console.log('\nCertificate includes:')
  console.log('  - localhost')
  console.log('  - 127.0.0.1')
  console.log('  - ::1')
  localIPs.forEach(ip => console.log(`  - ${ip}`))
  
  console.log('\nTo use HTTPS in development:')
  console.log('  1. Run: npm run dev:https')
  console.log('  2. Open: https://localhost:5173 or https://' + (localIPs[0] || 'localhost') + ':5173')
  console.log('  3. Accept the security warning (self-signed certificate)')
})

console.log('Certificate generated:')
console.log('  - Private key: localhost-key.pem')
console.log('  - Certificate: localhost.pem')
console.log('\nTo use HTTPS in development:')
console.log('  1. Run: npm run dev:https')
console.log('  2. Open: https://localhost:5173')
console.log('  3. Accept the security warning (self-signed certificate)')