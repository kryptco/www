---
layout: page
title: "Privacy Policy"
category: security
order: 3
---

# App Privacy Policy

## What are Krypton and krd?

Krypton is an iOS and Android application that generates and stores a key pair for use with SSH (Secure Shell) and provides a mechanism to delegate access to the private key to computers running krd. The private key never leaves Krypton. Instead, through a pairing procedure, Krypton creates a channel for krd to send “signature requests” whereby upon a valid request, Krypton cryptographically signs the requested data with the private key and only sends the resulting signature back to krd. This communication channel is encrypted and signed with a session key established during the pairing procedure.

## Private Key Storage

### iOS
On iOS, Krypton by default generates a `4096-bit RSA` key pair using the Apple iOS Security framework.

Optionally, Krypton can be asked instead to generate one of the following key types:
- A `Ed25519` key pair using [libsodium](https://download.libsodium.org/doc/)
- A `NIST P-256` key pair using the Apple iOS Security framework (introduced in 2.3.0) 

For `Ed25519` and `4096-bit RSA` key pairs, Krypton stores the private key in the iOS Keychain with accessibility level `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly`. 

For `NIST P-256` key pairs, Krypton generates and stores the private key in the iOS Secure Enclave.

U2F private keys are `NIST P-256` key pairs and therefore are generated and stored in the iOS Secure Enclave Processor.

To learn more about the security of Apple cryptography libaries and the Apple iOS Keychain see the [iOS Security Guide](https://www.apple.com/business/docs/iOS_Security_Guide.pdf).

### Android
On Android, Krypton generates a `3072-bit RSA` key pair (stored in the AndroidKeystore crypto coprocessor) or optionally an `Ed25519` key pair using [libsodium](https://download.libsodium.org/doc/) (stored in app-private file storage). When the private key is stored in the AndroidKeystore it cannot be extracted, even by Krypton, since the Android Keystore performs private key operations as a black box.

U2F private keys are `NIST P-256` key pairs and are generated and stored in the AndroidKeystore.

## Krypton Core

### What information do we collect?
If analytics are enabled, we collect the following information about usage of the Krypton app:

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

### What information do we NOT collect?
We do NOT collect any properties of your SSH communication. These are examples of things we DO NOT collect:

- Private key
- SSH remote host names
- SSH remote host public keys
- SSH session ids
- SSH User names
- Git commits and tags
- Computer names

### How do we collect information?
We report all collected information, except user email addresses, to Google Analytics by sending HTTP requests to the [Google Analytics Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/). This data is governed by the Google privacy policy located at https://www.google.com/policies/privacy/. We do NOT use the Google Analytics iOS or Android SDKs. Every Krypton app generates a 128-bit random ID to be used only for analytics. User email addresses, along with the `128-bit` analytics ID, are stored in Amazon Web Services’ DynamoDB Service, governed by the [AWS privacy policy](https://aws.amazon.com/privacy/). Using the email address and analytics ID stored in DynamoDB, krypt.co is able to associate a Google Analytics session to the corresponding user’s email address.

### Disable information collection

Users can disable all information collection by navigating to the Krypton settings page and enabling the “Disable Google Analytics” setting. Krypton WILL report to Google Analytics that analytics have been disabled, but will not report any future events until analytics have been re-enabled by toggling the same setting.

### How we use your information
We use your information to improve Krypton’s performance and quality. We use this information to learn which features are being used and how often. We also use this information to detect irregularities. This enables us to diagnose potential bugs, and determine which features to select for product updates.

We collect email addresses for the purpose of communicating new features, product updates, and company updates. We will never spam email addresses and provide users with a way to opt out.

## Krypton Teams
Your [team sigchain]({{ site.baseurl }}{% post_url 2018-02-23-team-sigchain %}) (team data) is hosted by krypt.co and is **ONLY** accessible by users you invite to your team. We never share your data with other parties. For audit logging, krypt.co only has access to **encrypted** audit logs. All audit logs are encrypted to each active team admin, using keys that only you and team admins have.

### Information we have access to:
- Team name
- Team members' email addresses
- Team members' SSH and PGP **public** keys
- Team member role (admin/regular)
- Auto-approval interval for your team
- Pinned SSH host-names and **public** keys
- Frequency of audit log creation

### Information we do NOT have access to:
- Team member private keys
- Team invitation secrets
- Audit log data:
    - SSH remote host names
    - SSH remote host public keys
    - SSH session ids
    - SSH User names
    - Git commits and tags
    - Computer names

## Contact
For inquiries about our privacy policy or other information, email support@krypt.co.
