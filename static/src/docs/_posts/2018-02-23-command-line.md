---
layout: page
title: "Teams CLI"
category: teams
order: 4
---

# The `kr` `team` Command Line Tool
Krypton Teams is built to seamlessly integrate into your existing infrastructure.

For example, the following commands give `alice@acme.co` `ssh` access to `staging.acme.co`:
```console
$ kr team members --ssh --email alice@acme.co | kr add staging.acme.co
```

The `kr add` helper command is useful, but you can also plug the `kr team
members --ssh` command into any custom provisioning script you might have.

The `kr team` commands provide a programmatic interface to:
1. **Public key infrastructure for team `ssh` and `pgp` keys, and server `ssh` public keys**
2. **Reading and writing of team settings and policies**
3. **Streaming team member audit logs**

Example use cases:
 - Provision/de-provision server access for new/departing team members.
 - Pin `ssh` known host public keys of all of your EC2 instances for the entire team.
 - Continuously dump team audit logs into a threat analysis tool/PagerDuty/your favorite log analysis tool.


> **Note**: `kr` can be installed on most linux and macOS distros,
> which means that all of these features can easily be integrated with your existing services.

*The remainder of this article will walk through some of the most common `kr team` commands.*

## Contents

1. [Team Members (PKI)](#kr-team-members)
2. [Pinning SSH Known Hosts](#kr-team-hosts)
3. [Team policies and settings](#team-policies-and-settings)
    - [Changing the auto-approval window](#kr-team-policy)
    - [Removing team members](#kr-team-remove)
    - [Inviting team members](#kr-team-inivte)
    - [Promoting/demoting members](#kr-team-admin)
4. [Viewing Audit Logs](#kr-team-logs)

## Features
Every change to your team requires *authentication*.

However in Krypton, there are no passwords.  All authentication is based on
public-key cryptography where the the private keys live on individual team
members' Krypton devices and **the private-keys never leave the device**.

When using the `kr team` command line tool, much like when `ssh`-ing to a server or signing a `git` commit,
`kr` will push a notification to your phone and ask your permission to perform this team action.
Upon your approval, Krypton will use its private key locally on the phone to create a signature that will then be returned back to `kr`.

Every time you run a `kr team` command, `kr` fetches new team data blocks to ensure that you have an up-to-date view on the *entire* state of the team.

### `kr team members`
This teams command can help with all of your developer PKI needs.

By default, the `kr team members` command prints out all of your active team members (by email). For example,

```console
$ kr team members
Team has 3 member(s):

1. alice@acme.co
2. bob@acme.co
3. charlie@acme.co
...
```

By adding a `--ssh` or `--pgp` flag you can extract those respective key types:
```console
$ kr team members --ssh
Team has 3 members
Printing SSH Keys:

1. alice@acme.co
ssh-rsa AAAAC3NzaC1lZDI1NTE5AAAAIKf8MBtmVow9bqAw0c9ibkDuxDm598J6D1WYbQQ/Jtza

2. bob@acme.co
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBLo4wC4GlR13dEPYcQwe+xLYo6SRW1x1bOCx5LoYZG6

3. charlie@acme.co
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBLo4wC4GsDFDdfs42dfs+xLYo6SRW1x1bOCx5LoYZG6
...
```
> **Note**: Only the actual key material is printed to `stdout`.
> The remainder is printed to `stderr`, so you can safely **pipe** or **call** this command into/from another script.

You can also pull out a specific user by adding an email flag, `--email` or `-e`:

```console
$ kr team members --ssh -e charlie@acme.co
Found team member with email charlie@acme.co
Printing SSH Keys:

1. charlie@acme.co
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBLo4wC4GsDFDdfs42dfs+xLYo6SRW1x1bOCx5LoYZG6
```
> **Note**: Email **uniqueness** on a Krypton Team is always enforced, so you can safely use the above command to extract a single member's public keys.

### `kr team hosts`
One of the more advanced features of Krypton Teams is synchronization of the `ssh` server public keys in your infrastructure to your team members.

When you `ssh` to a host for the first time, your `ssh` client always asks:

```
The authenticity of host 'github.com' can't be established.
RSA key fingerprint is SHA256:Ytr7k4Sp49KGVF3L2yQT5nNYs5Ec9dWAyyOv9rsn+ek.
Are you sure you want to continue connecting (yes/no)?
```

Before Krypton Teams, there was no easy way for developers to know if this was
the right `github.com` public key fingerprint, so most developers had no choice
but to just type `yes`.  Each time this happens is an opportunity for the
connection to be intercepted, causing code, data, or commands to be sent to an
attacker instead of the intended destination.

#### `pin`
The `kr team` command line tool makes it easy to distribute pinned `ssh` known hosts (the mapping of server to `ssh` public key) to all of your team members.

For example, to pin your GitHub Enterprise instance's `ssh` public key, `ghe.acme.co`, run:

```sh
$ kr team hosts pin --host ghe.acme.co
```

In this case, `kr` will automatically grab the `ssh` public key from your local known hosts file in `~/.ssh/known_hosts`.

##### `--public-key`
To supply the public key explicitly, add the `--public-key` and append the public key string (omitting the `ssh-rsa` prefix).

##### `--update-from-server`
Alternatively, supplying the `--update-from-server` flag, will instruct `kr` to log into the server and explicitly read all of the server's host `ssh` public keys.

##### Script it
The `kr team hosts pin` command also supports **stdin**. These means you can easily stick this command into a script that, for example, spins up a new server on Amazon EC2.

When a server is brought up for the first time, every developer that connects to it will
a) need to get the hostname from somewhere and
b) will end up performing a *trust-on-first-use* action (by answering `yes` to the "Are you sure you want to continue connecting" above).

By **pinning** this host's public keys with Krypton right when the server is
booted up, your team members will not only have instant knowledge of this host,
but they will also not need to trust it on first use. When they connect to
the host for the first time, **Krypton will already know and verify the host's
`ssh` public key**.

> **Note**: Krypton automatically **rejects** `ssh` authentication requests for hosts whose public key does not match what's pinned,
> so you can rest assured your team members are now protected from man-in-the-middle attacks.

#### `unpin`
Sometimes hosts get rebooted and generate new host `ssh` public keys.
This will result in your developers getting this ugly message when they try to authenticate to that server:

```console
$ ssh pintest.krypt.co
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle attack)!
It is also possible that a host key has just been changed.
The fingerprint for the RSA key sent by the remote host is
SHA256:JzUyLwKluQdupEoqByvXQqQg5+hRRUhgTXpOBlhnSzQ.
Please contact your system administrator.
Offending RSA key in /Users/alice/.ssh/known_hosts:3
RSA host key for pintest.krypt.co has changed and you have requested strict checking.
Host key verification failed.
```

Most developers approach this problem by ignoring it --
they do exactly what the error says: **remove the pinned host key from their local `~/.ssh/known_hosts` file**.

This is dangerous as they may actually be man-in-the-middled!
They might not know if the server's host public key changed legitimately.
This is where Krypton Teams comes in again: when a server's public key legitimately changes, you can programmatically unpin the old key and pin the new one.

For example, to unpin:
```console
$ kr team hosts pin --host ghe.acme.co --public-key <new-key>
$ kr team hosts unpin --host ghe.acme.co --public-key <old-key>
```

> **Note**: The *order* here matters -- it's more secure and reliable to first
> pin the new public key and only then unpin the old public key.  This order
> ensures that the host always has at least one pinned public key.

#### `list`
To view your team's pinned `ssh` hosts and public keys, run:
```console
$ kr team hosts list
```
## Team Policies and Settings

The command-line interface additionally provides team policy and membership management capabilities.
These commands can set the auto-approval window for your team's requests,
invite and remove people from your team, and manage your team's admins.

### `kr team policy`

If you've used Krypton Core, you know that you have an option to approve a request for a certain time interval (default: three hours).
Krypton Teams gives you the ability to decide what auto-approval interval is right for your team.
To view the current auto-approval interval, run:
```console
$ kr team policy
```

#### `set`
To change the auto-approval window for your team to two hours (120 minutes) for example:
```console
$ kr team policy set --window 120
```

To unset the auto-approval window and restore the Krypton default behavior, run:
```console
$ kr team policy set --unset
```

### `kr team remove`

Removing a member from your team is as simple as:
```console
$ kr team remove --email alice@acme.co
```
Make sure to also remove this member's access from any servers their `ssh`
public key has been added to.

### `kr team invite`

The `kr team invite` command can be used to generate individual and team links.

##### `--domain`

To create an invite link for your team based on the email domain, run:
```console
$ kr team invite --domain acme.co
Krypton ▶ Requesting team operation from phone
Krypton ▶ Phone approval required. Respond using the Krypton app
Krypton ▶ Success. Request Allowed ✔

Link created! Send the following invitation to new members:

You're invited to join acme-dev on Krypton!
Step 1. Install: https://get.krypt.co
Step 2. Accept Invite: tap the link below on your phone or copy this message (or just the link) into Krypton.
krypton://join_team/vZJMZoeRcU3EPL4qaNOrzry3pclVrnWhjtGDGcIKNyw=
```

##### `--emails`

If instead you want to create an invite link for a list of individuals (in this example, `alice@acme.co` and `bob@acme.co`), run:
```console
$ kr team invite --emails alice@acme.co,bob@acme.co
Krypton ▶ Requesting team operation from phone
Krypton ▶ Phone approval required. Respond using the Krypton app
Krypton ▶ Success. Request Allowed ✔

Link created! Send the following invitation to new members:

You're invited to join acme-dev on Krypton!
Step 1. Install: https://get.krypt.co
Step 2. Accept Invite: tap the link below on your phone or copy this message (or just the link) into Krypton.
krypton://join_team/qRqbKpnjNmCczYkwKv3raLbIPavGORO9feKR0ETcFgo=
```

You can then send the invite link into any convenient communication channel such as Slack or email,
and let krypt.co take care of email verification.

### `kr team admin`

Managing the admins on your team can be done with the following two commands that promote a team member to admin and demote an admin to a regular member.

#### `promote`
```console
$ kr team admin promote --email alice@acme.co
```

#### `demote`
```console
$ kr team admin demote --email alice@acme.co
```

## Viewing Audit Logs
### `kr team logs`

To view recent audit logs in the console, use the `kr team logs` command.
New audit log rows appear at the bottom in real-time.
A green row indicates an approved request while a red row indicates a rejected request.
Each log entry describes the type of request, request contents, time and date, user, and user's device.

![cli audit logs.]({{ site.url }}/static/dist/img/docs/cli-audit-logs.png){:class="img-responsive img-phone"}
*cli audit logs*

For a graphical interface, try using the [Real-time Dashboard.]({{ site.baseurl }}{% post_url 2018-02-23-dashboard %})
