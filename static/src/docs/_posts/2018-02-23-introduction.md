---
layout: page
title: "Introduction"
subtitle: "Welcome to Krypton for DevOps Teams."
category: teams
order: 1
---

# Welcome to Krypton for DevOps Teams
**Krypton Core** combines security with ease-of-use to give every developer a secure, convenient place to store their `ssh` + `pgp` key pairs.

**Krypton Teams** extends Krypton Core to provide a simple way to manage access
of `ssh` public keys, enforce Krypton device approval polices, monitor
resources with cryptographic audit logs, and prevent man-in-the-middle-attacks
with real-time distribution of `ssh` known host public keys.

> Krypton Teams is built on an **end-to-end verified infrastructure**.
> Like Krypton Core, using Krypton Teams **does not** require
> trusting krypt.co's server infrastructure to behave honestly.  Your team's
> data cannot be changed, even if krypt.co's infrastructure is compromised.
> [Read more.]({{ site.baseurl }}{% post_url 2018-02-23-team-sigchain %})

<div id="feature-grid" style="width: auto; padding: 0;">

    <div class="feature">
        <div class="feature-image">
            <img src="/static/dist/img/icons/manageKeys.svg" style="width: 80px">
        </div>
        <div class="feature-details">
            <p class="feature-title">
                SSH + PGP Public-Key Infrastructure
            </p>
            <p class="feature-description">
				Manage your team's SSH and PGP public-keys in one place. Easily
				onboard new team members by granting access to the resources
				they need to do their work. When a developer leaves your team,
				have confidence that their access has been properly revoked.
            </p>
        </div>
    </div>

    <div class="feature">
        <div class="feature-image">
            <img src="/static/dist/img/icons/teamManagement.svg" style="width: 110px">
        </div>
        <div class="feature-details">
            <p class="feature-title">
                Team Management
            </p>
            <p class="feature-description">
				Invite all of your team members to join your Krypton
				team with a single link. Create custom temporary approval rules
				and usage policies.
            </p>
        </div>
    </div>

    <div class="feature">
        <div class="feature-image">
            <img src="/static/dist/img/icons/realTimeAudit.svg" style="width: 90px">
        </div>
        <div class="feature-details">
            <p class="feature-title">
                Real-time Audit Logs
            </p>
            <p class="feature-description">
				Keep track of every phone, workstation, and server that are
				active in your infrastructure in real-time. All audit log data
				is encrypted and only accessible by team admins.
            </p>
        </div>
    </div>


    <div class="feature">
        <div class="feature-image" style="margin-top: 0">
            <img src="/static/dist/img/icons/pinHost.svg" style="width: 90px">
        </div>
        <div class="feature-details">
            <p class="feature-title">
                Real-Time Host Pinning
            </p>
            <p class="feature-description">
                Protect your team from man-in-the-middle (MITM) attacks. Pin public keys of known servers and seamlessly distribute
                them to your team members in real-time. Host verification is performed in the Krypton app so your team members
                will verifiably know where they're connecting to.
            </p>
        </div>
    </div>


</div>
