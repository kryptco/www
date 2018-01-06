---
layout: page
title: "Architecture"
category: security
order: 1
---

# The Krypton Security Architecture
Krypton provides the best of both worlds: the security of your private key never leaving your phone with the convenience of using SSH as you normally do, i.e: `ssh root@server.com` or `git push origin master`. 

A phone is a great place to store your private key as it is easier to provide isolation on your phone from malicious applications. If you’re curious why this is, read our blog post [*“Why Store an SSH Key With Krypton?”*](https://blog.krypt.co/why-store-an-ssh-key-with-kryptonite-9f24c1f983d5).

> Krypton is designed such that you do not have to trust us, krypt.co, to operate any third party service. You need only trust the code running on the Krypton phone app. 

>**The private key never leaves your phone.**

## System Components
Our system consists of three components: (1) the Krypton phone app for iOS and Android, (2) the `krd` daemon that runs in the background on a macOS or Linux computer, and (3) the `kr` command line utility that manages `krd`.

![The System Components: Krypton, kr, and krd]({{ site.url }}/static/dist/img/docs/system.png){:class="img-responsive"}


### Krypton
The Krypton phone app, referred to as “Krypton” in this post, generates and stores your private key on your phone and uses it to sign SSH login requests from a paired computer that is running `krd`. The private key never leaves the phone. If you are curious how the private key is stored on the phone read about it [here](https://krypt.co/docs/security/privacy-policy.html#private-key-storage).


### krd
`krd` acts as an SSH agent. During installation, a few lines are added to `~/.ssh/config` to point SSH to krd and offer your Krypton public key when connecting to servers. Every time you SSH, krd is responsible for communicating with the Krypton app, requesting a signature with the private key, and waiting for a response.


### kr
`kr` is the user interface to `krd`. The main functionality of kr is to initiate pairing the phone with the computer, discussed in the next section. `kr` also makes it easy to upload your public key to GitHub, AWS, Heroku, Google Cloud, and other services that store SSH public keys

<br>
## Cryptography Library
For the public-key cryptography primitives in the protocols discussed below, Krypton utilizes [**libsodium**](https://download.libsodium.org/doc/). The `encrypt_and_sign` primitive corresponds to libsodium’s [Authenticated Encryption algorithms](https://download.libsodium.org/doc/public-key_cryptography/authenticated_encryption.html) and the `encrypt` primitive corresponds to libsodium’s [Sealed Boxes algorithms](https://download.libsodium.org/doc/public-key_cryptography/sealed_boxes.html).
<br>

### The Pairing Protocol
Pairing establishes an authenticated and encrypted communication channel over an untrusted medium.
When `krd` asks Krypton to perform a signature with your SSH private key, this request must be (1) authenticated to ensure that it is coming from an authorized computer and (2) encrypted as it contains sensitive data including the SSH session id.

We use 3 *untrusted* communication channels to communicate between your phone and computer: Bluetooth, [AWS SQS](https://aws.amazon.com/sqs/), and [AWS SNS](https://aws.amazon.com/sns). AWS SNS is a service for delivering push notifications; it utilizes APNS (iOS) and Firebase (Android) which are both untrusted. For the rest of this post, you can assume all messages are sent simultaneously on all channels unless otherwise noted.

The pairing protocol between a computer running krd and the Krypton app is as follows:

![The pairing protocol]({{ site.url }}/static/dist/img/docs/d1.png){:class="img-responsive"}

The protocol is initated on the computer when the user runs the following command.

```bash
$ kr pair
```

Next, `krd` generates a new key pair for this pairing: `c_pub_key`, `c_priv_key`. krd then displays `c_pub_key` in a QR code in the terminal as shown below.

![A QR code appears in the terminal, the user scans it with the Krypton app]({{ site.url }}/static/dist/img/docs/qr_pair.png){:class="img-responsive"}


### (1) Bootstrapping a secure pairing
Krypton obtains `c_pub_key`, represented as *step (1)* in the diagram above, by scanning the QR code with the in-app camera. Scanning the QR code is the only communication channel assumed to be free of tampering. We assume the data in the QR code is transmitted to the phone untampered, but not necessarily secretly. The adversary seeing the QR code is not a threat as it only contains public information. Communication between kr and Krypton is always encrypted and signed using krd and Krypton’s session key pairs to create a fully trusted channel.


### (2) Sending Krypton’s session public key
Upon receiving `c_pub_key`, Krypton generates its own session key pair denoted `s_pub_key`, `s_priv_key`.
Next, Krypton sends its session public key encrypted with krd’s public key, denoted as *step (2)* in the diagram above, to krd. This tells the computer that a Krypton client has scanned the QR code and wants to initiate a pairing.

`s_pub_key` is encrypted under `c_pub_key` to prevent an active adversary from switching out `s_pub_key` to another public key. An adversary would have to know `c_pub_key` to be able to insert its own public key. This creates a race: `krd` only remembers and responds to the first Krypton client to send the message in *step (2)*. The next step allows Krypton to confirm that krd paired with it and not any other client.


### (3) The “Me Request”
Upon receiving `s_pub_key`, `krd` can now send encrypted requests to Krypton. Krypton can verify these requests with `c_pub_key` from *step (1)*. To acknowledge receipt of `s_pub_key`, krd sends the encrypted and signed “me request,” asking Krypton for its SSH identity (*step (3)* in the diagram above). If some other client completes *step (2)* first, Krypton will timeout while waiting to receive a “me request.” In the case of a timeout, the user runs kr pair to try again with new session keys.


### (4) The “Me Response” (`id_kryptonite.pub`)
Upon receiving the “me request,” Krypton sends the final pairing message, shown in *step (4)*. The “me response” contains the Krypton SSH public key as well as a push token identifier so it can be reached via AWS SNS. This message serves as a pairing confirmation acknowledgement for `krd`.

> `krd` is now succesfully paired with Krypton.

<hr>

## Signature Request Protocol
`krd` forwards login requests from SSH to Krypton. Krypton then signs the request if it is approved.

The signature request protocol works as follows:
![The signature request protocol]({{ site.url }}/static/dist/img/docs/d2.png){:class="img-responsive"}

This protocol is initiated when the user runs a command on their computer such as:

```bash
$ ssh alex@me.krypt.co
```

![Step 2 Approval notification for host_auth data shown to user]({{ site.url }}/static/dist/img/docs/ssh_mekryptco.png){:class="img-responsive"}

 
1. First, `krd` is invoked by SSH and receives the `ssh_session_id`, `host`, and `user`. `krd` packages these items, along with a random `request_id` and the current time `unix_seconds`, into a `sign_request`. As *step (1)* shows, `krd` encrypts and signs `sign_request` and sends it to Krypton.

2. Upon receiving `sign_request`, Krypton shows the user an approval notification (see image below) containing the login information as shown in *step (2)*.

3. The user’s response to the request is recorded as shown in *step (3)*. If it is rejected, Krypton simply makes `sign_response` a rejection constant. If approved, Krypton performs a signature of the `session_id` and `user` with the Krypton SSH private key (denoted `id_kryptonite`). This signature is the `sign_response`.

4. As shown in *step (4)*, `sign_response` is encrypted and signed and sent back to `krd`. Upon receipt of the `sign_response`, if `krd` receives a rejection, it instructs SSH to fall back to local keys. If `krd` receives a signature, it returns the signature to the SSH client to complete the authentication.

> The user has now succesfully SSH’ed into the remote host.

<hr>
*Note: the formal white paper on our protocols will be available shortly*


