'use client'

import { useState } from 'react'

type OpCategory = 'keygen' | 'csr' | 'cert' | 'convert' | 'inspect' | 'test' | 'ssl'

interface Operation {
  id: string
  category: OpCategory
  label: string
  desc: string
  fields: Field[]
  build: (vals: Record<string, string>) => string
}

interface Field {
  key: string
  label: string
  type: 'text' | 'select' | 'number' | 'checkbox'
  default: string
  options?: { val: string; label: string }[]
  placeholder?: string
  hint?: string
}

const OPERATIONS: Operation[] = [
  // ── Key Generation ──────────────────────────────────────────
  {
    id: 'gen-rsa-key',
    category: 'keygen',
    label: 'Generate RSA Private Key',
    desc: 'Create a new RSA private key',
    fields: [
      { key: 'bits', label: 'Key Size', type: 'select', default: '2048', options: [{ val: '2048', label: '2048-bit (Standard)' }, { val: '4096', label: '4096-bit (High Security)' }] },
      { key: 'out', label: 'Output File', type: 'text', default: 'private.key', placeholder: 'private.key' },
      { key: 'encrypted', label: 'Encrypt with passphrase', type: 'checkbox', default: 'false' },
    ],
    build: v => v.encrypted === 'true'
      ? `openssl genrsa -aes256 -out ${v.out} ${v.bits}`
      : `openssl genrsa -out ${v.out} ${v.bits}`,
  },
  {
    id: 'gen-ec-key',
    category: 'keygen',
    label: 'Generate EC Private Key',
    desc: 'Create an Elliptic Curve private key',
    fields: [
      { key: 'curve', label: 'Curve', type: 'select', default: 'prime256v1', options: [{ val: 'prime256v1', label: 'P-256 (prime256v1)' }, { val: 'secp384r1', label: 'P-384 (secp384r1)' }, { val: 'secp521r1', label: 'P-521 (secp521r1)' }] },
      { key: 'out', label: 'Output File', type: 'text', default: 'ec-private.key', placeholder: 'ec-private.key' },
    ],
    build: v => `openssl ecparam -genkey -name ${v.curve} -noout -out ${v.out}`,
  },
  {
    id: 'extract-pubkey',
    category: 'keygen',
    label: 'Extract Public Key',
    desc: 'Extract public key from private key',
    fields: [
      { key: 'in', label: 'Private Key File', type: 'text', default: 'private.key', placeholder: 'private.key' },
      { key: 'out', label: 'Output File', type: 'text', default: 'public.key', placeholder: 'public.key' },
    ],
    build: v => `openssl rsa -in ${v.in} -pubout -out ${v.out}`,
  },
  {
    id: 'remove-passphrase',
    category: 'keygen',
    label: 'Remove Key Passphrase',
    desc: 'Strip passphrase from an encrypted private key',
    fields: [
      { key: 'in', label: 'Encrypted Key File', type: 'text', default: 'encrypted.key', placeholder: 'encrypted.key' },
      { key: 'out', label: 'Output File (no passphrase)', type: 'text', default: 'decrypted.key', placeholder: 'decrypted.key' },
    ],
    build: v => `openssl rsa -in ${v.in} -out ${v.out}`,
  },
  {
    id: 'add-passphrase',
    category: 'keygen',
    label: 'Add Passphrase to Key',
    desc: 'Encrypt a private key with a passphrase',
    fields: [
      { key: 'in', label: 'Key File', type: 'text', default: 'private.key', placeholder: 'private.key' },
      { key: 'out', label: 'Encrypted Output File', type: 'text', default: 'encrypted.key', placeholder: 'encrypted.key' },
    ],
    build: v => `openssl rsa -aes256 -in ${v.in} -out ${v.out}`,
  },

  // ── CSR ─────────────────────────────────────────────────────
  {
    id: 'gen-csr',
    category: 'csr',
    label: 'Generate CSR',
    desc: 'Create a Certificate Signing Request from existing key',
    fields: [
      { key: 'key', label: 'Private Key File', type: 'text', default: 'private.key', placeholder: 'private.key' },
      { key: 'out', label: 'CSR Output File', type: 'text', default: 'server.csr', placeholder: 'server.csr' },
      { key: 'cn', label: 'Common Name (CN)', type: 'text', default: 'example.com', placeholder: 'example.com' },
      { key: 'o', label: 'Organization', type: 'text', default: '', placeholder: 'My Company Ltd' },
      { key: 'c', label: 'Country (2 letters)', type: 'text', default: 'TH', placeholder: 'TH' },
    ],
    build: v => `openssl req -new -key ${v.key} -out ${v.out} -subj "/CN=${v.cn}${v.o ? `/O=${v.o}` : ''}/C=${v.c}"`,
  },
  {
    id: 'gen-key-csr',
    category: 'csr',
    label: 'Generate Key + CSR (one command)',
    desc: 'Create private key and CSR together',
    fields: [
      { key: 'bits', label: 'Key Size', type: 'select', default: '2048', options: [{ val: '2048', label: '2048-bit' }, { val: '4096', label: '4096-bit' }] },
      { key: 'keyout', label: 'Key Output File', type: 'text', default: 'private.key', placeholder: 'private.key' },
      { key: 'out', label: 'CSR Output File', type: 'text', default: 'server.csr', placeholder: 'server.csr' },
      { key: 'cn', label: 'Common Name (CN)', type: 'text', default: 'example.com', placeholder: 'example.com' },
      { key: 'c', label: 'Country', type: 'text', default: 'TH', placeholder: 'TH' },
    ],
    build: v => `openssl req -new -newkey rsa:${v.bits} -nodes -keyout ${v.keyout} -out ${v.out} -subj "/CN=${v.cn}/C=${v.c}"`,
  },
  {
    id: 'verify-csr',
    category: 'csr',
    label: 'Verify CSR Signature',
    desc: 'Verify that a CSR signature is valid',
    fields: [
      { key: 'in', label: 'CSR File', type: 'text', default: 'server.csr', placeholder: 'server.csr' },
    ],
    build: v => `openssl req -in ${v.in} -verify -noout`,
  },

  // ── Certificates ─────────────────────────────────────────────
  {
    id: 'self-signed',
    category: 'cert',
    label: 'Self-signed Certificate',
    desc: 'Create a self-signed certificate from existing key',
    fields: [
      { key: 'key', label: 'Private Key File', type: 'text', default: 'private.key', placeholder: 'private.key' },
      { key: 'out', label: 'Certificate Output', type: 'text', default: 'cert.pem', placeholder: 'cert.pem' },
      { key: 'days', label: 'Validity (days)', type: 'number', default: '365', placeholder: '365' },
      { key: 'cn', label: 'Common Name (CN)', type: 'text', default: 'localhost', placeholder: 'localhost' },
    ],
    build: v => `openssl req -x509 -new -nodes -key ${v.key} -sha256 -days ${v.days} -out ${v.out} -subj "/CN=${v.cn}"`,
  },
  {
    id: 'self-signed-one',
    category: 'cert',
    label: 'Self-signed Cert (one command)',
    desc: 'Generate key + self-signed cert together',
    fields: [
      { key: 'keyout', label: 'Key Output File', type: 'text', default: 'private.key', placeholder: 'private.key' },
      { key: 'out', label: 'Certificate Output', type: 'text', default: 'cert.pem', placeholder: 'cert.pem' },
      { key: 'days', label: 'Validity (days)', type: 'number', default: '365', placeholder: '365' },
      { key: 'cn', label: 'Common Name (CN)', type: 'text', default: 'localhost', placeholder: 'localhost' },
      { key: 'bits', label: 'Key Size', type: 'select', default: '2048', options: [{ val: '2048', label: '2048-bit' }, { val: '4096', label: '4096-bit' }] },
    ],
    build: v => `openssl req -x509 -newkey rsa:${v.bits} -nodes -keyout ${v.keyout} -out ${v.out} -sha256 -days ${v.days} -subj "/CN=${v.cn}"`,
  },
  {
    id: 'sign-csr',
    category: 'cert',
    label: 'Sign CSR with CA',
    desc: 'Sign a CSR using your own CA key',
    fields: [
      { key: 'csr', label: 'CSR File', type: 'text', default: 'server.csr', placeholder: 'server.csr' },
      { key: 'ca', label: 'CA Certificate', type: 'text', default: 'ca.pem', placeholder: 'ca.pem' },
      { key: 'cakey', label: 'CA Private Key', type: 'text', default: 'ca.key', placeholder: 'ca.key' },
      { key: 'out', label: 'Output Certificate', type: 'text', default: 'server.pem', placeholder: 'server.pem' },
      { key: 'days', label: 'Validity (days)', type: 'number', default: '365', placeholder: '365' },
    ],
    build: v => `openssl x509 -req -in ${v.csr} -CA ${v.ca} -CAkey ${v.cakey} -CAcreateserial -out ${v.out} -days ${v.days} -sha256`,
  },
  {
    id: 'create-ca',
    category: 'cert',
    label: 'Create Root CA',
    desc: 'Generate a self-signed Root CA certificate',
    fields: [
      { key: 'keyout', label: 'CA Key Output', type: 'text', default: 'ca.key', placeholder: 'ca.key' },
      { key: 'out', label: 'CA Cert Output', type: 'text', default: 'ca.pem', placeholder: 'ca.pem' },
      { key: 'days', label: 'Validity (days)', type: 'number', default: '3650', placeholder: '3650' },
      { key: 'cn', label: 'CA Name (CN)', type: 'text', default: 'My Root CA', placeholder: 'My Root CA' },
      { key: 'bits', label: 'Key Size', type: 'select', default: '4096', options: [{ val: '2048', label: '2048-bit' }, { val: '4096', label: '4096-bit (Recommended for CA)' }] },
    ],
    build: v => `openssl req -x509 -newkey rsa:${v.bits} -nodes -keyout ${v.keyout} -out ${v.out} -sha256 -days ${v.days} -subj "/CN=${v.cn}"`,
  },

  // ── Format Conversion ────────────────────────────────────────
  {
    id: 'pem-to-der',
    category: 'convert',
    label: 'PEM → DER (Certificate)',
    desc: 'Convert certificate from PEM to DER binary format',
    fields: [
      { key: 'in', label: 'PEM Input File', type: 'text', default: 'cert.pem', placeholder: 'cert.pem' },
      { key: 'out', label: 'DER Output File', type: 'text', default: 'cert.der', placeholder: 'cert.der' },
    ],
    build: v => `openssl x509 -in ${v.in} -outform DER -out ${v.out}`,
  },
  {
    id: 'der-to-pem',
    category: 'convert',
    label: 'DER → PEM (Certificate)',
    desc: 'Convert certificate from DER binary to PEM format',
    fields: [
      { key: 'in', label: 'DER Input File', type: 'text', default: 'cert.der', placeholder: 'cert.der' },
      { key: 'out', label: 'PEM Output File', type: 'text', default: 'cert.pem', placeholder: 'cert.pem' },
    ],
    build: v => `openssl x509 -in ${v.in} -inform DER -out ${v.out}`,
  },
  {
    id: 'pem-to-pfx',
    category: 'convert',
    label: 'PEM → PFX/PKCS12',
    desc: 'Bundle cert + key into PFX for Windows/IIS',
    fields: [
      { key: 'cert', label: 'Certificate File', type: 'text', default: 'cert.pem', placeholder: 'cert.pem' },
      { key: 'key', label: 'Private Key File', type: 'text', default: 'private.key', placeholder: 'private.key' },
      { key: 'out', label: 'PFX Output File', type: 'text', default: 'bundle.pfx', placeholder: 'bundle.pfx' },
      { key: 'name', label: 'Friendly Name', type: 'text', default: 'mycert', placeholder: 'mycert' },
    ],
    build: v => `openssl pkcs12 -export -out ${v.out} -inkey ${v.key} -in ${v.cert} -name "${v.name}"`,
  },
  {
    id: 'pfx-to-pem',
    category: 'convert',
    label: 'PFX/PKCS12 → PEM',
    desc: 'Extract cert and key from PFX bundle',
    fields: [
      { key: 'in', label: 'PFX Input File', type: 'text', default: 'bundle.pfx', placeholder: 'bundle.pfx' },
      { key: 'out', label: 'PEM Output File', type: 'text', default: 'cert.pem', placeholder: 'cert.pem' },
      { key: 'noenc', label: 'No passphrase on output', type: 'checkbox', default: 'true' },
    ],
    build: v => `openssl pkcs12 -in ${v.in} -out ${v.out}${v.noenc === 'true' ? ' -nodes' : ''}`,
  },
  {
    id: 'key-pem-to-der',
    category: 'convert',
    label: 'Private Key PEM → DER',
    desc: 'Convert private key from PEM to DER format',
    fields: [
      { key: 'in', label: 'PEM Key File', type: 'text', default: 'private.key', placeholder: 'private.key' },
      { key: 'out', label: 'DER Output File', type: 'text', default: 'private.der', placeholder: 'private.der' },
    ],
    build: v => `openssl rsa -in ${v.in} -outform DER -out ${v.out}`,
  },
  {
    id: 'pem-to-pkcs8',
    category: 'convert',
    label: 'Key → PKCS#8',
    desc: 'Convert private key to PKCS#8 format (Java/Android)',
    fields: [
      { key: 'in', label: 'Key Input File', type: 'text', default: 'private.key', placeholder: 'private.key' },
      { key: 'out', label: 'PKCS8 Output File', type: 'text', default: 'private-pkcs8.key', placeholder: 'private-pkcs8.key' },
      { key: 'nocrypt', label: 'No encryption', type: 'checkbox', default: 'true' },
    ],
    build: v => `openssl pkcs8 -topk8${v.nocrypt === 'true' ? ' -nocrypt' : ''} -in ${v.in} -out ${v.out}`,
  },

  // ── Inspect ──────────────────────────────────────────────────
  {
    id: 'inspect-cert',
    category: 'inspect',
    label: 'Inspect Certificate',
    desc: 'View all details of a certificate file',
    fields: [
      { key: 'in', label: 'Certificate File', type: 'text', default: 'cert.pem', placeholder: 'cert.pem' },
      { key: 'noout', label: 'Hide encoded output', type: 'checkbox', default: 'true' },
    ],
    build: v => `openssl x509 -in ${v.in} -text${v.noout === 'true' ? ' -noout' : ''}`,
  },
  {
    id: 'inspect-csr',
    category: 'inspect',
    label: 'Inspect CSR',
    desc: 'View details of a Certificate Signing Request',
    fields: [
      { key: 'in', label: 'CSR File', type: 'text', default: 'server.csr', placeholder: 'server.csr' },
    ],
    build: v => `openssl req -in ${v.in} -text -noout`,
  },
  {
    id: 'inspect-key',
    category: 'inspect',
    label: 'Inspect Private Key',
    desc: 'View RSA private key details',
    fields: [
      { key: 'in', label: 'Key File', type: 'text', default: 'private.key', placeholder: 'private.key' },
    ],
    build: v => `openssl rsa -in ${v.in} -text -noout`,
  },
  {
    id: 'inspect-pfx',
    category: 'inspect',
    label: 'Inspect PFX/PKCS12',
    desc: 'View contents of a PFX bundle',
    fields: [
      { key: 'in', label: 'PFX File', type: 'text', default: 'bundle.pfx', placeholder: 'bundle.pfx' },
    ],
    build: v => `openssl pkcs12 -info -in ${v.in} -noout`,
  },
  {
    id: 'verify-cert',
    category: 'inspect',
    label: 'Verify Certificate Chain',
    desc: 'Verify a certificate against a CA bundle',
    fields: [
      { key: 'cafile', label: 'CA Bundle File', type: 'text', default: 'ca-bundle.pem', placeholder: 'ca-bundle.pem' },
      { key: 'in', label: 'Certificate File', type: 'text', default: 'cert.pem', placeholder: 'cert.pem' },
    ],
    build: v => `openssl verify -CAfile ${v.cafile} ${v.in}`,
  },
  {
    id: 'fingerprint',
    category: 'inspect',
    label: 'Get Certificate Fingerprint',
    desc: 'Get SHA-256 or SHA-1 fingerprint',
    fields: [
      { key: 'in', label: 'Certificate File', type: 'text', default: 'cert.pem', placeholder: 'cert.pem' },
      { key: 'hash', label: 'Hash Algorithm', type: 'select', default: 'sha256', options: [{ val: 'sha256', label: 'SHA-256' }, { val: 'sha1', label: 'SHA-1' }, { val: 'sha384', label: 'SHA-384' }] },
    ],
    build: v => `openssl x509 -in ${v.in} -fingerprint -${v.hash} -noout`,
  },
  {
    id: 'get-san',
    category: 'inspect',
    label: 'Get Subject Alternative Names',
    desc: 'List all SANs from a certificate',
    fields: [
      { key: 'in', label: 'Certificate File', type: 'text', default: 'cert.pem', placeholder: 'cert.pem' },
    ],
    build: v => `openssl x509 -in ${v.in} -noout -ext subjectAltName`,
  },
  {
    id: 'get-issuer',
    category: 'inspect',
    label: 'Get Issuer & Subject',
    desc: 'Show certificate issuer and subject fields',
    fields: [
      { key: 'in', label: 'Certificate File', type: 'text', default: 'cert.pem', placeholder: 'cert.pem' },
    ],
    build: v => `openssl x509 -in ${v.in} -noout -issuer -subject`,
  },

  // ── Test & Verify ─────────────────────────────────────────────
  {
    id: 'check-expiry',
    category: 'test',
    label: 'Check Certificate Expiry',
    desc: 'Show certificate validity dates',
    fields: [
      { key: 'in', label: 'Certificate File', type: 'text', default: 'cert.pem', placeholder: 'cert.pem' },
    ],
    build: v => `openssl x509 -in ${v.in} -noout -dates`,
  },
  {
    id: 'check-cert-key',
    category: 'test',
    label: 'Check Cert ↔ Key Match',
    desc: 'Verify certificate and private key are a pair',
    fields: [
      { key: 'cert', label: 'Certificate File', type: 'text', default: 'cert.pem', placeholder: 'cert.pem' },
      { key: 'key', label: 'Private Key File', type: 'text', default: 'private.key', placeholder: 'private.key' },
    ],
    build: v => `openssl x509 -noout -modulus -in ${v.cert} | md5sum\nopenssl rsa -noout -modulus -in ${v.key} | md5sum`,
  },
  {
    id: 'hash-file',
    category: 'test',
    label: 'Hash a File',
    desc: 'Compute hash/checksum of any file',
    fields: [
      { key: 'file', label: 'File to hash', type: 'text', default: 'file.txt', placeholder: 'file.txt' },
      { key: 'algo', label: 'Algorithm', type: 'select', default: 'sha256', options: [{ val: 'sha256', label: 'SHA-256' }, { val: 'sha512', label: 'SHA-512' }, { val: 'sha1', label: 'SHA-1' }, { val: 'md5', label: 'MD5' }] },
    ],
    build: v => `openssl dgst -${v.algo} ${v.file}`,
  },
  {
    id: 'speed-test',
    category: 'test',
    label: 'OpenSSL Speed Test',
    desc: 'Benchmark cryptographic performance',
    fields: [
      { key: 'algo', label: 'Algorithm', type: 'select', default: 'aes-256-cbc', options: [{ val: 'aes-256-cbc', label: 'AES-256-CBC' }, { val: 'aes-128-cbc', label: 'AES-128-CBC' }, { val: 'sha256', label: 'SHA-256' }, { val: 'rsa2048', label: 'RSA 2048' }, { val: 'ecdsap256', label: 'ECDSA P-256' }] },
    ],
    build: v => `openssl speed ${v.algo}`,
  },

  // ── SSL / TLS Check ──────────────────────────────────────────
  {
    id: 'ssl-check',
    category: 'ssl',
    label: 'Check SSL Certificate (live)',
    desc: 'Inspect SSL cert of a live server',
    fields: [
      { key: 'host', label: 'Hostname', type: 'text', default: 'example.com', placeholder: 'example.com' },
      { key: 'port', label: 'Port', type: 'number', default: '443', placeholder: '443' },
    ],
    build: v => `echo | openssl s_client -connect ${v.host}:${v.port} -servername ${v.host} 2>/dev/null | openssl x509 -noout -text`,
  },
  {
    id: 'ssl-expiry',
    category: 'ssl',
    label: 'Check SSL Expiry (live)',
    desc: 'Get expiry date of a live server SSL cert',
    fields: [
      { key: 'host', label: 'Hostname', type: 'text', default: 'example.com', placeholder: 'example.com' },
      { key: 'port', label: 'Port', type: 'number', default: '443', placeholder: '443' },
    ],
    build: v => `echo | openssl s_client -connect ${v.host}:${v.port} -servername ${v.host} 2>/dev/null | openssl x509 -noout -dates`,
  },
  {
    id: 'ssl-chain',
    category: 'ssl',
    label: 'Show Full Certificate Chain',
    desc: 'Dump all certificates in the chain from a live server',
    fields: [
      { key: 'host', label: 'Hostname', type: 'text', default: 'example.com', placeholder: 'example.com' },
      { key: 'port', label: 'Port', type: 'number', default: '443', placeholder: '443' },
    ],
    build: v => `openssl s_client -connect ${v.host}:${v.port} -servername ${v.host} -showcerts < /dev/null`,
  },
  {
    id: 'ssl-protocols',
    category: 'ssl',
    label: 'Test TLS Protocol Support',
    desc: 'Check which TLS version a server supports',
    fields: [
      { key: 'host', label: 'Hostname', type: 'text', default: 'example.com', placeholder: 'example.com' },
      { key: 'port', label: 'Port', type: 'number', default: '443', placeholder: '443' },
      { key: 'proto', label: 'Protocol to test', type: 'select', default: 'tls1_2', options: [{ val: 'tls1_2', label: 'TLS 1.2' }, { val: 'tls1_3', label: 'TLS 1.3' }, { val: 'tls1_1', label: 'TLS 1.1 (deprecated)' }, { val: 'tls1', label: 'TLS 1.0 (deprecated)' }] },
    ],
    build: v => `openssl s_client -connect ${v.host}:${v.port} -servername ${v.host} -${v.proto} < /dev/null`,
  },
  {
    id: 'ssl-cipher',
    category: 'ssl',
    label: 'Test Specific Cipher Suite',
    desc: 'Check if a server supports a specific cipher',
    fields: [
      { key: 'host', label: 'Hostname', type: 'text', default: 'example.com', placeholder: 'example.com' },
      { key: 'port', label: 'Port', type: 'number', default: '443', placeholder: '443' },
      { key: 'cipher', label: 'Cipher Suite', type: 'text', default: 'ECDHE-RSA-AES256-GCM-SHA384', placeholder: 'ECDHE-RSA-AES256-GCM-SHA384' },
    ],
    build: v => `openssl s_client -connect ${v.host}:${v.port} -servername ${v.host} -cipher ${v.cipher} < /dev/null`,
  },
  {
    id: 'ssl-fingerprint',
    category: 'ssl',
    label: 'Get Live Server Cert Fingerprint',
    desc: 'Get SHA-256 fingerprint of a server certificate',
    fields: [
      { key: 'host', label: 'Hostname', type: 'text', default: 'example.com', placeholder: 'example.com' },
      { key: 'port', label: 'Port', type: 'number', default: '443', placeholder: '443' },
    ],
    build: v => `echo | openssl s_client -connect ${v.host}:${v.port} -servername ${v.host} 2>/dev/null | openssl x509 -fingerprint -sha256 -noout`,
  },
  {
    id: 'ssl-smtp',
    category: 'ssl',
    label: 'Test SMTP SSL (STARTTLS)',
    desc: 'Check SSL on SMTP server with STARTTLS',
    fields: [
      { key: 'host', label: 'SMTP Hostname', type: 'text', default: 'smtp.example.com', placeholder: 'smtp.example.com' },
      { key: 'port', label: 'Port', type: 'number', default: '587', placeholder: '587' },
    ],
    build: v => `openssl s_client -connect ${v.host}:${v.port} -starttls smtp`,
  },
  {
    id: 'ssl-imap',
    category: 'ssl',
    label: 'Test IMAP SSL (STARTTLS)',
    desc: 'Check SSL on IMAP server with STARTTLS',
    fields: [
      { key: 'host', label: 'IMAP Hostname', type: 'text', default: 'imap.example.com', placeholder: 'imap.example.com' },
      { key: 'port', label: 'Port', type: 'number', default: '143', placeholder: '143' },
    ],
    build: v => `openssl s_client -connect ${v.host}:${v.port} -starttls imap`,
  },
  {
    id: 'ssl-save-cert',
    category: 'ssl',
    label: 'Download Server Certificate',
    desc: 'Save a live server certificate to a file',
    fields: [
      { key: 'host', label: 'Hostname', type: 'text', default: 'example.com', placeholder: 'example.com' },
      { key: 'port', label: 'Port', type: 'number', default: '443', placeholder: '443' },
      { key: 'out', label: 'Output File', type: 'text', default: 'server.pem', placeholder: 'server.pem' },
    ],
    build: v => `echo | openssl s_client -connect ${v.host}:${v.port} -servername ${v.host} 2>/dev/null | openssl x509 -out ${v.out}`,
  },
  {
    id: 'ocsp-check',
    category: 'ssl',
    label: 'OCSP Certificate Status',
    desc: 'Check if a certificate is revoked via OCSP',
    fields: [
      { key: 'cert', label: 'Certificate File', type: 'text', default: 'cert.pem', placeholder: 'cert.pem' },
      { key: 'issuer', label: 'Issuer Certificate', type: 'text', default: 'issuer.pem', placeholder: 'issuer.pem' },
      { key: 'url', label: 'OCSP URL', type: 'text', default: 'http://ocsp.example.com', placeholder: 'http://ocsp.example.com', hint: 'From AIA extension' },
    ],
    build: v => `openssl ocsp -issuer ${v.issuer} -cert ${v.cert} -url ${v.url} -resp_text`,
  },
]

const CATEGORIES: { id: OpCategory; label: string; emoji: string }[] = [
  { id: 'keygen', label: 'Key Generation', emoji: '🔑' },
  { id: 'csr', label: 'CSR', emoji: '📋' },
  { id: 'cert', label: 'Certificates', emoji: '📜' },
  { id: 'convert', label: 'Convert', emoji: '🔄' },
  { id: 'inspect', label: 'Inspect', emoji: '🔍' },
  { id: 'test', label: 'Test & Hash', emoji: '🧪' },
  { id: 'ssl', label: 'SSL / TLS Check', emoji: '🌐' },
]

export default function OpenSSLCommandBuilder() {
  const [activeCategory, setActiveCategory] = useState<OpCategory>('ssl')
  const [activeOp, setActiveOp] = useState<Operation>(OPERATIONS.find(o => o.id === 'ssl-check')!)
  const [values, setValues] = useState<Record<string, string>>({ host: 'example.com', port: '443' })
  const [copied, setCopied] = useState(false)

  const opsInCategory = OPERATIONS.filter(o => o.category === activeCategory)

  const selectOp = (op: Operation) => {
    setActiveOp(op)
    const defaults: Record<string, string> = {}
    op.fields.forEach(f => { defaults[f.key] = f.default })
    setValues(defaults)
    setCopied(false)
  }

  const getVal = (key: string, def: string) => values[key] ?? def

  const command = (() => {
    try {
      const merged: Record<string, string> = {}
      activeOp.fields.forEach(f => { merged[f.key] = getVal(f.key, f.default) })
      return activeOp.build(merged)
    } catch { return '' }
  })()

  const copy = async () => {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const inputStyle = {
    width: '100%', padding: '7px 10px', border: '0.5px solid #c8c6c0',
    borderRadius: 6, outline: 'none', fontFamily: 'var(--font-mono)',
    fontSize: 12, color: '#1a1917', background: '#ffffff',
    boxSizing: 'border-box' as const,
  }

  return (
    <div className="space-y-4">

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => {
            setActiveCategory(cat.id)
            const first = OPERATIONS.find(o => o.category === cat.id)
            if (first) selectOp(first)
          }} style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, padding: '5px 12px',
            background: activeCategory === cat.id ? '#1a1917' : '#ffffff',
            color: activeCategory === cat.id ? '#f8f7f4' : '#6b6960',
            border: '0.5px solid #c8c6c0', borderRadius: 99, cursor: 'pointer',
          }}>{cat.emoji} {cat.label}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 10 }}>

        {/* Operation list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {opsInCategory.map(op => (
            <button key={op.id} onClick={() => selectOp(op)} style={{
              fontFamily: 'var(--font-sans)', fontSize: 12, padding: '8px 10px',
              background: activeOp.id === op.id ? '#eeedfe' : '#ffffff',
              color: activeOp.id === op.id ? '#3c3489' : '#1a1917',
              border: `0.5px solid ${activeOp.id === op.id ? '#8b7fd4' : '#c8c6c0'}`,
              borderRadius: 6, cursor: 'pointer', textAlign: 'left', lineHeight: 1.3,
            }}>{op.label}</button>
          ))}
        </div>

        {/* Config panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Op header */}
          <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, padding: '12px 14px' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500, color: '#1a1917', margin: '0 0 2px' }}>{activeOp.label}</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: 0 }}>{activeOp.desc}</p>
          </div>

          {/* Fields */}
          <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, padding: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {activeOp.fields.map(field => (
                <div key={field.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <label style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: '#1a1917' }}>{field.label}</label>
                    {field.hint && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>{field.hint}</span>}
                  </div>
                  {field.type === 'select' && (
                    <select value={getVal(field.key, field.default)}
                      onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                      style={inputStyle}>
                      {field.options?.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
                    </select>
                  )}
                  {(field.type === 'text' || field.type === 'number') && (
                    <input type={field.type} value={getVal(field.key, field.default)}
                      onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                      placeholder={field.placeholder} style={inputStyle} />
                  )}
                  {field.type === 'checkbox' && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input type="checkbox"
                        checked={getVal(field.key, field.default) === 'true'}
                        onChange={e => setValues(v => ({ ...v, [field.key]: e.target.checked ? 'true' : 'false' }))} />
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: '#1a1917' }}>Enable</span>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Generated command */}
          <div style={{ background: '#1a1917', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em' }}>GENERATED COMMAND</span>
              <button onClick={copy} style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px',
                background: copied ? '#085041' : '#333',
                color: copied ? '#e1f5ee' : '#a8a69e',
                border: `0.5px solid ${copied ? '#1D9E75' : '#555'}`,
                borderRadius: 5, cursor: 'pointer',
              }}>{copied ? '✓ Copied!' : 'Copy'}</button>
            </div>
            <pre style={{
              fontFamily: 'var(--font-mono)', fontSize: 12, color: '#e1f5ee',
              padding: '14px', margin: 0, overflowX: 'auto', lineHeight: 1.7,
              whiteSpace: 'pre-wrap', wordBreak: 'break-all',
            }}>{command}</pre>
          </div>

          {/* Tip */}
          <div style={{ background: '#faeeda', border: '0.5px solid #e8c97a', borderRadius: 6, padding: '8px 12px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#633806', margin: 0, lineHeight: 1.6 }}>
              💡 OpenSSL is pre-installed on Linux and macOS. Windows: use Git Bash, WSL, or download from slproweb.com
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}