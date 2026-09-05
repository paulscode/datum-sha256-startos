# Datum Gateway (SHA256) Companion

This turns your node's block templates into work your miner can mine, and hands
it out over Stratum on your LAN.

**Building your own templates is the point.** Mining to a pool normally means
mining the pool's template: they choose which transactions go in the block, you
supply the hashing. DATUM turns that around. Your node builds the template and
your miner works on it, whether you are mining solo or to a pool.

## Before you start

You need **Bitcoin Knots (SHA256) Companion** installed and running. It provides
the templates.

That node follows the same chain as the official Bitcoin service, so this is not
about mining a different chain. It is about **BIP-110**: the companion never
enforces it, so if the network ever splits over that rule, the blocks this
gateway builds follow the side that does not require it.

## Setup

### 1. Get a payout address

Mining solo pays a whole block subsidy to one address, so use an address from a
wallet whose keys you hold and already back up. A desktop wallet such as
[Sparrow](https://sparrowwallet.com) is the usual answer: create a receive
address there and copy it. It starts with `bc1`. This node follows the same chain
your ordinary wallet does, so any Bitcoin wallet will do.

You can instead use an address from the node's own wallet, via **Get Address** on
**Bitcoin Knots (SHA256) Companion**. That is a wallet living on the server with
no seed phrase in your hands, so it is only as safe as your backups of that
service.

### 2. Tell the gateway where to pay

1. Come back to this service.
2. Go to **Actions** and run **Set Payout Address**.
3. Paste the address in and save.

The service will not start until you have done this. There is no default, because
a default would mean sending your block rewards to somebody else.

### 3. Start it, and find your Stratum address

Start the service, then open its **Interfaces** tab and find the **Stratum**
address.

**Use your server's IP address, not its `.local` name.** Most ASIC firmware has no
mDNS resolver, so a `.local` address fails silently and the miner just reports
that the pool is not ready.

```
stratum+tcp://192.168.1.50:23338
```

**Read the port from the Interfaces tab** rather than copying it from here:
StartOS assigns it and may pick a different one. 23338 is used rather than the
official Datum service's 23334 so both can run on one server.

### 4. Point your miner at it

In your miner's own web interface, set the pool to that Stratum address.

If you are mining **solo**, the worker name and password are not used and the
payout comes entirely from the address you set in step 2. Put something readable
as the worker so you can tell miners apart on the dashboard.

If you are mining **to a pool**, fill in the pool's details under **Actions →
DATUM Pool** first, and then the username your miner sends is the one the pool
sees.

## Solo or pooled

Leave **DATUM Pool** empty and you are mining solo: a block you find pays its
whole subsidy to your address, and you will very probably never find one unless
you have substantial hashrate.

Fill it in and you mine to a pool, receiving a share of its rewards, while still
building your own block templates. That is the arrangement DATUM exists for.

## What "working" looks like

- The miner shows a connected pool and a hashrate.
- The dashboard shows accepted shares going up.
- **Stratum Interface** on this service's page is green.

**Stratum Interface stays amber until your node has finished syncing**, and that
is correct rather than a fault. DATUM does not open its Stratum port until it has
its first block template, and a node still downloading the chain has none to give.
The check says so rather than going red, because red would send you looking for a
problem in the gateway.

## Seeing your miners

The dashboard's **Clients** page lists everything connected: worker name, share
difficulty, accepted and rejected shares, and hashrate. That is the page that
answers "is my miner actually working".

It asks for a username and password. The username is `admin`, and the password is
in the **Dashboard Password** action, which also lets you change it. A password is
created for you when the service is installed, so this works without any setup.

## Asking for a starting difficulty

If you rent hashrate, you can ask this gateway to start a connection at a
particular share difficulty by sending it as the Stratum password, in the form
`d=1024`. Use `fd=1024` to pin it there and stop it adjusting.

Rented hashrate is billed by the hour and the ordinary difficulty search wastes
the first minutes of it. This is a plain password field on every rental service,
so it works without either side supporting anything new, and a gateway that does
not understand it simply ignores it. The value is rounded down to a power of two
and is a floor, not a ceiling.

## Changing settings

The **Config** actions hold the gateway's settings, grouped the way the official
Datum Gateway service groups them: Bitcoind, Stratum, Mining, API, Logger and
DATUM Pool. Anything you leave blank keeps the gateway's own default, so you can
change one thing without having to fill in the rest.

Two settings are not in there, because this service manages them for you: where
your block rewards go (**Set Payout Address**) and the dashboard password
(**Dashboard Password**).
