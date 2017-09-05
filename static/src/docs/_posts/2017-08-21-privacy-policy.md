---
layout: page
title: "Privacy Policy"
category: security
order: 3
---

# App Privacy Policy

## What are Kryptonite and krd?

Kryptonite is an iOS and Android application that generates and stores a key pair for use with SSH (Secure Shell) and provides a mechanism to delegate access to the private key to computers running krd. The private key never leaves Kryptonite. Instead, through a pairing procedure, Kryptonite creates a channel for krd to send “signature requests” whereby upon a valid request, Kryptonite cryptographically signs the requested data with the private key and only sends the resulting signature back to krd. This communication channel is encrypted and signed with a session key established during the pairing procedure.

## Private Key Storage

On iOS, Kryptonite generates a `4096-bit RSA` key pair using the Apple iOS Security framework or optionally an `Ed25519` key pair using libsodium. Kryptonite stores the private key in the iOS Keychain with accessibility level `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly`. To learn more about the security of Apple cryptography libaries and the Apple iOS Keychain see the [iOS Security Guide](https://www.apple.com/business/docs/iOS_Security_Guide.pdf).

On Android, Kryptonite generates a `3072-bit RSA` key pair (because of the long secure hardware key generation time). The private key is stored in secure hardware called the Android Keystore and cannot be extracted, even by Kryptonite. The Android Keystore performs private key operations as a black box.

## What information do we collect?
If analytics are enabled, we collect the following information about usage of the Kryptonite app:

- App version
- iOS/Android Model, Version, Carrier, ISP
- Frequency of use for each app screen
- Frequency of approval requests
- Type of approval request: manual or automatic
- Latency of krd responses
- Whether a krd request times out
- City (automatically determined by Google Analytics from IP)
- Email addresses (public key labels)
- Types of kr commands run (i.e. kr add, but the name of the server is not recorded)

## What information do we NOT collect?
We do NOT collect any properties of your SSH communication. These are examples of things we DO NOT collect:

- Private key
- SSH remote host names
- SSH remote host public keys
- SSH session ids
- SSH User names
- Computer names

## How do we collect information?
We report all collected information, except user email addresses, to Google Analytics by sending HTTP requests to the [Google Analytics Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/). This data is governed by the Google privacy policy located at https://www.google.com/policies/privacy/. We do NOT use the Google Analytics iOS or Android SDKs. Every Kryptonite app generates a 128-bit random ID to be used only for analytics. User email addresses, along with the `128-bit` analytics ID, are stored in Amazon Web Services’ DynamoDB Service, governed by the [AWS privacy policy](https://aws.amazon.com/privacy/). Using the email address and analytics ID stored in DynamoDB, krypt.co is able to associate a Google Analytics session to the corresponding user’s email address.

## Disable information collection

Users can disable all information collection by navigating to the Kryptonite settings page and enabling the “Disable Google Analytics” setting. Kryptonite WILL report to Google Analytics that analytics have been disabled, but will not report any future events until analytics have been re-enabled by toggling the same setting.

## How we use your information

We use your information to improve Kryptonite’s performance and quality. We use this information to learn which features are being used and how often. We also use this information to detect irregularities. This enables us to modify functionality, diagnose potential bugs, and determine which features to select for product updates. 
We collect email addresses for the purpose of communicating new features, product updates, and company updates. We will never spam email addresses and provide users with a way to opt out.

## Contact
For inquiries about our privacy policy or other information, email support@krypt.co.
