---
layout: page
title: "My Public Key"
subtitle: "A guide for uploading your Krypton public key to your infrastructure."
category: start
order: 3
---

# Use Krypton with your development stack

Krypton and the `kr` CLI make it easy to get your public key on all of the servers and services you use. 
For example, one of the most common uses is to upload your SSH public key to GitHub:

```bash
$ kr github
```

> **Note**: first make sure you're [paired with your computer]({{ site.baseurl }}{% post_url 2017-08-20-pair %}).

## Print out your SSH public key
The simplest way to print out your public key is to simply run:
```bash
$ kr me
```

If you want to send it to someone, paste it on some server or website, use the convenient copy command:
```bash
$ kr copy
```

## Integrations
Run `kr` to see all the available commands. You'll see there's a comma seperated list of commands that provide support various services: AWS, Bitbucket, DigitalOcean, Google Cloud Platform, GitHub, GitHub Enterprise, and Heroku.

These commands will help you add your public key to this service. For example, to add your SSH public key to your heroku account, run:

```bash 
$ kr heroku
```

or to your Google Cloud Platform account, run:
```bash 
$ kr gcloud
```

In some cases, like Heroku, `kr` uses your local credentials to add your public key. In most other cases (like GitHub or DigitalOcean), `kr` will copy your public key to the clipboard and open your web browser to the right settings page for the service (like [https://github.com/settings/keys](https://github.com/settings/keys)) so you can paste your public key to save it to your account.

## Servers
To use Krypton with any SSH server that's already running, you'll need to add your Krypton public key to the `~/.ssh/authorized_keys` file on that server. The `kr add` command makes this easy.

```bash
$ kr add <user>@<server>
```

`<user>` is the user name for the account on `<server>`. 

> **Note**:`kr` uses your local SSH keys authenticate to the server/user account and then it runs the command to copy your Krypton public key to the corresponding `authorized_keys` file.
