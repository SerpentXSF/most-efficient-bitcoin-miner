import type { Metadata } from "next";
import { EfficiencyIndex } from "./efficiency-index";

export const metadata: Metadata = {
  title: "ASIC Efficiency Index — Bitcoin Miners Ranked by J/TH",
  description: "Compare SHA-256 Bitcoin mining ASICs by joules per terahash, hashrate per watt, power draw, and estimated electricity cost.",
};

export default function Home() {
  return <EfficiencyIndex />;
}
