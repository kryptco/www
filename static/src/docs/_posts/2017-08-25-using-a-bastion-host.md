---
layout: page
title: "Using a Bastion Host"
subtitle: "Learn about bastion servers and how to use Krypton and kr to proxy jump through servers in your infrastructure."
category: ssh
date: 2017-08-24 22:17:13
order: 2
---

# Using a Bastion Host
A bastion host is a server that acts as a gateway between you and the servers you are logging in to. Many companies set up a group of servers in a private network that blocks all incoming traffic. Then a single bastion server is added to the network and is the only server accessible outside of the private network. The only way to log in to one of the servers is to pass traffic through the bastion host, and `ssh` provides multiple ways to accomplish this.

## Agent Forwarding is Insecure
A common, but **dangerous**, practice in using bastion hosts is to first `ssh` into the bastion with agent forwarding enabled (the `-A` flag), then `ssh` into the destination server. In this case, your `ssh` session is decrypted on the bastion host, then re-encrypted to your local machine, meaning that anyone with access to the bastion host can potentially read or hijack your `ssh` session. Agent forwarding also leaves a socket open on the bastion that connects back to your local `ssh-agent`, potentially allowing other users to use your local private keys. Finally, invoking `ssh` on the bastion does not use your local `~/.ssh/known_hosts` file or Krypton's pinned host public keys for authenticating remote hosts.

## Use Proxying Instead
`ssh` supports proxying encrypted traffic through one (or many) intermediate servers, where each server adds a layer of encryption instead of decrypting and re-encrypting the traffic. We accomplish this using the `ProxyCommand` configuration option.

### Single Bastion Host
Suppose our bastion host is `bastion.krypt.co` and our destination server is `dest.krypt.co`. Adding the following to our `~/.ssh/config` before the Krypton block will use our bastion as a proxy:

``` bash
Host dest.krypt.co
    ProxyCommand krssh -p "ssh -W %h:%p bastion.krypt.co" -h %h

# Added by Krypton...
```

Now when we log in to `dest.krypt.co`, we first authenticate to `bastion.krypt.co`. This first `ssh` session sets up a tunnel that forwards traffic from our local machine to `bastion.krypt.co` and finally to `dest.krypt.co`. Then a new `ssh` login is started over this tunnel, starting on our local machine and ending at `dest.krypt.co`. The final result is that traffic is locally encrypted to the `dest.krypt.co` session, then locally encrypted again to `bastion.krypt.co` and sent. Then `bastion.krypt.co` decrypts the outer layer and sends the still-encrypted session to `dest.krypt.co`, where it is fully decrypted. Each step of the authentication uses Krypton's pinned host public keys to authenticate each host.

Even if the bastion host is compromised, an adversary cannot read or hijack the session established between our local machine and the destination server.

#### Many Destination Servers
Usually more than one server is protected by a single bastion host. We can use `ssh` config rules to easily proxy traffic for multiple destinations through one proxy:
``` bash
# Specify each proxied host individually
Host dest1.krypt.co dest2.krypt.co
    ProxyCommand krssh -p "ssh -W %h:%p bastion.krypt.co" -h %h

# Proxy traffic for a group of servers
Host *.dev.krypt.co
    ProxyCommand krssh -p "ssh -W %h:%p bastion.krypt.co" -h %h

# Added by Krypton...
```
Check out `man ssh_config` for more config tricks using the `Host` and `Match` directives.

### Multiple Proxy Hops
`ssh` traffic can even be proxied through multiple hops, allowing you to navigate multiple layers of private networks. We accomplish this by simply adding a `ProxyCommand` directive for the intermediate bastion as well.

For example, to proxy traffic through `hop1.krypt.co` to `hop2.krypt.co` and finally to `dest.krypt.co`, we would add the following to `~/.ssh/config`:

```bash
Host hop2.krypt.co
    ProxyCommand krssh -p "ssh -W %h:%p hop1.krypt.co" -h %h

Host dest.krypt.co
    ProxyCommand krssh -p "ssh -W %h:%p hop2.krypt.co" -h %h

# Added by Krypton...
```
