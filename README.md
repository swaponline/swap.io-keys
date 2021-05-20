# Keys layer

https://keys.swap.io

localStorage-based simple multicurrency key storage. This part of swap.io is responsible
for storage of keys and signing messages. This includes blockchain-aware generation and signing
algorithms but all the cryptography inside this repo is offline. To interact with the actual 
blockchain you need connections to networks.

The keys layer is isolated from the rest of repository for additional security.


Main repo interacts with this via cross-frame 
[window.postMessage()](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) routines

The routines are wrapped in the following methods:

### createProfile()

Creates a new profile - basically a pair of ECDSA keys. This profile is saved encrypted
in local storage on the domain (keys.swap.io) and can further be referenced to sign txs.

This method pops an iframe on your website with dialog to create a new profile.

### createAddresses()

Creates one or more blockchain addresses.

### sign()

Signs a transaction for an address.

### signMessage()

Signs a message by an address.

### publicKey()

Returns public key for a specific address.

### privateKey()

0. Pops up a dialog on your website with private key for specific address.
1. Create profile (bip39 - based).
2. Create wallet (bip 32 - pair of derived subkeys).
3. Sign transaction
4. Sign message
5. Get list of wallets

Pops up a dialog on your website with private key for specific address.


### backupProfile()

Pops up a dialog to backup a profile.
