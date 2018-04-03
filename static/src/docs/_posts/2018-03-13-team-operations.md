---
layout: page
title: "Team Operations"
category: sigchain
order: 2
---

# Team Operations
The sigchain protocol supports a variety of team operations. This section provides a brief overview of what these operations do.
To learn about the way team invitations work, see [Team Invitations]({{ site.baseurl }}{% post_url 2018-03-13-team-invitations %}).

```rust
enum Operation {
    Invite(Invitation),
    AcceptInvite(Identity),

    CloseInvitations(E),
    Leave(E),

    Promote(IdentityPublicKey),
    Demote(IdentityPublicKey),
    Remove(IdentityPublicKey),

    SetPolicy(Policy),
    SetTeamInfo(TeamInfo),
    PinHostKey(SSHHostKey),
    UnpinHostKey(SSHHostKey),
    AddLoggingEndpoint(LoggingEndpoint),
    RemoveLoggingEndpoint(LoggingEndpoint),
}
```

## Close Invitations
A `CloseInvitations` operation invalidates all `Invite` operations that
happened before it.  If a prospective team member tries to post an
`AcceptInvite` block that corresponds to a closed `Invite`, the `AcceptInvite`
block will be rejected.  When a `DirectInvitation` is used it is automatically
closed, whereas `IndirectInvitation`'s remain open until explicitly closed.
Only an admin can close all outstanding invitations.

## Leave Team
Any member of the team can post a `Leave` block to remove themselves from the team.
Doing so will prevent them from reading future blocks posted to the `MainChain`.
Leaving a team does not prevent you from rejoining the team by accepting an appropriate `Invite` block if it is still open.

## Manage Admins
As an admin, you can promote members to admin status and demote them from admin status by their public key.

### Promote
When a `Promote` block is posted to the main chain by an admin, the member whose public key is specified will now be able to perform admin operations.
The public key must belong to someone who is already on the team as a regular member.

### Demote
When a `Demote` block is posted to the main chain by an admin, the admin whose public key is specified will no longer be able to perform admin operations.
The public key must belong to someone who is an admin of the team.
Being demoted does not prevent being promoted again in the future.

## Remove Member
When an admin posts a `Remove` block to the main chain, two things happen:
1. The member whose public key is specified will be removed from the team
2. All outstanding invitations will be closed to prevent the removed member from rejoining using an indirect invitation.

## Set Policy
The `SetPolicy` block allows an admin to change the auto-approval window for their team.
The `Policy` included in a `SetPolicy` block looks like:

```rust
struct Policy {
    temporary_approval_seconds: Option<i64>,
}
```

## Set Team Info
The `SetTeamInfo` block allows an admin to change the name of the team.
The `TeamInfo` struct simply contains the new team name:

```rust
struct TeamInfo {
    name: String,
}
```

## Host Public Key Pinning
Admins can pin and unpin host public keys by posting `PinHostKey` and `UnpinHostKey` blocks to the `MainChain`.
These pinned host keys will be distributed to all members of the team and protect against man-in-the-middle attacks.
To pin or unpin a host, an admin specifies the name of the host and a public key in the following struct:

```rust
struct SSHHostKey {
    host: String,
    public_key: Vec<u8>,
}
```

The same host can have many pinned public keys.

## Logging
Finally, admins can add and remove logging endpoints with the
`AddLoggingEndpoint` and `RemoveLoggingEndpoint` blocks. Adding a logging
endpoint, such as the krypt.co team server, will export team members' encrypted
logs to the specified endpoint so that they can later be fetched, decrypted,
and viewed by admins. Currently this amounts to enabling or disabling sending
of encrypted logs to krypt.co's sigchain server. Support for other endpoints
may be added in the future.

To learn more about how logs are handled, read the [logchain docs]({{ site.baseurl }}{% post_url 2018-03-12-logchain %}).
