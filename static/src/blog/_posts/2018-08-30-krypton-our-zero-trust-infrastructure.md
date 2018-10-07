---
layout: page
title: "Our Zero-Trust Infrastructure"
subtitle: "Krypton's browser-to-phone communication protocol is end-to-end verified with keys that only your devices have. Read about how Krypton's pairing protocol bootstraps a zero-trust infrastructure." 
category: posts
when: "August 30th, 2018"
image: "blog/system-components.png"
date: 2018-08-30 16:30:00
---

Krypton is an app that turns your phone into a [U2F Authenticator]({{ site.baseurl }}{% post_url 2018-06-22-krypton-now-supports-universal-2nd-factor-u2f %}). 

Unlike most U2F authenticators that are standalone hardware fobs that you can plug into your computer via USB, Krypton provides the convenience of completely wireless, zero-friction use: you get a push notification that requests your approval to sign-in. 

To achieve this user experience, Krypton has a companion browser extension that you install in Chrome, Firefox, Safari or Edge (coming soon). This extension securely communicates registration and authentication requests from the web page to your phone. Upon your approval, the phone communicates back the cryptographic signature required to sign you in.

In this post we dive into the details of how the Krypton app pairs your phone to your browser to guarantee secure communication.

![The Krypton app and the Browser extension]({{ site.url }}/static/dist/img/blog/system-components.png){:class="img-responsive"}

## Krypton phone app
The Krypton phone app, referred to as “Krypton” in this post, generates and stores your private U2F key pairs on the [secure hardware](https://krypt.co/docs/security/privacy-policy.html#private-key-storage) on your iOS or Android phone (where available) and uses it to sign U2F authentication and registration challenges. The private key never leaves the phone.

## Browser extension
The browser extension is responsible for carrying out the U2F protocol with the web page you're on and most importantly, securely communicating the origin of the page you're on (the domain) to the Krypton app. The browser extension forwards U2F signing requests to the Krypton app on your phone which, upon approval, returns the signature back to the web page for authentication.

## Communicating over an Untrusted Channels
Pairing establishes an authenticated and encrypted communication channel over an **untrusted** medium.

When the extension asks Krypton for a signature, this request must be (1) authenticated to ensure that it is coming from an authorized browser and (2) encrypted to hide sensitive data like where you are authenticating and the actual U2F signature.

The browser extension uses several *untrusted* communication channels to talk to the Krypton app on your phone: 
- [AWS SQS](https://aws.amazon.com/sqs/)
- [AWS SNS](https://aws.amazon.com/sns)
- Bluetooth (coming soon)

AWS SNS is a service for delivering push notifications, utilizing APNS (iOS) and Firebase (Android) under the hood. The extension embeds underling encrypted, authenticated Krypton requests inside these push notifications. Authentication request messages are sent simultaneously on all channels to maximize performance.

## Pairing Protocol
![Browser Pairing]({{ site.url }}/static/dist/img/blog/browser-pairing.png){:class="img-responsive"}

First, the user initiates pairing on the browser extension. The extension generates a new key pair for this new pairing and displays the public key in a QR code. The user scans the extension's QR code with the Krypton app.

<br/>
![Krypton Pairing Protocol]({{ site.url }}/static/dist/img/blog/pairing-proto.png){:class="img-responsive"}
<br/>

### 1: Getting the extension's session public key
- The Krypton app obtains `c_pub_key` by scanning the QR code with the in-app camera (*step (1) above*)

> Scanning the QR code is the only communication mechanism assumed to be free of tampering. The QR code is **NOT** assumed to be confidential, it only contains a public key.

### 2: Sending Krypton’s session public key
- Krypton generates a new key pair for use with this new browser-to-phone pairing: `s_pub_key`, `s_priv_key`.
- Next, Krypton sends its session public key encrypted to the extension's public key (*step (2) above*)
- This message acts as an indicator to the extension that a Krypton phone client has scanned the QR code and wants to initiate a pairing

> `s_pub_key` is encrypted under `c_pub_key` to prevent an active adversary from switching out `s_pub_key` to another public key. An adversary would have to know `c_pub_key` to be able to insert its own public key. This creates a race: the extension only remembers and responds to the first Krypton client to send the message in *step (2)*. The next step allows Krypton to confirm that the browser extension paired with it and not any other client.


### 3: extension_hello
- The extension receives the Krypton app's public key `s_pub_key` which it can now use to encrypt messages to the Krypton app
- The extension signs messages with it's session key `c_priv_key`, Krypton can verify these requests with `c_pub_key` from *step (1)*
- The extension then sends an *encrypted and signed* `extension_hello` request to acknowledge receipt of `s_pub_key` and ask the Krypton app to confirm the pairing (*step (3)* above). 

> If some other client completes *step (2)* first, Krypton will timeout while waiting to receive a `extension_hello`. In the case of a timeout, the user would be told to try again. They would pair again by re-initiating the pairing process which would cause both the app and the extension to generate new session key pairs.


### 4: krypton_hello
- Upon receipt of `extension_hello`, the Krypton app sends the final pairing message (*step (4)*): `krypton_hello` 
- `krypton_hello` contains various information about the phone such as:
    - user-friendly device name, 
    - push token identifier so the phone can be reached via APNS/Firebase notificiation
- `krypton_hello` is acknowledgment to the extension that pairing is successful

> The browser extension is now paired to the Krypton phone app. Key pairs have been established, that only the extension and Krypton app know and public keys securely shared for encrypted, authenticated communication.

## Secure Communication Protocol
When the user navigates to a page that requests a U2F operation, the following protocol is initiated by the browser extension.

<br/>
<br/>
![]({{ site.url }}/static/dist/img/blog/communication-proto.png){:class="img-responsive"}
<br/>

1. The request body is the U2F protocol request and includes the challenge data that needs to be signed as well as any additional meta-data needed by Krypton like the application id (website origin). The extension packs these items, along with a random `request_id` and the current time `unix_seconds`, into a `sign_request` that is encrypted and signed, and sends it to the Krypton app.

2. Upon receiving `sign_request`, the Krypton app asks the user for their approval (if needed). The approval request `body` tells the user which web site is requesting this authentication.

3. If the user rejects, the Krypton app simply sets `sign_response` to a rejection constant. If the user approves, Krypton performs a signature using the data in the `body` per the U2F protocol specification.

4. As shown in *step (4)*, `sign_response` is encrypted and signed and sent back to the extension. Upon receipt of the `sign_response`, if the browser extension receives a signature, it passes it back to the authentication hook to complete the login.

> Note that for some user-set policies, requests can be auto-approved to require user interaction.

### U2F Registration `body`
The extension forwards U2F registration protocol request challenge data from the web page to the Krypton app inside the `body` field above. If the user approves the request, Krypton generates a new NIST-P256 U2F key pair and returns the U2F public key along with the signed challenge to the extension.

### U2F Authentication `body`
The extension forwards U2F authentication protocol request challenge data from the web page to the Krypton app inside the `body` field above. If the user approves the request, Krypton loads the corresponding U2F key pair and uses the key to create a signature to return in its response to the extension.


## Cryptographic Libraries
For the public-key cryptography primitives in the protocols discussed above, Krypton utilizes [**libsodium**](https://download.libsodium.org/doc/). The `encrypt_and_sign` primitive corresponds to libsodium’s [Authenticated Encryption algorithms](https://download.libsodium.org/doc/public-key_cryptography/authenticated_encryption.html) and the `encrypt` primitive corresponds to libsodium’s [Sealed Boxes algorithms](https://download.libsodium.org/doc/public-key_cryptography/sealed_boxes.html).
<br>
