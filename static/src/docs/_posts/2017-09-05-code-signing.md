---
layout: page
title: "PGP Code Signing"
category: start
order: 4
---

# PGP Signing Git Commits with Krypton
Krypton now supports PGP signing Git Commits and Tags (v2.2.0+). This means that Krypton now also generates and stores your PGP private key. This guide will go through setting up code signing for the first time.

> **Note**: first make sure you're [paired with your computer]({{ site.baseurl }}{% post_url 2017-08-20-pair %}).

## Getting Started
To enable code signing, run the following command on your paired computer

```bash
$ kr codesign
```

Follow the instructions to add your PGP public key to GitHub.

Next, test that everything works: 
```bash
$ export GPG_TTY=$(tty); kr codesign test
```

You should see a request show up on your phone, asking for your permission to sign a test commit.

Now everytime you do a `git commit` or a `git tag -s`, Krypton will ask you if it should PGP sign the commit/tag.

> The remainder of the post talks about configurations changes and other tips for PGP signing git commits with Krypton.

<hr>

## GitHub + PGP
GitHub is one of the few source code management services that supports verifying PGP signed Git Commits and Tags. Learn more about this feature on their [code signing blog post](https://github.com/blog/2144-gpg-signature-verification).

## Git Config & Bash Profile Additions
Enabling code signing with `kr` makes **two** additions to your global `gitconfig` file, typically located at `~/.gitconfig`, and **one** addition to your bash profile.

### Git Config
```
[gpg]
    program = /usr/local/bin/krgpg

[commit]
    gpgSign = true
```

These config options specify that Git should use the `krgpg` program when it is asked to sign commits and tags and enable signing commits by default. If you want to disable this, `kr` provides a helpful command to toggle this setting:

```bash
$ kr codesign off # disable code signing by default
$ kr codesign on  # enable code signing by default
```

### Bash Profile
```bash
export GPG_TTY=$(tty)
```

This enables `git` to write outputs of the `krgpg` command to standard error, so you will be able to see status messages like:

```bash
Krypton ▶ Requesting git commit signature from phone
Krypton ▶ Phone approval required. Respond using the Krypton app
```

## View/Copy/Export your PGP Public Key
In general, every helper command specified [here]({{ site.baseurl }}{% post_url 2017-08-21-upload-your-ssh-publickey %}) works for your PGP public key as well. 

To do the PGP version, append `pgp` to the end of those commands. For example: 

```bash
$ kr copy pgp # copies your PGP public key to the clipboard
$ kr me pgp # prints out your PGP public key
$ kr github pgp # copies your PGP public key to the clipboard and navigates you to add it to your GitHub account
```

## Verify a signed commit
If you have [GPG Tools](https://gpgtools.org) installed, you can also start verifying commits. To test that your commits verify, run the following command.

```bash
$ git log --show-signature
```
