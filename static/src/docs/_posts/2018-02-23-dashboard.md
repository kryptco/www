---
layout: page
title: "Real-time Dashboard"
subtitle: "Launching the Krypton Team DevOps real-time dashboard"
category: teams
order: 3
---

# Using the Teams Dashboard

If you are a Krypton team admin, the dashboard is a great way to monitor your team, view important logs, and manage your team's settings.
The logs record all `git` commits, `git` tags, and `ssh` logins your team creates in real-time.
To spin up the dashboard, run the following command in your shell:
```bash
$ kr team dashboard
```
You will now be navigated to the dashboard in your browser of choice.
In the Krypton app, you should receive a notification asking permission to load your team's data on your computer.

> **Note**: The dashboard runs locally on your computer and no audit log data leaves your computer.

## Managing Team Memberships

Once the dashboard loads, you will be presented with a team roster page.
From this page, you can see a listing of all current team members along with their most recent activity.

![Team member management.]({{ site.url }}/static/dist/img/docs/team-dash-small.png){:class="img-responsive img-phone"}
*Team member management*

Copying a team member's `ssh` or `pgp` public key is as simple as clicking the
corresponding button in the keys column.  The actions column allows you to
change a team member's admin access and membership.  You can promote a team
member to an admin, demote an admin to a team member, or remove someone from
the team entirely.  If you want to see an individual team member's activity,
just click on their name to bring up the hosts they've accessed and their most
recent logs.

![Individual host accesses.]({{ site.url }}/static/dist/img/docs/member-host-accesses.png){:class="img-responsive img-phone"}
*Individual host accesses*
![Individual recent logs.]({{ site.url }}/static/dist/img/docs/member-recent-logs.png){:class="img-responsive img-phone"}
*Individual recent logs*

The `Add Team Members` button in the upper right can be used to issue new invitations.
Pressing it brings up the following invitation options:

![Invitation options.]({{ site.url }}/static/dist/img/docs/invite-options.png){:class="img-responsive img-phone"}
*Invitation options*

If you want to invite many people to join your Krypton team,
you can send a team link over your most convenient channel such as Slack or email
that will allow anyone with an email address from your specified domain to join.
Email verification is performed by krypt.co upon sign up.

![Invite over Slack.]({{ site.url }}/static/dist/img/docs/slack-krypton-invite.png){:class="img-responsive img-phone"}
*Invite over Slack*

If you instead want to invite a few specific people, you can issue an individual link to a collection of email addresses.

![Individual invite.]({{ site.url }}/static/dist/img/docs/individual-invite.png){:class="img-responsive img-phone"}
*Adding individuals to an invite*

## Viewing Real-time Audit Logs

The `Audit Logs` tab on the sidebar shows your team's real-time `ssh` login and `git` commit/tag signature audit logs.
At the top of this page, you will see a dynamic graph showing the number of Krypton requests made in the last 30 minutes.

![Real-time audit logs.]({{ site.url }}/static/dist/img/docs/audit-logs-dash-small.png){:class="img-responsive img-phone"}
*Real-time audit logs*

The actual contents of the logs can be viewed below the graph.  New audit log
rows appear at the top in real-time and and the search bar performs a
text-based search on any log entry.  For example, searching for a team member's
email will only show audit logs pertaining to that team member.  The audit logs
also contain rejected requests that can be identified by the red `X` that
appears in that entry's row.

You can also stream these logs via the `kr team logs` command.
More information on `kr team` commands can be found in our [Teams CLI Docs.]({{ site.baseurl }}{% post_url 2018-02-23-command-line %})

> **Note:** Audit logs are **encrypted** and only team admins can read them.
> When you view these logs, the dashboard requests decryption directly from Krypton on your
> phone. [Learn more about encrypted logs.]({{ site.baseurl }}{% post_url 2018-03-12-logchain %})

## Host Information

The hosts tab of the dashboard lists all of the servers that your team members
access via `ssh`.  Each row shows the number of accesses, number of team members,
as well as the most recent access for that server.

![List of hosts.]({{ site.url }}/static/dist/img/docs/hosts-dash-small.png){:class="img-responsive img-phone"}
*List of hosts*

To see a detailed listing of team members' accesses, press `View people`.
This will bring up the following modal that can be used to view more fine-grained information about each host.

![People who have accessed a particular host.]({{ site.url }}/static/dist/img/docs/hosts-people-dash-small.png){:class="img-responsive img-phone"}
*People who have accessed a particular host*

This modal shows the number of times each user accessed this host. Pressing
`View logs` on the hosts page or `Audit Logs` in the modal lists all logs for
that host.

![Logs for a particular host.]({{ site.url }}/static/dist/img/docs/hosts-logs-dash-small.png){:class="img-responsive img-phone"}
*Logs for a particular host*

## Team Settings

Finally, you can use the dashboard to manage team policies and settings as you
would through the Krypton app.  You can set the team name, auto-approval
window, logging status, and manage other team admins.  This is also where you
can manage your billing preferences and plan for Krypton Teams.

![Team settings.]({{ site.url }}/static/dist/img/docs/settings-dash-small.png){:class="img-responsive img-phone"}
*Team settings*

