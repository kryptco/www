---
layout: page
title: Key Transfer
category: start
order: 5
---

# Transferring Authority to a new Krypton phone
So you just got a new phone and you want to use Krypton on it but your private key pair is on your old phone. While it would be convenient if Krypton allowed you to *transfer* your private key to the new device, in Krypton the private key *never* leaves your phone. It is a big security risk to allow the private key to leave the device and in some cases not even possible due to a hardware-secured private key (iOS and Android's respective Secure Enclaves or Crypto-Coprocessors).

Fear not though, `kr transfer` is a utility to solve this exact problem. This makes switching devices or creating a [backup device]({{ site.baseurl }}{% post_url 2017-11-21-backup %}) a breeze.

Krypton achieves this not by transferring *keys* but by transferring *authority*. That is, `kr` talks to Krypton to learn all the `user@host`'s you've previously accessed. `kr` will use your **old** Krypton device to authenticate to each `user@host` and then programmatically add your **new** Krypton public key to the `authorized_keys` file on the server, thereby authorizing the new public-key using the old key pair.

> Note: `kr transfer` will also help you add your `SSH` and `PGP` public keys to services like GitHub, BitBucket, GitLab, etc.

## `kr transfer`
Simply run the following command to get started: 

```bash
$ kr transfer # use -d to do a dry-run
```

> Note: This command does **not** remove your old Krypton public key from servers.

### Tutorial
1. First you will be asked to pair (perhaps re-pair if you're already paired) with your **OLD** Krypton device

2. Next, `kr` will request a host list from Krypton (containing usernames and hostnames of servers you've accessed with Krypton). Tap allow on Krypton to continue.

3. `kr` will then show you a summary of `user@host`'s and other detected web services like GitHub. For example:

    ```bash
    === SUMMARY ===

    Hosts to transfer authority to
    - root @ server.com
    - ubuntu @ abc-efg.compute-1.amazonaws.com
    - root @ personalserver.com

    Additional actions
    - Upload SSH public-key to github.com
    - Upload SSH public-key to bitbucket.org
    - Upload PGP public key to GitHub user ids (emails):
        Alex Grinman <hello@alexgr.in>
        Alex Grinman <hello@krypt.co>

    === END OF SUMMARY ===
    ```
4. Hit `y` to Continue. 
5. `kr` will now ask you to pair with your **NEW** Krypton device
6. For each of the entries in the summary above, `kr` will ask you if you'd like to authorize the new Krypton public key to have access to the `user@host`. Hit `y` to authorize. For example,
```bash
Authorize access to: ubuntu @ abc-efg.compute-1.amazonaws.com? [y/N] 
```
7. After all the `user@host`'s are done, `kr` will redirect you to services you use like GitHub and BitBucket to add your new Krypton SSH public key.
8. For Git commit/tag signing, `kr` will first ask you to confirm the user-id's (name + emails) to associate with the new key. Then `kr` will redirect you to services like GitHub to add your newly minted PGP public key.

After `kr` finishes, you're ready to go: `kr` will already be paired with your new Krypton device.