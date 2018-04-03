---
layout: page
title: "Cryptographic Libraries"
category: sigchain
order: 4
---

# Cryptographic Libraries
The sigchain protocol depends on public-key signatures, public-key encryption, symmetric-key encryption, and cryptographic hash functions.

For public-key and symmetric-key cryptography, the sigchain protocol uses the 
**[libsodium library](https://download.libsodium.org/doc/)**. Specifically,

- **public-key signatures** use libsodium's *Sign* [`crypto_sign_detached`](https://download.libsodium.org/doc/public-key_cryptography/public-key_signatures.html) function

- **public-key encryptions** use libsodium's public-key authenticated encryption *Box* [`crypto_box_easy`](https://download.libsodium.org/doc/public-key_cryptography/authenticated_encryption.html) function

- **symmetric-key encryptions** use libsodium's secret-key authenticated encryption *SecretBox* [`crypto_secretbox_easy`](https://download.libsodium.org/doc/secret-key_cryptography/authenticated_encryption.html) function

For cryptographic hash functions such as the hash function used to compute block hashes, the sigchain protocol uses `SHA-256`.
