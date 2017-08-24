---
layout: page
title: "Known Hosts"
category: ssh
date: 2017-08-24 11:50:23
---

# Known Hosts (Host Public Key Pinning)
The private key stored in Kryptonite authenticates _you_ to the _server_ using a digital signature. But this is only half of the `ssh` authentication protocol - the _server_ also has to authenticate itself to _you_. To do this, the server creates a digital signature with its own __private key__, and your `ssh` client verifies this signature using the server's __public key__. However, your `ssh` client first needs to know the server's public key to perform the verification.

## Trust on First Use (TOFU)
The first time you connected to a server, you probably saw a message like this:
```
$ ssh example.com
The authenticity of host 'example.com' can't be established.
ED25519 key fingerprint is SHA256:...
Are you sure you want to continue connecting (yes/no)?
```
which means that `ssh` doesn't know what public key corresponds to this server. When you respond __yes__, `ssh` _trusts_ the key presented by the server, hence the term _Trust on First Use_.

The next time you `ssh` to example.com, `ssh` will only continue if the server key matches the key stored in `~/.ssh/known_hosts`. If an adversary were to compromise your connection to the server, they would not be able to create a digital signature using the correct saved key pair and `ssh` would abort the connection.

However, if an adversary were to compromise your connection to