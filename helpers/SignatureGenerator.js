const { ethers } = require('ethers');

// Tạo một wallet mới
const wallet = ethers.Wallet.createRandom();
const privateKey = wallet.privateKey;
const walletAddress = wallet.address;

// Tạo challenge text
const challengeText = 'Please sign this message to log in.';

// Tạo chữ ký
async function signChallenge(challenge, wallet) {
  const signature = await wallet.signMessage(challenge);
  return signature;
}

signChallenge(challengeText, wallet).then(signature => {
  console.log('Private Key:', privateKey);
  console.log('Wallet Address:', walletAddress);
  console.log('Signature:', signature);
});
