import type { NextPage } from "next";
import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import AddressForm from "../components/AddressForm";
import WalletContextProvider from "../components/WalletContextProvider";
import { AppBar } from "../components/AppBar";
import { SendSolForm } from "../components/SendSolForm";

const Home: NextPage = () => {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");

  const addressSubmittedHandler = (address: string) => {
    setAddress(address);
    setBalance(1000);
  };

  return (
    <div className={styles.App}>
      {/* <header className={styles.AppHeader}>
        <p>
          Start Your Solana Journey
        </p>
        <AddressForm handler={addressSubmittedHandler} />
        <p>{`Address: ${address}`}</p>
        <p>{`Balance: ${balance} SOL`}</p>
      </header> */}
      <Head>
        <title>Wallet-Adapter Example</title>
        <meta name="description" content="Wallet-Adapter Example" />
      </Head>
      <WalletContextProvider>
        <AppBar />
        <div className={styles.AppBody}>
          {/* <PingButton /> */}
          <SendSolForm />
        </div>
      </WalletContextProvider>
    </div>
  );
};

export default Home;
