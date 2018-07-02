---
layout: page
title: "Threat Model (SSH)"
category: security
date: 2017-09-04 09:51:13
---
# Why Store an SSH Key with Krypton?
Storing your SSH keys locally, encrypted or not, poses the risk of the plaintext key falling into adversarial hands, __immediately compromising every server you have access to__.

With [Krypton](/), even the worst compromise is limited to only SSH logins explicitly authorized by you. At the core, phone operating systems are built with better sandboxing than their desktop counterparts. This is why security experts like Matt Green [recommend phones for your most sensitive data](https://blog.cryptographyengineering.com/2017/03/05/secure-computing-for-journalists/).

## Privilege Separation
> The problem with storing an SSH key on your laptop boils down to how privilege separation works on laptops (by user) versus on phones (by app).

Laptop operating systems (like macOS or Ubuntu) separate privileges based on user name. Most applications you run execute with the same user privileges, meaning the files created by one can be read by the others. Just open Activity Monitor or run `ps` to see all of the processes running with the same privileges as your user account.

On the contrary, phone operating systems (iOS & Android) separate privileges by individual application, meaning that files created by an application are only readable by that application. This separation is essential to Krypton’s storage of the SSH private key, which is safe from other applications that may be malicious.

## Threat Models
We will analyze SSH private key storage under two different threat models:
1. Passive Adversary: the disk contents of the computer may be read or uploaded (i.e. simple malware or accidental upload to GitHub).
2. Active Adversary: a process on the laptop can run arbitrary code (i.e. sophisticated malware, ransomware, or a malicious application).

For both of these threat models, we will consider storing an SSH key (1) locally in plaintext, (2) locally encrypted with a passphrase, and (3) with Krypton.

### Plaintext id_rsa
If a local key is stored unencrypted, the passive adversary simply uploads this key to a remote machine where __it may be used any number of times without the owner’s knowledge__. In this case, the passive adversary is powerful enough for a full compromise and the active adversary is irrelevant.

### Passphrase Encrypted id_rsa
If a local key is stored encrypted with a passphrase, the passive adversary may upload the encrypted key. The strength of the key is now reduced to the strength of the password, which will be subject to unhindered brute-force attacks. Once the password is cracked, __the key can be used without restriction and without the owner’s knowledge__.

An active adversary can easily use or learn the plaintext key after the first time you use it. When you first enter your password to decrypt a key, SSH checks if an SSH agent is running, and if so, SSH adds the plaintext key to the agent. The agent stores the plaintext key in memory and will gladly perform any number of authentications requested by any process. __An active adversary simply waits until the decrypted key is added to the agent and then uses the key freely__.

_If you have a passphrase encrypted key, you can see this for yourself:_
```bash
$ eval `ssh-agent` # make sure an empty agent is running
$ ssh user@server  # enter passphrase on first login
$ ssh user@server  # passphrase no longer needed
```

Alternatively, a malicious application may disguise itself as an SSH agent and __receive the key in plaintext the first time it’s decrypted.__

### Krypton
A passive adversary present on a computer paired with Kryponite may read only the computer’s _session_ keypair and Krypton’s _session_ public key. With the computer’s session credentials, the adversary may send valid login requests to Kryponite and read any response. However, it cannot read the data of other login requests which contain session ids of other SSH sessions (since these are encrypted to Krypton’s session public key). If the Krypton user receives an unknown request, the user can unpair the computer (rendering the compromised session credentials useless) and re-pair once the computer is re-provisioned. __Even if the user allows an adversary’s request, every authentication is stored in the Krypton audit log__, allowing more accurate incident response.

An active adversary on a Krypton-paired computer can hijack any approved SSH login by replacing the path to the local SSH binary with a malicious one, but cannot perform new logins of its own without Krypton user approval.

> With Krypton, each of these compromises require the user’s approval per `username@host`. For every asset that an adversary might try to access, a new malicious request must be approved by the user. Without Krypton, the above compromises result in __unauthorized access to all assets__ protected by the private key.

## The Bottom Line
Storing SSH keys locally, encrypted or not, poses the risk of the plaintext key falling into adversarial hands, __immediately compromising every server the key has access to.__

In the presence of both passive and active adversaries, Kryponite limits a compromise to only the logins authorized by you, all of which are stored in the audit log.

At krypt.co, we are constantly working to increase the security and control provided by Krypton. Check out our guides for [host key pinning](/docs/ssh/known-hosts.html) and [using a bastion host](/docs/ssh/using-a-bastion-host.html) for more ways to secure your infrastructure with Krypton.