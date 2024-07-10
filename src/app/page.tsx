import styles from "./page.module.css";
import Link from "next/link";
import React from "react";
import {AnimatedLogo} from "@/app/components/logo/Logo";


export default function LandingPage() {
  return (
      <main className={styles.main}>
          <AnimatedLogo size={15}/>
          <div className={styles.description}>
              <h1>Elden Ring Boss Tracker</h1>
              <label>Keep track of all your accomplishments</label>
          </div>
          <div className={styles["app-links"]}>
              <Link href={"/home"} className={styles["home-link"]}>Start</Link>
          </div>
      </main>
  );
}
