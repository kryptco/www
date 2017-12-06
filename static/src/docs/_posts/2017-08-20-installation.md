---
layout: page
title: "Install"
category: start
order: 1
---

# Install Kryptonite + kr

## Kryptonite app
Go to [https://get.krypt.co](https://get.krypt.co) on your iOS or Android device and you will be redirected to the Kryptonite app download page on the Apple App Store (iOS) or the Google Play Store (Android).

## Kr cli
The easiest way to install `kr` on any supported machine is the following: 

```bash
$ curl https://krypt.co/kr | sh
``` 
You can check out the source or download the script locally with `curl https://krypt.co/kr > kr` and inspect it

> **Note:** The rest of this document describes the what the install script does and how to manually install `kr` from source.
<hr>

## What's inside the install script?
Below is an explanation of what the install script does on each supported platform. 

### macOS
- Download the correct homebrew bottle from GitHub and verify its hash
- Untar and install `kr`, `krd`, `kr-pkcs11.so`, and `krssh` binaries
- Backup and append to your ~/.ssh/config to point to `krd`

Equivalent command:
```bash
$ brew install kryptco/tap/kr 
```

### Debian Linux (Ubuntu, Kali)
- Install necessary software for adding new repository: `software-properties-common`, `dirmngr`, `apt-transport-https`
- Add krypt.co's binary signing key from the Ubuntu keyserver (fingerprint `C4A05888A1C4FA02E1566F859F2A29A569653940`)
- Add krypt.co's apt repository hosted at `kryptco.github.io/deb`
- run `apt-get install kr`
    
Equivalent commands:
```bash
$ sudo apt-get install software-properties-common dirmngr apt-transport-https -y 
$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C4A05888A1C4FA02E1566F859F2A29A569653940 
$ sudo add-apt-repository "deb http://kryptco.github.io/deb kryptco main" # non-Kali Linux only 
$ sudo printf "deb http://kryptco.github.io/deb kryptco main" >> /etc/apt/sources.list # Kali Linux only 
$ sudo apt-get update 
$ sudo apt-get install kr -y 
```

### RPM Linux (RedHat, CentOS, Fedora)
- Add krypt.co's binary signing key from the MIT keyserver (fingerprint `C4A05888A1C4FA02E1566F859F2A29A569653940`)
- Add krypt.co's yum repository hosted at `kryptco.github.io/yum`
- Run `yum install kr`

Equivalent commands:
```bash
$ gpg --keyserver=hkp://pgp.mit.edu:80 --recv-keys "C4A05888A1C4FA02E1566F859F2A29A569653940" 
$ gpg --export --armor C4A05888A1C4FA02E1566F859F2A29A569653940 > /tmp/kryptco.key 
$ sudo rpm --import /tmp/kryptco.key 
$ sudo yum-config-manager --add-repo https://kryptco.github.io/yum # non-fedora only 
$ sudo yum config-manager --add-repo https://kryptco.github.io/yum # fedora only 
$ sudo yum install kr -y 
```

## Installing from source

### macOS
*Golang & Rust are automatically installed by `brew`*
```bash
$ brew install --HEAD kryptco/tap/kr
```

### linux
Dependencies:
- [Install Go 1.8+](https://golang.org/doc/install)
- [Install Rust 1.15+ and cargo](https://www.rustup.rs/)

```bash
$ export GOPATH=${GOPATH:-$PWD}
$ go get github.com/kryptco/kr
$ cd $GOPATH/src/github.com/kryptco/kr && make install && kr restart
```

## How Kr interfaces with SSH
`kr` automatically adds the following to your `~/.ssh/config` file:

```bash
# Added by Kryptonite 
Host * 
    PKCS11Provider /usr/local/lib/kr-pkcs11.so 
    ProxyCommand /usr/local/bin/krssh %h %p 
    IdentityFile ~/.ssh/id_kryptonite 
    IdentityFile ~/.ssh/id_ed25519 
    IdentityFile ~/.ssh/id_rsa 
    IdentityFile ~/.ssh/id_ecdsa 
    IdentityFile ~/.ssh/id_dsa 
```

- Kryptonite's PKCS11Provider directs SSH to `krd` as an SSH agent by setting the `SSH_AUTH_SOCK` environment variable. It also links `~/.kr/original-agent.sock` to any already-running SSH agent. This allows krd to fallback to the original agent if necessary.

- The krssh ProxyCommand detects which host is being connected to and reads the signature returned from the remote server. These are transmitted to krd and eventually verified by the Kryptonite phone app.

- The IdentityFile options make sure that the Kryptonite public key is presented to servers when trying to log in, as well as any default-named SSH keys users already have.
