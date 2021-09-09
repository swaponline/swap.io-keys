/* eslint-disable */
import * as Cardano from "cardano-wallet";

const  generateAddress = (options) => {
  const { seed, derivePath } = options

  console.log('>>>>>>>>>>>>>>>>>>>>>>>>')
  console.log('>>> options', options)
  const MNEMONICS = "crowd captain hungry tray powder motor coast oppose month shed parent mystery torch resemble index";
  const PASSWORD = "Cardano Rust for the winners!";
   
  // to connect the wallet to mainnet
  let settings = Cardano.BlockchainSettings.mainnet();
  console.log('>> settings', settings)
  // recover the entropy
  let entropy = Cardano.Entropy.from_english_mnemonics(MNEMONICS);
  console.log('>>>> entropy', entropy)
  // recover the wallet
  let wallet = Cardano.Bip44RootPrivateKey.recover(entropy, PASSWORD);
  console.log('>>>> wallet', wallet)
  // create a wallet account
  let account = wallet.bip44_account(Cardano.AccountIndex.new(0 | 0x80000000));
  console.log('>>> account', account)
  let account_public = account.public();
  console.log('>>> account_public', account_public)
  // create an address
  let chain_pub = account_public.bip44_chain(false);
  console.log('>> chain_pub', chain_pub)
  let key_pub = chain_pub.address_key(Cardano.AddressKeyIndex.new(0));
  console.log('>>> key_pub', key_pub)
  let address = key_pub.bootstrap_era_address(settings);
  console.log('>>> address', address)
  /*
  return {
    privateKey,
    publicKey,
    address,
  }
  */
}



export default generateAddress