# swap.io-keys
https://keys.swap.io

This repo is responsible for key storage, signing of transactions and messages, creation of profiles (root keys).

Main functionality:

1. Create profile (bip39 - based).
2. Create wallet (bip 32 - pair of derived subkeys).
3. Sign transaction
4. Sign message
5. Get list of wallets

The functionality of this repo is limited to keeping the secrets and working with the cryptography.

This is done for the isolation of both the code and the limitation of access to sensitive part of the infrastructure.
