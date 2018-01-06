---
layout: page
title: "Known Hosts"
category: ssh
date: 2017-08-24 11:50:23
order: 1
---

# Known Hosts (Host Public Key Pinning)
The private key stored in Krypton authenticates _you_ to the _server_ using a digital signature. But this is only half of the `ssh` authentication protocol - the _server_ also has to authenticate itself to _you_. To do this, the server creates a digital signature with its own __private key__, and your `ssh` client verifies this signature using the server's __public key__. However, your `ssh` client first needs to know the server's public key to perform the verification.

## Trust on First Use (TOFU)
The first time you connected to a server, you probably saw a message like this:
```
$ ssh example.com
The authenticity of host 'example.com' can't be established.
ED25519 key fingerprint is SHA256:...
Are you sure you want to continue connecting (yes/no)?
```
which means that `ssh` does not know what public key this server is supposed to authenticate with. When you respond __yes__, `ssh` _trusts_, or pins, the key presented by the server, hence the term _Trust on First Use_.

The next time you `ssh` to example.com, `ssh` will only continue if the server key is the same (stored in `~/.ssh/known_hosts`). If an adversary were to compromise your connection to the server, they would not be able to create a digital signature using the correct saved key pair and `ssh` would abort the connection.

However, if an adversary were to compromise your connection the first time you connected to `github.com`, for example, they would present their own key pair and you would likely type __yes__ and trust it. A single `git push` would then send the entire private repository right to the adversary.

## Krypton Stores Known Hosts
If you use multiple machines or a new computer, `ssh` will re-prompt you to trust the key presented for each machine and each server, giving an adversary more opportunities to compromise your connection and present a different key pair. Krypton solves this problem by storing a known hosts list of public keys.

When you connect to a server, `ssh` verifies the digital signature presented by the server. If you are using Krypton, `ssh` sends the signature to Krypton where it is also verified using the same TOFU policy.

![You can view all known hosts from the Krypton settings screen.]({{ site.url }}/static/dist/img/docs/edit_host_keys.png){:class="img-responsive img-phone"}
*You can view all known hosts from the Krypton settings screen.*

## Host Key Mismatch
The same list of known hosts is used for all of your devices paired with Krypton. If one paired device sends a signature from a different host public key, Krypton automatically rejects the login request.
![A login request with an incorrect host public key will automatically be rejected]({{ site.url }}/static/dist/img/docs/reject_mismatched_host_key.png){:class="img-responsive img-phone"}
*A login request with an incorrect host public key will automatically be rejected.*

Sometimes the public key of a server legitimately changes, for example when switching which server a DNS name points to. When this happens, the old key must be removed from `~/.ssh/known_hosts` and Krypton's pinned host key list. 

![When a host key has legitimately changed, delete the pinned key from the known hosts screen accessible from the settings page.]({{ site.url }}/static/dist/img/docs/delete_host_key.png){:class="img-responsive img-phone"}
*When a host key has legitimately changed, delete the pinned key from the known hosts screen accessible from the settings page.*

 A future version of Krypton will support updating a server's public key in one command.

## Test Known Host Key Pinning
You can test known host key pinning using the server `pintest.krypt.co`. This server generates a new host key for every request. The first time you connect to the server, Krypton will pin the public key. Any subsequent requests will fail due to a different public key being presented, until you delete the known host entry for `pintest.krypt.co`. Try it out by running `ssh` without local host key pinning:
```bash
$ ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no pintest.krypt.co
```

## Unknown Host
If a Krypton request shows `user @ uknown host`, it means that Krypton could not verify the server's signature. The most likely cause  is that a signature was not included with the login request. This may be because the software integrating with SSH uses `libssh` instead of invoking `ssh` directly.

## Beyond TOFU
Storing known host public keys with Krypton is just the beginning. Krypton Command will allow team admins to set and update trusted host public keys for their entire team, preventing new employees from seeing warnings from `ssh` and being vulnerable to adversaries presenting incorrect public keys.