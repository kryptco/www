---
layout: page
title: "Teams CLI"
subtitle: "The Krypton Team DevOps command line tools"
category: teams
order: 4
---

# Control your Team with the `kr` CLI
Krypton Teams is built to seamlessly integrate into your existing infrastructure.

For example, the following commands give `asmith@acme.co` `ssh` access to `bastion.acme.co`:
<div>
    <div class="iterm">
    <div class="dots">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
    </div>
    <div class="line">
        <p><span class="bang">$</span>kr team list <span class="yellow">--ssh</span></p>
    </div>
    <div class="result">
        <p>Team has <span class="green">24 members</span> with SSH public keys:</p>
        <br>
        <p><span class="green">1. asmith@acme.co</span></p>
        <p>ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFyF4VHr5XH+C...</p>
        <p><span class="green">2. cwilliams@acme.co</span></p>
        <p>ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAID3n8Y6I8NYHZf...</p>
        <p><span class="green">3. gmiller@acme.co</span></p>
        <p>ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKf8MBtmVow9bS...</p>
        <p>...</p>                            
    </div>
    <div class="line new-line">
        <p><span class="bang">$</span></p>
    </div>    
    </div>
    <div class="iterm">
        <div class="dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
        <div class="line">
            <p><span class="bang">$</span>kr add <span class="yellow">--member</span> asmith@acme.co <span class="yellow">--server</span> bastion.acme.co</p>
        </div>
        <div class="result">
            <p><span class="green">bastion.acme.co</span> is now accessible by:</p>
            <br>
            <p><span class="green">1. asmith@acme.co</span></p>
            <p><span class="green">2. oharris@acme.co</span></p>
            <p><span class="green">3. xlee@acme.co</span></p>
            <p>...</p>
        </div>
        <div class="line new-line">
            <p><span class="bang">$</span></p>
        </div>    
    </div>
</div>                    

The `kr add` helper command is useful, but you can also plug the `kr team
list --ssh` command into any custom provisioning script you might have.

`kr` commands provide a programmatic interface to:
1. **Public key infrastructure for team `ssh` and `pgp` keys, and SSH-server `ssh` public keys**
2. **Reading and writing of team settings and policies**
3. **Streaming team member's SSH audit logs**

Example use cases:
 - Provision/de-provision server access for new/departing team members.
 - Pin `ssh` known host public keys of all of your EC2 instances for the entire team.
 - Continuously dump team audit logs into a threat analysis tool/PagerDuty/your favorite log analysis tool.


> **Note**: `kr` can be installed on most linux and macOS distros,
> which means that all of these features can easily be integrated with your existing services.

*The remainder of this article will walk through some of the most common `kr` teams-related commands.*

## Contents

1. [Team Members (PKI)](#kr-team-list)
2. [SSH-Server Access Control](#ssh-server-access-control)
3. [Pinning SSH Known Hosts](#kr-hosts)
4. [Team policies and settings](#team-policies-and-settings)
    - [Changing the auto-approval window](#kr-team-policy)
    - [Removing team members](#kr-team-remove)
    - [Inviting team members](#kr-team-invite)
    - [Admins: Promoting/demoting](#team-admins-promoting-and-demoting)
5. [Viewing Audit Logs](#kr-team-logs)

## Authenticating with `kr`
Every change to your team requires *authentication*.

However in Krypton, there are no passwords.  All authentication is based on
public-key cryptography where the the private keys live on individual team
members' Krypton devices and **the private-keys never leave the device**.

When using the `kr` command line tool for Teams actions, much like when `ssh`-ing to a server or signing a `git` commit,
`kr` will push a notification to your phone and ask your permission to perform this team action.
Upon your approval, Krypton will use its private key locally on the phone to create a signature that will then be returned back to `kr`.

Every time you run a `kr` command that touches your team, `kr` fetches new team data blocks to ensure that you have an up-to-date view on the *entire* state of the team.

## `kr team list`
This teams command can help with all of your DevOps SSH PKI needs.

By default, the `kr team list` command prints out all of your active team members (by email). For example,

```console
$ kr team list
Team has 3 member(s):

1. alice@acme.co
2. bob@acme.co
3. charlie@acme.co
...
```

By adding a `--ssh` or `--pgp` flag you can extract those respective key types:
```console
$ kr team list --ssh
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
$ kr team list --ssh -e charlie@acme.co
Found team member with email charlie@acme.co
Printing SSH Keys:

1. charlie@acme.co
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBLo4wC4GsDFDdfs42dfs+xLYo6SRW1x1bOCx5LoYZG6
```
> **Note**: Email **uniqueness** on a Krypton Team is always enforced, so you can safely use the above command to extract a single member's public keys.

## SSH-Server Access Control
There are three essential access control commands `list, add, remove` for modifying who can access a server.
Note that these commands assume (and will error otherwise) that you have a typical SSH config with an `authorized_users` file.
For custom ACL setups, integrating Krypton is straightforward: take a look at the [`kr team list --ssh`](#kr-team-list) command.

### list
```console
$ kr list --server root@bastion.acme.co
bastion.acme.co is accessible by 10 team members:

1. alice@acme.co
2. bob@acme.co
3. charlie@acme.co
...
```

### add
```console
$ kr add --member kevin@acme.co,alex@acme.co --server root@bastion.acme.co
bastion.acme.co is now accessible by 12 team members:

1. kevin@acme.co
2. alex@acme.co
3. alice@acme.co
4. bob@acme.co
5. charlie@acme.co
...
```

### remove
```console
$ kr remove --member alice@acme.co --server root@bastion.acme.co
bastion.acme.co is now accessible by 11 team members:

1. kevin@acme.co
2. alex@acme.co
3. bob@acme.co
4. charlie@acme.co
...
```

## `kr hosts`
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

<div>
    <div class="feature-media host-pin">
        <div class="iterm">
                <div class="dots">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
                <div class="line">
                    <p><span class="bang">$</span>kr pin <span class="yellow">--host</span> bastion.acme.co</p>
                </div>
                <br>
                <div class="line new-line">
                    <p><span class="bang">$</span></p>
                </div>    
        </div>              
        <div class="phone-demo">
            <img class="phone-skeleton" src="/static/dist/img/iphone_skeleton.png"/>
            <video autoplay loop playsinline muted>
                <source src="/static/dist/img/host_pin_bare.mp4" type="video/mp4">
            </video>
        </div>                              
    </div>
</div>
                 


#### `pin`
The `kr` command line tool makes it easy to distribute pinned `ssh` known hosts (the mapping of server to `ssh` public key) to all of your team members.

For example, to pin your GitHub Enterprise instance's `ssh` public key, `ghe.acme.co`, run:

```sh
$ kr hosts pin --host ghe.acme.co
```

In this case, `kr` will automatically grab the `ssh` public key from your local known hosts file in `~/.ssh/known_hosts`.

##### `--public-key`
To supply the public key explicitly, add the `--public-key` and append the public key string (omitting the `ssh-rsa` prefix).

##### `--update-from-server`
Alternatively, supplying the `--update-from-server` flag, will instruct `kr` to log into the server and explicitly read all of the server's host `ssh` public keys.

##### Script it
The `kr hosts pin` command also supports **stdin**. These means you can easily stick this command into a script that, for example, spins up a new server on Amazon EC2.

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
$ kr hosts pin --host ghe.acme.co --public-key <new-key>
$ kr hosts unpin --host ghe.acme.co --public-key <old-key>
```

> **Note**: The *order* here matters -- it's more secure and reliable to first
> pin the new public key and only then unpin the old public key.  This order
> ensures that the host always has at least one pinned public key.

#### `list`
To view your team's pinned `ssh` hosts and public keys, run:
```console
$ kr hosts list
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

#### `kr team invite`

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

### Team Admins: Promoting and Demoting
To list admins on your team, you can run `kr team list --admin`.

Managing the admins on your team can be done with the following two commands that promote a team member to admin and demote an admin to a regular member.

#### `kr team promote`
```console
$ kr team promote --email alice@acme.co
```

#### `kr team demote`
```console
$ kr team demote --email alice@acme.co
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
