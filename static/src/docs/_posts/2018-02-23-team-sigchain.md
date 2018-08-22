---
layout: page
title: "The Sigchain"
subtitle: "Krypton for DevOps teams is designed to be end-to-end verified: every team operation is independently verified by every member on the team using sigchains."
category: sigchain
order: 0
---

# The Sigchain
Krypton for DevOps teams is designed to be *end-to-end verified*: every team operation is independently verified by every member on the team.

In other words, teams and their members **do not blindly trust** output from
the krypt.co infrastructure. Instead, every team member cryptographically
verifies the output from the server before applying the operation.

> **Why should I care about this?** If nothing else, this should give you and your team comfort that even if krypt.co is *compromised* one day, the integrity of your team data will be safe.

## What's in a Sigchain
Every Krypton team is stored as a *signed hash chain*, or `sigchain`, where a chain is a series of `block`s.

Sigchains have two important properties:
1. Every block includes the `hash` of the previous block
2. Every block is `signed`

This construction makes it possible to have an *untrusted* party (in this case krypt.co) host dynamically changing data in a way that can be verified independently by a trusted group of parties (the members of the team).

The two properties above guarantee that when a team member fetches blocks from the untrusted party (a krypt.co server), they can:
1. Verify *who* authored each block (a team admin), and
2. Since the hash of the previous block is implicitly signed, they can verify that the *order* of the blocks has not been altered by the untrusted party.

## Protocol
The sigchain protocol defines every action in the Krypton Teams system.

- A `SignedMessage` attaches a signer's public key and a signature to a serialized `Message`.

- A `Message` is the generic type for actions on a sigchain.

- Every action that can be signed must be represented as a `Message`.

- Every `Message` has a `Header` that encodes the time the `Message` was created and with which version of the sigchain protocol.

- Every `Message` has a `Body` that describes the type of action the `Message` encodes.

Below are the essential type definitions used in a team's sigchain (in rust syntax):

```rust
struct SignedMessage {
    public_key: Vec<u8>,
    message: SerializedMessage, // a json string-encoded `Message`
    signature: Vec<u8>,
}

struct Message {
    header: Header,
    body: Body,
}

struct Header {
    utc_time: i64,
    protocol_version: String,
}

enum Body {
    Main(MainChain),
    // a Message can encode other Body types for non-sigchain purposes
}

enum MainChain {
    Create(GenesisBlock),
    Append(Block),
}

// the first block in a chain
struct GenesisBlock {
    team_info: TeamInfo,
    creator_identity: Identity,
}

// subsequent blocks in a chain
struct Block {
    last_block_hash: Vec<u8>,
    operation: Operation,
}

// team information
struct TeamInfo {
    name: String,
}

// a member's cryptographic identity
struct Identity {
    public_key: Vec<u8>,
    encryption_public_key: Vec<u8>,
    ssh_public_key: Vec<u8>,
    pgp_public_key: Vec<u8>,
    email: String,
}
```

## Main Chain
The `MainChain` encodes the blocks of the sigchain (other `Body` cases represent actions that can be signed to go along with but not directly into a sigchain).

- **Create.** A `GenesisBlock` begins a sigchain and encodes bootstrapping information like the name of the team (in a `TeamInfo`) and the first team admin's cryptographic identity, the `creator_identity`.

- **Append.** Every other `Block` encodes an `Operation` on the team and includes a pointer to the previous `Block` encoded by the `last_block_hash`.

Informally, an operation can be "invite alice@acme.co", "promote bob@acme.co to 'Admin'", "change team name to 'acme-dev'", and more (discussed below).

### Block Hashes
The `last_block_hash` is the `block_hash` of the preceding `SignedMessage` in the sigchain. 

A `block_hash` includes both the `public_key` and `message` of the
`SignedMessage`. Specifically, the `block_hash` is the hash of the
concatenation of the hashes of the `public_key` and the `message`, or more
formally, for a given `SignedMessage` **S**:
```
block_hash(S) = H(H(S.public_key) || H(S.message))
``` 

where `H` is the `SHA-256` hash function.

### Example Sigchain
Below is an example of the first few blocks of a valid sigchain in JSON:

```json-doc
{
  sigchain : [{
      signature : ...,
      public_key : "gqCd7EKULJA58XWUi9jrgfjuG6xKdvwKHU37Fj4fuaU=",
      message : {
        header : {
          utc_time : 1519449875,
          protocol_version : "1.0.0"
        },
        body : {
          main : {
            create : {
              team_info : {
                name : "acme"
              },
              creator_identity : {
                public_key : "gqCd7EKULJA58XWUi9jrgfjuG6xKdvwKHU37Fj4fuaU=",
                encryption_public_key : "...",
                email : "alice@acme.co",
                ssh_public_key : "ssh-rsa AAAA...",
                pgp_public_key : "----- BEGIN PGP PUBLIC KEY -----..."
      ...
    },
    {
      signature : "...",
      public_key : "gqCd7EKULJA58XWUi9jrgfjuG6xKdvwKHU37Fj4fuaU=",
      message : {
        header : {
          utc_time : 1519449877,
          protocol_version : "1.0.0"
        },
        body : {
          main : {
            append : {
              last_block_hash : "2mQHyEOB7MUGso0tl0UdZCfOZI6Bfosg\/UtZy1peVj0=",
              operation : {
                set_policy : {
                  temporary_approval_seconds : 18000
      ...
    },
    {
      signature : "...",
      public_key : "gqCd7EKULJA58XWUi9jrgfjuG6xKdvwKHU37Fj4fuaU=",
      message : {
        header : {
          utc_time : 1519449879,
          protocol_version : "1.0.0"
        },
        body : {
          main : {
            append : {
              last_block_hash : "7CDeHMlg6l8j+G7OVFOwhJ8rpU3KvZbSJerwpgxDGNg=",
              operation : {
                invite : {
                  direct : {
                    public_key : "kBcawuG1mqpWUiLKhMPQ+1+5eWSjoIHOnuAS5HYRwZ8=",
                    email : "charles@acme.co",
      ...
    },
    {
      signature : "...",
      public_key : "kBcawuG1mqpWUiLKhMPQ+1+5eWSjoIHOnuAS5HYRwZ8=",
      message : {
        header : {
          utc_time : 1519449881,
          protocol_version : "1.0.0"
        },
        body : {
          main : {
            append : {
              last_block_hash : "o2nZl11S1WqI\/D+vWuZ7AQF5mqRUnOHGgJ40nN2kOZ0=",
              operation : {
                accept_invite : {
                  public_key : "kBcawuG1mqpWUiLKhMPQ+1+5eWSjoIHOnuAS5HYRwZ8=",
                  encryption_public_key : "...",
                  email : "charles@acme.co",
                  ssh_public_key : "ssh-rsa AAAA...",
                  pgp_public_key : "----- BEGIN PGP PUBLIC KEY -----..."
      ...
    },
    {
      signature : ...,
      public_key : "gqCd7EKULJA58XWUi9jrgfjuG6xKdvwKHU37Fj4fuaU=",
      message : {
        header : {
          utc_time : 1519449883,
          protocol_version : "1.0.0"
        },
        body : {
          main : {
            append : {
              last_block_hash : "A3sTGuoA3KNr0meTapHneMP8\/HBnui+qj0+ECf2Kmvk=",
              operation : {
                promote : "kBcawuG1mqpWUiLKhMPQ+1+5eWSjoIHOnuAS5HYRwZ8="
      ...
    }
  ]
}
```

<hr>

> Read more about how team invitations, team operations, and encrypted audit logging work in the sigchain protocol here:
- [Team Invitations]({{ site.baseurl }}{% post_url 2018-03-13-team-invitations %})
- [Team Operations]({{ site.baseurl }}{% post_url 2018-03-13-team-operations %})
- [Logchains]({{ site.baseurl }}{% post_url 2018-03-12-logchain %})

> Read about the cryptographic libraries used in the implementations of the sigchain protocol here: [Cryptographic Libraries]({{ site.baseurl }}{% post_url 2018-03-13-cryptographic-libraries %}).
