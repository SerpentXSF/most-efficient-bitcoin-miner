import type { Metadata } from "next";
import { EfficiencyIndex } from "./efficiency-index";

export const metadata: Metadata = {
  title: "ASIC Efficiency & Hosting Index — Bitcoin Mining Compared",
  description: "Compare SHA-256 Bitcoin miners by J/TH and source-linked hosting providers by electricity rate, monthly cost per terahash, and hosted-machine cost.",
};

export default function Home() {
  return <EfficiencyIndex />;
}

