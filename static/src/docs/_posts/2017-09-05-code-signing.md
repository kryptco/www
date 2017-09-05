---
layout: page
title: "PGP Code Signing"
category: start
order: 4
---

# PGP Signing Git Commits with Kryptonite
Kryptonite now supports PGP signing Git Commits and Tags (v2.2.0+). This means that Kryptonite now also generates and stores your PGP private key. This guide will go through setting up code signing for the first time.

> **Note**: First make sure you're [paired with your computer]({{ site.baseurl }}{% post_url 2017-08-20-pair %}).

## Getting Started
To enable code signing, run the following command on your paired computer

```bash
$ kr codesign
```

Next, test that everything works: 
```bash
$ export GPG_TTY=$(tty); kr codesign test
```

You should see a request show up on your phone, asking for your permission to sign a test commit.

Now everytime you do a `git commit` or a `git tag -s`, Kryptonite will ask you if it should PGP sign the commit/tag.

> The remainder of the post talks about configurations changes and other tips for PGP signing git commits with Kryptonite.

<hr>

## Adding your PGP Public Key to GitHub
GitHub is one of the few source code management services that supports verifying PGP signed Git Commits and Tags. To learn more about their feature, look at their [code signing blog post](https://github.com/blog/2144-gpg-signature-verification).

## Git Config & Bash Profile Additions
Enabling code signing with `kr` makes **two** additions to your global `git` config file, typically located at `~/.gitconfig`, and **one** addition to your bash profile.

### Git Config
```bash
[gpg]
	program = /usr/local/bin/krgpg

[commit]
	gpgSign = true
```

These config options specifies that Git should use the `krgpg` program when it is asked to sign commits and tags and it enables signing commits by default. If you want to disable this, `kr` provides a helpful command to toggle this setting:

```bash
$ kr codesign off # disable code signing by default
$ kr codesign on  # enable code signing by default
```

### Bash Profile
```bash
export GPG_TTY=$(tty)
```

This simply enables `git` to write outputs of the `krgpg` command to standard error, so you will be able to see status messages like:

```bash
Kryptonite ▶ Requesting git commit signature from phone
Kryptonite ▶ Phone approval required. Respond using the Kryptonite app
```

## View/Copy/Export your PGP Public Key
In general, every helper command specified in the ["My SSH public key" document]([paired with your computer]({{ site.baseurl }}{% post_url 2017-08-21-upload-your-ssh-publickey %}) works similarly for your PGP public key. 

Simply append `pgp` to the end of those commands. For example: 

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
