import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { FC, useState } from "react";
import styles from "../styles/PingButton.module.css";

export const PingButton: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [sig, setSig] = useState<string>();

  const onClick = () => {
    // console.log("Ping!");
    if (!connection || !publicKey) {
      return;
    }

    const programId = new web3.PublicKey(
      "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa"
    );
    const programDataAccount = new web3.PublicKey(
      "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod"
    );
    const transaction = new web3.Transaction();

    const instruction = new web3.TransactionInstruction({
      keys: [
        {
          pubkey: programDataAccount,
          isSigner: false,
          isWritable: true,
        },
      ],
      programId,
    });

    transaction.add(instruction);
    sendTransaction(transaction, connection).then((sig) => {
      console.log(sig);
      setSig(sig);
    });
  };

  if (!connection || !publicKey) {
    return null;
  }

  return (
    <div className={styles.buttonContainer}>
      <button className={styles.button} onClick={onClick}>
        Ping!
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
