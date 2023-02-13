import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { FC, useState } from "react";
import styles from "../styles/SendSolForm.module.css";
import chalk from "chalk";

export const SendSolForm: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [sig, setSig] = useState<string>();

  async function handleSend() {
    if (!connection || !publicKey) {
      return;
    }
    try {
      const recipient = new web3.PublicKey(solRecipient);
      try {
        const transaction = new web3.Transaction();
        const sendSolInstruction = web3.SystemProgram.transfer({
          fromPubkey: /* account. */ publicKey,
          toPubkey: recipient,
          lamports: web3.LAMPORTS_PER_SOL * solAmount,
        });
        transaction.add(sendSolInstruction);
        console.log("\nSending...");
        const signature = await sendTransaction(transaction, connection)
          .then((sig) => {
            // console.log(sig);
            console.log(
              `\nSent ${solAmount} SOL from ${publicKey.toString()} to ${recipient.toString()}. See https://explorer.solana.com/tx/${sig}?cluster=devnet`
            );
            setSig(sig);
          })
          .catch((e) => {
            console.error(chalk.red(`\n${e} Exiting.`));
          });
      } catch (e) {
        console.error(chalk.red(`\n${e} Exiting.`));
        // process.exit(1);
      }
    } catch {
      console.error(chalk.red("\nInvalid recipient. Exiting."));
      // process.exit(1);
    }
  }

  const [solAmount, setSolAmount] = useState(0.01);
  const [solRecipient, setSolRecipient] = useState("");

  if (!connection || !publicKey) {
    return null;
  }

  return (
    <div
      style={{
        color: "white",
        display: "flex",
        flexDirection: "column",
        gap: "1em",
        textAlign: "center",
        fontSize: ".8em",
      }}
    >
      <p style={{ margin: 0, fontSize: "1.2em" }}>Balance: 2.279975</p>
      <label
        style={{ display: "flex", flexDirection: "column", fontSize: "0.8em" }}
      >
        Amount (in SOL) to send:
        <input
          value={solAmount}
          type="number"
          onChange={(e) => setSolAmount(+e.target.value)}
          style={{ padding: ".25em" }}
          step={0.01}
        />
      </label>
      <label
        style={{ display: "flex", flexDirection: "column", fontSize: "0.8em" }}
      >
        Send SOL to:
        <input
          value={solRecipient}
          onChange={(e) => setSolRecipient(e.target.value)}
          style={{ padding: ".25em" }}
        />
      </label>
      <button
        style={{ width: "fit-content", alignSelf: "center", padding: ".5em" }}
        onClick={handleSend}
      >
        Send
      </button>
      {sig && (
        <a
          href={`https://explorer.solana.com/tx/${sig}?cluster=devnet`}
          className={styles.link}
          target="_blank"
          rel="noreferrer"
        >
          See the transaction on Solana Explorer.
        </a>
      )}
    </div>
  );
};
