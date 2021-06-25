export default {
  "name": "Binance Smart Chain",
  "inherit_from": "bitcoin",
  "is_testnet": false,
  "is_ethereum": true,
  "coin": {
    "symbol": "BNB",
    "slug": "binance-coin",
    "name": "binance coin",
    "name_plural": "binance coins",
    "denominator": 1e-18
  },
  "bip32": {
    "bip44": {
      "default": true,
      "purpose": "44'",
      "cointype": "60'"
    }
  },
  "prefixes": {
    "message": "\u0019Ethereum Signed Message:\n",
    "p2pkh": "00",
    "wif": "80"
  }
}