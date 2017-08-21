---
layout: page
title: "Architecture"
category: security
---

### The Kryptonite Security Architecture
Kryptonite provides the best of both worlds: the security of your private key never leaving your phone with the convenience of using SSH as you normally do, i.e: `ssh root@server.com` or `git push origin master`. 

A phone is a great place to store your private key as it is easier to provide isolation on your phone from malicious applications. If you’re curious why this is, read our blog post [*“Why Store an SSH Key With Kryptonite?”*](https://blog.krypt.co/why-store-an-ssh-key-with-kryptonite-9f24c1f983d5).

> Kryptonite is designed such that you do not have to trust us, krypt.co, to operate any third party service. You need only trust the code running on the Kryptonite phone app. **The private key never leaves your phone.**

#### System Components
Our system consists of three components: (1) the Kryptonite phone app for iOS and Android, (2) the `krd` daemon that runs in the background on a macOS or Linux computer, and (3) the `kr` command line utility that manages `krd`.

![The System Components: Kryptonite, kr, and krd]({{ site.url }}/static/dist/img/docs/system.png){:class="img-responsive"}


##### Kryptonite
The Kryptonite phone app, referred to as “Kryptonite” in this post, generates and stores your private key on your phone and uses it to sign SSH login requests from a paired computer that is running `krd`. The private key never leaves the phone. If you are curious how the private key is stored on the phone read about it here.

##### krd
`krd` acts as an SSH agent. During installation, a few lines are added to `~/.ssh/config` to point SSH to krd and offer your Kryptonite public key when connecting to servers. Every time you SSH, krd is responsible for communicating with the Kryptonite app, requesting a signature with the private key, and waiting for a response.

##### kr
`kr` is the user interface to `krd`. The main functionality of kr is to initiate pairing the phone with the computer, discussed in the next section. `kr` also makes it easy to upload your public key to GitHub, AWS, Heroku, Google Cloud, and other services that store SSH public keys

#### Cryptography Library
For the public-key cryptography primitives in the protocols discussed below, Kryptonite utilizes [**libsodium**](https://download.libsodium.org/doc/). The `encrypt_and_sign` primitive corresponds to libsodium’s [Authenticated Encryption algorithms](https://download.libsodium.org/doc/public-key_cryptography/authenticated_encryption.html) and the `encrypt` primitive corresponds to libsodium’s [Sealed Boxes algorithms](https://download.libsodium.org/doc/public-key_cryptography/sealed_boxes.html).

#### The Pairing Protocol
Pairing establishes an authenticated and encrypted communication channel over an untrusted medium.
When `krd` asks Kryptonite to perform a signature with your SSH private key, this request must be (1) authenticated to ensure that it is coming from an authorized computer and (2) encrypted as it contains sensitive data including the SSH session id.

We use 3 *untrusted* communication channels to communicate between your phone and computer: Bluetooth, [AWS SQS](https://aws.amazon.com/sqs/), and [AWS SNS](https://aws.amazon.com/sns). AWS SNS is a service for delivering push notifications; it utilizes APNS (iOS) and Firebase (Android) which are both untrusted. For the rest of this post, you can assume all messages are sent simultaneously on all channels unless otherwise noted.

The pairing protocol between a computer running krd and the Kryptonite app is as follows:

![The pairing protocol]({{ site.url }}/static/dist/img/docs/d1.png){:class="img-responsive"}
