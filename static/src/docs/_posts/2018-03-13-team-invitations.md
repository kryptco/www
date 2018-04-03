---
layout: page
title: "Team Invitations"
category: sigchain
order: 1
---

# Team Invitations
The creator of a team, the `GenesisBlock` creator, is the first **admin** of a team.
There are several ways the sigchain protocol supports an admin inviting team members.
The key property of sigchain invitations is that **the sigchain server (run by krypt.co) is NOT able to create or accept invitations to the team**.

To create an invitation, an `admin` posts a block with an `Invite` operation:

```rust
enum Operation {
    Invite(Invitation),
    AcceptInvite(Identity),
    //...more operations to follow.
}

enum Invitation {
    Direct(DirectInvitation),
    Indirect(IndirectInvitation),
}
```

> **Note:** This property is important because *if* krypt.co or any another adversary could intercept the invitation process, and thereby add themselves to your team, they might be able to trick you into giving them access to your infrastructure via the SSH PKI. As you'll see, only the party holding the invitation secret will be able to accept an invitation to join the team.

## Direct Invitations (in person)
A `DirectInvitation` is the most restrictive method to invite a team member. The admin must have the prospective member's identity public key and email address. This invitation protocol uses the following type:

```rust
struct DirectInvitation {
    public_key: Vec<u8>,
    email: String,
}
```

An admin posts a `Block` with the prospective member's `public_key` and `email` using the structure above, thereby confirming the mapping of the member's email to their cryptographic identity. The intent of this invitation type is that the admin obtains the member's identity through a trusted channel. In practice, the Krypton app makes this easy using QR codes and the built-in QR scanner in the app.

To accept this invitation, the prospective member appends an `AcceptInvite` block signed by their identity private key (corresponding to the public key encoded in the `DirectInvitation`).

## Indirect Invitations (secret invite links)
An `IndirectInvitation` is a slightly less restrictive method to invite a team member. Rather than requiring the prospective member to securely pass along a public key, an admin generates a new key pair known as a `nonce_key_pair`. The `nonce_public_key` is encoded in the `IndirectInvitation` struct below and inserted as a block in the sigchain. Anyone with the `nonce_private_key` can then sign an `AcceptInvite` block which will be verified by every team member using the `nonce_public_key`. This way the admin simply has to send a _single_ secret in order to invite _any number_ of team members.

The `nonce_private_key` is sent through an independent channel like a team-wide chatroom, email, text message, etc -- *the important part here is that the untrusted sigchain server, krypt.co, does not see this secret*.

```rust
struct IndirectInvitation {
    nonce_public_key: Vec<u8>,
    restriction: IndirectInvitationRestriction,
    invite_symmetric_key_hash: Vec<u8>, // used to look up ciphertext
    invite_ciphertext: Vec<u8>,
}

enum IndirectInvitationRestriction {
    Domain(String), // restricts the prospective members' emails to '@acme.co'.
    Emails(Vec<String>),
}
```

To accept this invitation, the prospective member appends an `AcceptInvite` block signed by the `nonce_private_key`.

> **Note:** The `nonce_public_key` is posted in the sigchain by an admin,
> giving everyone the ability to verify that the `AcceptInvite` block is signed
> by a valid `nonce_private_key`.  At the same time, the admin sends the
> `nonce_private_key` **only** to the invitee. This means that the untrusted
> sigchain server **does not** learn this secret key.

### Compressing the Indirect Invitation into a secret link
Sending a `nonce_private_key` over a secure channel is not enough. The admin must also send the following information for a prospective member to securely join their team.

```rust
struct IndirectInvitationSecret {
    initial_team_public_key: Vec<u8>,
    last_block_hash: Vec<u8>,
    nonce_keypair_seed: Vec<u8>,
    restriction: IndirectInvitationRestriction,
}
```

- `initial_team_public_key` indicates which team the member is being invited to
- `last_block_hash` ensures that the sigchain server cannot *lie* about the latest block
- `nonce_keypair_seed` encodes the `nonce_private_key`
- `restriction` tells the member what their sign-up team email is restricted to

This is of course a large amount data -- too much to easily post or send to someone.
As a result, we use `symmetric encryption` to compress the `IndirectInvitationSecret`.
The `invite_symmetric_key_hash` and `invite_ciphertext` fields in the `IndirectInvitation` block are later used to decompress the the invitation.

The **admin** performs the following steps to create an `IndirectInvitation` and a `secret_link`:
1. Generate a symmetric `key`
2. Encrypt the `IndirectInvitationSecret` with `key`
3. Encode the resulting ciphertext as the `invite_ciphertext` in the `IndirectInvitation`
4. Encode the `SHA-256` hash of `key` as `invite_symmetric_key_hash` in the `IndirectInvitation`
5. Append the `IndirectInvitation` block to the sigchain
6. Create a `secret_link` including `key`
7. Send `secret_link` along an independent channel of choosing to the prospective member

The **member** performs the following steps to accept an `IndirectInvitation` given a `secret_link`:
1. Query the sigchain server for `invite_ciphertext` with the `SHA-256` hash of `key`
2. Decrypt the `invite_ciphertext` with `key`
3. Read the `IndirectInvitationSecret`
4. Post an `AcceptInvite` block signed with the `nonce_private_key` adhering to the email address `restriction`

### Indirect Invitation Restrictions
When a prospective member posts an `AcceptInvite` block, all readers of the sigchain verify that the email included in the attached `Identity` adheres to the invite being accepted.

#### `Domain` Restriction
The admin specifies an email domain ending, like `@acme.co`, which the prospective member must use (i.e. *alice@acme.co*).

#### `Emails` Restriction
The admin specifies a list of specific email address, like `[alice@acme.co, bob@acme.co, charlie@acme.co]`, which the prospective member must then select one of (i.e `charlie@acme.co`).

## Email Verification
Independent of invitation email restrictions, the Sigchain Server verifies that **prospective members have access to the email address they sign up with**.

Verification is done by sending the prospective member a challenge, a random
`nonce`, to their intended email address.  The prospective member then verifies
their email by signing the `nonce` with their identity `private_key` and
returning this signature to the sigchain server.  The sigchain server only
allows an `AcceptInvite` block if it received a signature of the challenge
matching the corresponding `public_key` in the incoming block.

> **Note:** Every member of the team then verifies that the email address
> matches the `restriction` or `DirectInvitation` email for which the
> `AcceptInvite` block corresponds to.  The `AcceptInvite` block implies which
> `Invite` block it corresponds to based on the key pair used to sign it. For a
> `DirectInvitation`, the `AcceptInvite` block will be signed with the identity
> key pair. In the case of an `IndirectInvitation`, the `AcceptInvite` block
> will be signed by the `nonce_key_pair`.
