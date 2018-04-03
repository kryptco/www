---
layout: page
title: "Get Started"
category: teams
order: 2
---


# Getting Started with Krypton Teams
Krypton Teams comes installed with Krypton Core v2.4+ -- you can [follow the Krypton Core instructions here]({{ site.baseurl }}{% post_url 2017-08-20-installation %}).
If you already use Krypton Core, simply update the Krypton app from the Apple App Store or Google Play Store and then run `kr upgrade`.

## Create Your Team
In the Krypton app, navigate to the `Teams` tab and tap **"Create a team"**. Follow the onboarding instructions in the app to create the initial team settings.

### 1) Choose a Team Name
Only you and your team members will see this, so choose any name you like. All
characters are allowed and the team name can be changed at any time by a team
admin.

### 2) Enable Audit Logs
Audit logs are stored on the krypt.co servers **encrypted only to team admins**
such that krypt.co **CANNOT** read them and non-admins **CANNOT** read them.
Audit logs include every `ssh` login and `git` commit/tag signature perfomed by
your team members.  Later you can view this data in the dashboard to give you
insight into the resources being accessed in your infrastructure.

![Real-time audit logs.]({{ site.url }}/static/dist/img/docs/audit-logs-dash-small.png){:class="img-responsive img-phone"}
*Real-time audit logs*

### 3) Select an Auto-approval Window
Krypton Core allows approving a request for a certain time interval (default
three hours).  This is convenient if you know you'll be logging into a server
continuously for a period time.  For example, you can decide to "allow all
`git@github.com` requests for the next three hours."

Krypton Teams gives you the ability to decide what auto-approval interval is right for your team.
If the default options are not sufficient, you can customize this more after your team is ready.

### 4) Distribute SSH Known Hosts (optional)
One of the more advanced features of Krypton Teams is the synchronization of the SSH public keys of servers in your infrastructure to your team members.

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

During the Teams on-boarding, Krypton will automatically ask you if you want to
distribute your *current* known hosts to your team members.  Select the hosts
you want to protect against man-in-the-middle-attacks.

## Add team members
Invite your first team member by tapping the **"Add a new member"** button the Teams tab.

![Add member dialogue.]({{ site.url }}/static/dist/img/docs/add-member-dialogue.png){:class="img-responsive img-phone"}
*Add member dialogue*

Most invitations are in the form of links. You can share these secret URLs with
new team members so they can join your team. Each invite URL is generated only
on your phone such that krypt.co never has access to it.

Here's an example of what you would send to your team members over slack, email, or any other communication channel you use:

![Invite over Slack.]({{ site.url }}/static/dist/img/docs/slack-krypton-invite.png){:class="img-responsive img-phone"}
*Invite over Slack*

There are several types of links you can create to make it easy to have people join your team.

### Team Link
A `team link` is an invitation that allows anyone with a matching email address domain and the link to sign up for the team.
For example, if your company is "AcmeCo" with domain `acme.co`, the invitation will require that every developer joins your team with an `@acme.co` email address --
and this email address will be verified by krypt.co when they sign up.

### Individuals Link
An `individuals link` is an invitation that you create for specific people, by their email addresses.
For example, you can create an invitation for `bob@acme.co` and `alice@acme.co` and send them both the same secret invite link.
Anyone that uses this sign-up link must prove they have access to either `bob@acme.co` or `alice@acme.co` via email verification by krypt.co.

> **Note**: Even though krypt.co performs email verification, krypt.co cannot
> join your team as invitation links are only seen on the communication
> channels you send them through (i.e. email, Slack, etc).

### In Person
The fastest (and most secure) way of inviting somebody if they're sitting near you is to do it in person.
Krypton generates a special QR code that the team member can scan with their phone (using Krypton).
This method asks you to verify that person's email address before you grant them access to join your team.

![QR code invite.]({{ site.url }}/static/dist/img/docs/direct-invite.png){:class="img-responsive img-phone"}
*QR code invite*

## Promote Someone Else to Admin (important)
We recommend that all teams have at least **two team admins** for redundancy and fault-tolerance.

Since Krypton Teams is built on an *end-to-end verifiable infrastructure* ([read more here]({{ site.baseurl }}{% post_url 2018-02-23-team-sigchain %})),
krypt.co *does not have access to modify any of your team settings, policy, or team members*.
This means that only **admins** on your team are able to modify team data such as changing an auto-approval interval or inviting new team members.

An admin's private key *never leaves their Krypton device*.
This means that if the team only has one admin and they leave the team or lose their phone, no one will be able to modify the team and a new one will have to be created.

Having at least **two admins** allows one admin to re-provision the other in the event a phone is lost.
<br>
<hr>

## Next Steps
Congratulations, you've successfully set up your Krypton Team! Below are some next steps which will help you take full advantage of the Krypton Teams platform features and tools.

### 1. Krypton Teams Dashboard
Krypton Teams includes a web dashboard hosted locally from `kr`. The dashboard is a UI for managing your team and viewing real-time audit logs.
[Learn more.]({{ site.baseurl }}{% post_url 2018-02-23-dashboard %})
![Dashboard preview.]({{ site.url }}/static/dist/img/docs/team-dash-small.png){:class="img-responsive img-phone"}

### 2. The `kr` Teams CLI
Krypton Teams was designed to be modular and to easily fit into your company's infrastructure.

All the Teams functionality can be used directly from the command line.  As
long as you're paired with the computer (via Krypton), you can do things like
fetch team member's `ssh` public keys and create invitation links right  from
your computer.  [Learn more.]({{ site.baseurl }}{% post_url
2018-02-23-command-line %})
