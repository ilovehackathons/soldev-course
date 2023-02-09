// Go ahead and create a script from scratch that will allow you to transfer SOL from one account to another on Devnet. Be sure to print out the transaction signature so you can look at it on the Solana Explorer.

import web3 = require("@solana/web3.js");
import Dotenv from "dotenv";
// import { readFileSync } from "node:fs";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import chalk from "chalk";

Dotenv.config();

function retrieveExistingAccounts(): web3.Keypair[] {
  // const fileContent = readFileSync("accounts.json", "utf-8");
  const secretKeys = JSON.parse(process.env.ACCOUNTS!) as number[][];
  const keyPairs = secretKeys.map((sk) =>
    web3.Keypair.fromSecretKey(Uint8Array.from(sk))
  );
  return keyPairs;
}

async function main() {
  const accounts = retrieveExistingAccounts();
  if (accounts.length) {
    console.log("Choose an account to send SOL from:\n");
    accounts.forEach((a) => console.log(`- ${a.publicKey.toString()}`));
    console.log();
  }

  const rl = readline.createInterface({ input, output });
  const choice = await rl.question(
    "Press Enter to create a new account.\n\n> "
  );

  let account: web3.Keypair | undefined = undefined;

  if (choice === "") {
    account = web3.Keypair.generate();
    console.log(chalk.green("\nCreated a new account."));
    console.log(`\nSender: ${account.publicKey.toString()}`);
  } else if (
    (account = accounts.find((a) => a.publicKey.toString() === choice))
  ) {
    console.log(`\nSender: ${account.publicKey.toString()}`);
  } else {
    console.log(chalk.red(`\nUnknown account: ${choice}. Exiting.`));
    process.exit(1);
  }

  const recipientInput = await rl.question("\nRecipient?\n\n> ");

  if (/^\s*$/.test(recipientInput)) {
    console.error(chalk.red("\nRecipient is required. Exiting."));
    process.exit(1);
  }

  const amount = +(await rl.question("\nAmount (in SOL)?\n\n> "));
  if (!(amount >= 0)) {
    console.error(chalk.red(`\nInvalid amount: ${amount}. Exiting.`));
    process.exit(1);
  }

  try {
    const recipient = new web3.PublicKey(recipientInput);
    try {
      const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
      // await connection.requestAirdrop(account.publicKey, web3.LAMPORTS_PER_SOL*1)
      const transaction = new web3.Transaction();
      const sendSolInstruction = web3.SystemProgram.transfer({
        fromPubkey: account.publicKey,
        toPubkey: recipient,
        lamports: web3.LAMPORTS_PER_SOL * amount,
      });
      transaction.add(sendSolInstruction);
      console.log("\nSending...");
      const signature = await web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [account]
      );
      console.log(
        `\nSent ${amount} SOL from ${account.publicKey.toString()} to ${recipient.toString()}. See https://explorer.solana.com/tx/${signature}?cluster=devnet`
      );
    } catch (e) {
      console.error(chalk.red(`\n${e} Exiting.`));
      process.exit(1);
    }
  } catch {
    console.error(chalk.red("\nInvalid recipient. Exiting."));
    process.exit(1);
  }
}

main()
  .then(() => {
    // console.log("Finished successfully");
  })
  .catch((error) => {
    console.error(error);
  });
