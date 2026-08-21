"use client";

import { useEffect, useMemo, useState } from "react";

type Cooling = "Air" | "Hydro" | "Immersion";
type Miner = {
  maker: string; model: string; hashrate: number; watts: number; jth: number;
  slug?: string;
  cooling: Cooling; year: number; source: string; sourceName: string; status?: "Shipping" | "Announced";
  segment?: "Industrial" | "Home";
  note?: string;
  mode?: string;
  noise?: string;
  voltage?: string;
  powerBoundary?: "Wall" | "Board";
  confidence?: "Manufacturer" | "Catalog" | "Open hardware" | "Independent test";
  video?: { url: string; title: string };
};

type Preset = "All" | "Under 100 W" | "Under 500 W" | "120 V" | "Quiet" | "SerpentX tested";

const miners: Miner[] = [
  { maker:"Bitdeer", model:"SEALMINER A4 Ultra Hydro", hashrate:886, watts:8373, jth:9.45, cooling:"Hydro", year:2026, source:"https://www.bitdeer.com/shop/explorer", sourceName:"Bitdeer", status:"Announced" },
  { maker:"Bitmain", model:"Antminer S23 Hydro", hashrate:580, watts:5510, jth:9.5, cooling:"Hydro", year:2025, source:"https://file12.bitmain.com/shop-product-s3/firmware/807d3b27-f625-470f-a940-247f83b36854/2025/06/20/14/S23%20Hyd.%20Product%20Manual_v1.0.6.pdf", sourceName:"Bitmain" },
  { maker:"Bitmain", model:"Antminer U3S23H", hashrate:1160, watts:11020, jth:9.5, cooling:"Hydro", year:2025, source:"https://www.bitmain.com/en/", sourceName:"Bitmain" },
  { maker:"Bitmain", model:"Antminer S23e U2H", hashrate:865, watts:8650, jth:10, cooling:"Hydro", year:2025, source:"https://www.bitmain.com/en/", sourceName:"Bitmain" },
  { maker:"Bitdeer", model:"SEALMINER A4 Pro Air", hashrate:336, watts:3662, jth:10.9, cooling:"Air", year:2026, source:"https://www.bitdeer.com/shop/explorer", sourceName:"Bitdeer", status:"Announced" },
  { maker:"Bitdeer", model:"SEALMINER A4 Pro Hydro", hashrate:680, watts:7412, jth:10.9, cooling:"Hydro", year:2026, source:"https://www.bitdeer.com/shop/explorer", sourceName:"Bitdeer", status:"Announced" },
  { maker:"Bitmain", model:"Antminer S21 XP+ Hydro", hashrate:500, watts:5500, jth:11, cooling:"Hydro", year:2025, source:"https://www.bitmain.com/en/", sourceName:"Bitmain" },
  { maker:"Bitmain", model:"Antminer S21 XP Hydro", hashrate:473, watts:5676, jth:12, cooling:"Hydro", year:2024, source:"https://support.bitmain.com/hc/en-us/articles/34523540504857-S21-XP-Hyd-Specification", sourceName:"Bitmain" },
  { maker:"Bitmain", model:"Antminer S21j XP Hydro", hashrate:495, watts:5940, jth:12, cooling:"Hydro", year:2025, source:"https://www.bitmain.com/en/", sourceName:"Bitmain" },
  { maker:"Bitdeer", model:"SEALMINER A3 Pro Hydro", hashrate:660, watts:8250, jth:12.5, cooling:"Hydro", year:2025, source:"https://www.bitdeer.com/shop/explorer", sourceName:"Bitdeer" },
  { maker:"Bitmain", model:"Antminer S21e XP Hydro", hashrate:430, watts:5590, jth:13, cooling:"Hydro", year:2025, source:"https://www.bitmain.com/en/", sourceName:"Bitmain" },
  { maker:"Bitmain", model:"Antminer S21 XP", hashrate:270, watts:3645, jth:13.5, cooling:"Air", year:2024, source:"https://support.bitmain.com/hc/en-us/articles/35383015643673-S21-XP-Specifications", sourceName:"Bitmain" },
  { maker:"Bitdeer", model:"SEALMINER A3 Hydro", hashrate:500, watts:6750, jth:13.5, cooling:"Hydro", year:2025, source:"https://www.bitdeer.com/shop/explorer", sourceName:"Bitdeer" },
  { maker:"Bitdeer", model:"SEALMINER A2 Pro Air", hashrate:260, watts:3874, jth:14.9, cooling:"Air", year:2025, source:"https://www.bitdeer.com/announcement/new-release-sealminer-a2-pro--achieves-power-efficiency-ratio-of-149-jth", sourceName:"Bitdeer" },
  { maker:"Bitdeer", model:"SEALMINER A2 Pro Hydro", hashrate:500, watts:7450, jth:14.9, cooling:"Hydro", year:2025, source:"https://www.bitdeer.com/shop/product/P250824000002", sourceName:"Bitdeer" },
  { maker:"Bitmain", model:"Antminer S21 Pro", hashrate:234, watts:3510, jth:15, cooling:"Air", year:2024, source:"https://www.asicminervalue.com/miners/bitmain/antminer-s21-pro-234th", sourceName:"ASIC Miner Value" },
  { maker:"Bitmain", model:"Antminer S21 Hydro", hashrate:335, watts:5360, jth:16, cooling:"Hydro", year:2024, source:"https://www.bitdeer.com/shop/explorer", sourceName:"Bitdeer Explorer" },
  { maker:"Bitdeer", model:"SEALMINER A2", hashrate:226, watts:3729, jth:16.5, cooling:"Air", year:2024, source:"https://www.bitdeer.com/shop/explorer", sourceName:"Bitdeer Explorer" },
  { maker:"MicroBT", model:"WhatsMiner M63S", hashrate:406, watts:7511, jth:18.5, cooling:"Hydro", year:2024, source:"https://www.bitdeer.com/shop/explorer", sourceName:"Bitdeer Explorer" },
  { maker:"MicroBT", model:"WhatsMiner M60S", hashrate:184, watts:3404, jth:18.5, cooling:"Air", year:2024, source:"https://www.bitdeer.com/shop/explorer", sourceName:"Bitdeer Explorer" },
  { maker:"Bitmain", model:"Antminer T21", hashrate:190, watts:3610, jth:19, cooling:"Air", year:2024, source:"https://www.bitdeer.com/shop/explorer", sourceName:"Bitdeer Explorer" },
  { maker:"Canaan", model:"Avalon A1466I", hashrate:170, watts:3320, jth:19.53, cooling:"Immersion", year:2024, source:"https://www.hashrate.no/asics", sourceName:"Hashrate.no" },
  { maker:"Bitmain", model:"Antminer S19 XP", hashrate:141, watts:3010, jth:21.35, cooling:"Air", year:2022, source:"https://www.asicminervalue.com/", sourceName:"ASIC Miner Value" },
  { maker:"Bitmain", model:"Antminer S19k Pro", hashrate:120, watts:2760, jth:23, cooling:"Air", year:2023, source:"https://www.bitdeer.com/shop/explorer", sourceName:"Bitdeer Explorer" },
  { maker:"FutureBit", model:"Apollo III — Super Eco", slug:"futurebit-apollo-iii-comparison-mode", hashrate:12.2, watts:172, jth:14.1, cooling:"Air", year:2026, segment:"Home", mode:"Super Eco", note:"SerpentX Tech test result · published Aug 20, 2026", confidence:"Independent test", source:"https://youtu.be/HLWiE5i1kwc?si=995ujHKEtJvFQFub", sourceName:"SerpentX Tech", video:{url:"https://youtu.be/HLWiE5i1kwc?si=995ujHKEtJvFQFub",title:"FutureBit Apollo III — hands-on test and operating modes"} },
  { maker:"FutureBit", model:"Apollo III — Balance Mode", slug:"futurebit-apollo-iii-15-22-th-s-profile", hashrate:15.32, watts:255, jth:16.64, cooling:"Air", year:2026, segment:"Home", mode:"Balance Mode", note:"SerpentX Tech test result · published Aug 20, 2026", confidence:"Independent test", source:"https://youtu.be/HLWiE5i1kwc?si=995ujHKEtJvFQFub", sourceName:"SerpentX Tech", video:{url:"https://youtu.be/HLWiE5i1kwc?si=995ujHKEtJvFQFub",title:"FutureBit Apollo III — hands-on test and operating modes"} },
  { maker:"FutureBit", model:"Apollo II — efficiency mode", hashrate:10, watts:280, jth:28, cooling:"Air", year:2024, segment:"Home", note:"Best advertised efficiency", mode:"Efficiency", confidence:"Manufacturer", powerBoundary:"Board", source:"https://www.futurebit.io/apollo-ii", sourceName:"FutureBit", video:{url:"https://www.youtube.com/watch?v=SNQpJmxrf8I",title:"Futurebit Apollo II — How to replace Control board"} },
  { maker:"FutureBit", model:"Apollo BTC (Gen I)", hashrate:3, watts:180, jth:60, cooling:"Air", year:2021, segment:"Home", note:"Approximate manufacturer comparison", source:"https://www.futurebit.io/apollo-btc", sourceName:"FutureBit" },
  { maker:"Canaan", model:"Avalon Q", hashrate:90, watts:1674, jth:18.6, cooling:"Air", year:2025, segment:"Home", status:"Shipping", mode:"Rated", confidence:"Manufacturer", powerBoundary:"Wall", source:"https://shop.canaan.io/products/avalon-q-1", sourceName:"Canaan" },
  { maker:"Canaan", model:"Avalon Mini 3", hashrate:37.5, watts:800, jth:21.33, cooling:"Air", year:2025, segment:"Home", status:"Shipping", mode:"Super / mining", noise:"33–55 dB", voltage:"110–240 V", confidence:"Manufacturer", powerBoundary:"Wall", source:"https://shop.canaan.io/products/avalon-mini-3", sourceName:"Canaan" },
  { maker:"Canaan", model:"Avalon Nano 3", hashrate:4, watts:116, jth:29, cooling:"Air", year:2024, segment:"Home", mode:"Rated efficiency point", noise:"33–36 dB", voltage:"28 V DC", note:"116 W implied by Canaan's 4 TH/s at 29 J/TH rating; 140 W maximum", confidence:"Manufacturer", source:"https://shop.canaan.io/products/avalon-nano-3", sourceName:"Canaan" },
  { maker:"Braiins", model:"Mini Miner BMM 101", hashrate:1, watts:40, jth:40, cooling:"Air", year:2024, segment:"Home", status:"Shipping", mode:"Default", noise:"~40 dB", voltage:"100–240 V", confidence:"Manufacturer", powerBoundary:"Wall", source:"https://braiins.com/hardware/mini-miner-bmm-100", sourceName:"Braiins" },
  { maker:"Braiins", model:"Mini Miner BMM 100", hashrate:1, watts:40, jth:40, cooling:"Air", year:2024, segment:"Home", mode:"Default", noise:"Quiet", voltage:"100–240 V", confidence:"Manufacturer", powerBoundary:"Wall", source:"https://braiins.com/blog/braiins-ecosystem", sourceName:"Braiins" },
  { maker:"Heatbit", model:"Trio", hashrate:10, watts:400, jth:40, cooling:"Air", year:2025, segment:"Home", status:"Shipping", mode:"Mining", noise:"Up to 45 dB", note:"400 W mining draw; 1,500 W total with supplemental heating", confidence:"Manufacturer", powerBoundary:"Wall", source:"https://heatbit.com/products/heatbit-trio", sourceName:"Heatbit" },
  { maker:"GekkoScience", model:"KBox — medium mode", hashrate:17, watts:242, jth:14.24, cooling:"Air", year:2026, segment:"Home", source:"https://altairtech.io/product/gekkoscience-kbox-bitcoin-miner/", sourceName:"Altair Tech" },
  { maker:"NerdQ", model:"NerdQAxe++ Rev 7", hashrate:4.8, watts:69.5, jth:14.48, cooling:"Air", year:2026, segment:"Home", confidence:"Open hardware", source:"https://www.solosatoshi.com/product/nerdqaxe-plus-plus/", sourceName:"Solo Satoshi", video:{url:"https://www.youtube.com/watch?v=c_tXj9E7Bxw",title:"NerdQAxe++ Rev 7 from Solo Satoshi"} },
  { maker:"GekkoScience", model:"KBox — high mode", hashrate:22, watts:322, jth:14.64, cooling:"Air", year:2026, segment:"Home", source:"https://altairtech.io/product/gekkoscience-kbox-bitcoin-miner/", sourceName:"Altair Tech" },
  { maker:"Bitaxe", model:"Gamma 601", hashrate:1.2, watts:18, jth:15, cooling:"Air", year:2025, segment:"Home", mode:"Rated", confidence:"Open hardware", source:"https://www.bitaxehardware.com/601", sourceName:"Bitaxe Hardware", video:{url:"https://www.youtube.com/watch?v=INjBszAtARo",title:"1.5 TH/s Bitaxe Bitcoin Miner out of the box"} },
  { maker:"Jingle Miner", model:"BTC HashCard", hashrate:12.5, watts:200, jth:16, cooling:"Air", year:2026, segment:"Home", source:"https://app.luxor.tech/en/hardware/catalog/btc-hashcard", sourceName:"Luxor Hardware" },
  { maker:"Hammer Miner", model:"BC04", hashrate:6, watts:96, jth:16, cooling:"Air", year:2026, segment:"Home", source:"https://altairtech.io/product/hammer-miner-bc04-home-bitcoin-miner/", sourceName:"Altair Tech" },
  { maker:"Bitaxe", model:"Gamma Hex", hashrate:8.4, watts:140, jth:16.67, cooling:"Hydro", year:2026, segment:"Home", source:"https://www.solosatoshi.com/product/bitaxe-gamma-hex/", sourceName:"Solo Satoshi" },
  { maker:"Bitaxe", model:"Supra 400", hashrate:0.7, watts:12, jth:17.14, cooling:"Air", year:2024, segment:"Home", source:"https://d-central.tech/bitaxe-supra-vs-gamma-vs-hex-vs-gt/", sourceName:"D-Central" },
  { maker:"NerdQ", model:"NerdQAxe+", hashrate:2.5, watts:55, jth:22, cooling:"Air", year:2025, segment:"Home", source:"https://github.com/shufps/qaxe", sourceName:"Open hardware repo" },
  { maker:"Canaan", model:"Avalon Nano 3S", hashrate:6, watts:140, jth:23.33, cooling:"Air", year:2025, segment:"Home", source:"https://shop.canaan.io/products/avalon-nano-3", sourceName:"Canaan" },
  { maker:"NerdAxe", model:"NerdAxe BM1366", hashrate:0.5, watts:12, jth:24, cooling:"Air", year:2024, segment:"Home", source:"https://d-central.tech/product/the-nerdaxe/", sourceName:"D-Central" },
  { maker:"Bitaxe", model:"Ultra 200", hashrate:0.5, watts:15, jth:30, cooling:"Air", year:2023, segment:"Home", source:"https://d-central.tech/miners/bitaxe-ultra/", sourceName:"D-Central" },
  { maker:"Bitaxe", model:"Ultra Hex", hashrate:3, watts:90, jth:30, cooling:"Air", year:2024, segment:"Home", source:"https://d-central.tech/product/the-bitaxe-hex/", sourceName:"D-Central" },
  { maker:"GekkoScience", model:"Compac F USB", hashrate:0.25, watts:10, jth:40, cooling:"Air", year:2021, segment:"Home", source:"https://www.gekkoscience.com/product/compac-f/", sourceName:"GekkoScience" },
  { maker:"Goldshell", model:"BYTE + XT Card", hashrate:1, watts:110, jth:110, cooling:"Air", year:2026, segment:"Home", source:"https://www.jinglemining.com/company/newsblogs/goldshell-byte-xt-sha256d-miner-review-2026?lang=en", sourceName:"Jingle Mining" },
];

type SortKey = "jth" | "hashPerKw" | "hashrate" | "watts";

const efficiencyFor = (miner: Miner) => miner.watts / miner.hashrate;
const formulaDelta = (miner: Miner) => Math.abs(efficiencyFor(miner) - miner.jth) / miner.jth;
const slugFor = (miner: Miner) => miner.slug ?? `${miner.maker}-${miner.model}`.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
const displayEfficiency = (value: number) => value.toFixed(value < 10 ? 2 : value < 100 ? 1 : 0);
const isQuiet = (miner: Miner) => {
  if (!miner.noise) return false;
  const levels = miner.noise.match(/\d+/g)?.map(Number) ?? [];
  return /quiet/i.test(miner.noise) || (levels.length > 0 && Math.max(...levels) <= 45);
};
const supports120v = (miner: Miner) => {
  if (!miner.voltage) return false;
  const values = miner.voltage.match(/\d+/g)?.map(Number) ?? [];
  return miner.voltage.includes("120") || (values.length >= 2 && Math.min(...values) <= 120 && Math.max(...values) >= 120);
};

function confidenceFor(miner: Miner): NonNullable<Miner["confidence"]> {
  if (miner.confidence) return miner.confidence;
  if (["Bitmain","Bitdeer","Canaan","FutureBit","GekkoScience","Braiins","Heatbit"].includes(miner.sourceName)) return "Manufacturer";
  if (miner.sourceName === "Open hardware repo") return "Open hardware";
  return "Catalog";
}

export function EfficiencyIndex() {
  const [query, setQuery] = useState("");
  const [cooling, setCooling] = useState<"All" | Cooling>("All");
  const [segment, setSegment] = useState<"All" | "Industrial" | "Home">("All");
  const [sort, setSort] = useState<SortKey>("jth");
  const [powerPrice, setPowerPrice] = useState(0.07);
  const [visible, setVisible] = useState(12);
  const [preset, setPreset] = useState<Preset>("All");
  const [compare, setCompare] = useState<string[]>([]);
  const [activeSlug, setActiveSlug] = useState("");
  const [tool, setTool] = useState<"" | "profitability">("");
  const [urlReady, setUrlReady] = useState(false);
  const [hashprice, setHashprice] = useState(50);
  const [poolFee, setPoolFee] = useState(2);

  useEffect(() => {
    const readUrl = () => {
      const params = new URLSearchParams(window.location.search);
      setActiveSlug(params.get("miner") ?? "");
      setTool(params.get("tool") === "profitability" ? "profitability" : "");
      setQuery(params.get("q") ?? "");
      const urlSegment = params.get("segment");
      if (urlSegment === "Home" || urlSegment === "Industrial") setSegment(urlSegment);
      const urlPreset = params.get("preset") as Preset | null;
      if (["Under 100 W","Under 500 W","120 V","Quiet","SerpentX tested"].includes(urlPreset ?? "")) setPreset(urlPreset!);
    };
    readUrl();
    setUrlReady(true);
    window.addEventListener("popstate", readUrl);
    return () => window.removeEventListener("popstate", readUrl);
  }, []);

  useEffect(() => {
    if (!urlReady) return;
    const params = new URLSearchParams(window.location.search);
    query ? params.set("q",query) : params.delete("q");
    segment !== "All" ? params.set("segment",segment) : params.delete("segment");
    preset !== "All" ? params.set("preset",preset) : params.delete("preset");
    activeSlug ? params.set("miner",activeSlug) : params.delete("miner");
    tool ? params.set("tool",tool) : params.delete("tool");
    const next = `${window.location.pathname}${params.size ? `?${params}` : ""}${activeSlug || tool ? "" : window.location.hash}`;
    window.history.replaceState({},"",next);
  }, [query, segment, preset, activeSlug, tool, urlReady]);

  const ranked = useMemo(() => {
    const q = query.trim().toLowerCase();
    return miners.filter(m => {
      const presetMatch = preset === "All" ||
        (preset === "Under 100 W" && m.watts < 100) ||
        (preset === "Under 500 W" && m.watts < 500) ||
        (preset === "120 V" && supports120v(m)) ||
        (preset === "Quiet" && isQuiet(m)) ||
        (preset === "SerpentX tested" && Boolean(m.video));
      return presetMatch && (cooling === "All" || m.cooling === cooling) && (segment === "All" || (m.segment ?? "Industrial") === segment) && (!q || `${m.maker} ${m.model}`.toLowerCase().includes(q));
    })
      .sort((a,b) => sort === "jth" ? efficiencyFor(a)-efficiencyFor(b) : sort === "hashPerKw" ? (1000/efficiencyFor(b))-(1000/efficiencyFor(a)) : sort === "hashrate" ? b.hashrate-a.hashrate : a.watts-b.watts);
  }, [query, cooling, segment, sort, preset]);

  const best = [...miners].sort((a,b)=>efficiencyFor(a)-efficiencyFor(b))[0];
  const baseline = miners.find(m=>m.model === "Antminer S19k Pro")!;
  const annualSavings = ((baseline.watts - (baseline.hashrate * efficiencyFor(best))) / 1000) * 24 * 365 * powerPrice;
  const formulaWarnings = miners.filter(miner => formulaDelta(miner) > 0.015).length;
  const activeMiner = miners.find(miner => slugFor(miner) === activeSlug);
  const comparedMiners = compare.map(slug => miners.find(miner => slugFor(miner) === slug)).filter(Boolean) as Miner[];

  const openMiner = (miner: Miner) => {
    setActiveSlug(slugFor(miner));
    window.scrollTo({top:0,behavior:"smooth"});
  };
  const toggleCompare = (miner: Miner) => {
    const slug = slugFor(miner);
    setCompare(current => current.includes(slug) ? current.filter(item => item !== slug) : current.length < 4 ? [...current,slug] : current);
  };
  const exportData = (format: "json" | "csv") => {
    const records = miners.map(miner=>({...miner,calculatedJth:Number(efficiencyFor(miner).toFixed(3)),slug:slugFor(miner)}));
    const csv = ["rank,maker,model,hashrate_ths,power_w,calculated_jth,rated_jth,cooling,segment,year,source",...records.sort((a,b)=>a.calculatedJth-b.calculatedJth).map((miner,index)=>[index+1,miner.maker,miner.model,miner.hashrate,miner.watts,miner.calculatedJth,miner.jth,miner.cooling,miner.segment??"Industrial",miner.year,miner.source].map(value=>`"${String(value).replaceAll('"','""')}"`).join(","))].join("\n");
    const blob = new Blob([format === "json" ? JSON.stringify(records,null,2) : csv],{type:format === "json" ? "application/json" : "text/csv"});
    const link = document.createElement("a");
    link.href=URL.createObjectURL(blob);link.download=`asic-efficiency-index.${format}`;link.click();URL.revokeObjectURL(link.href);
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="ASIC Efficiency Index home"><span>₿</span> ASIC EFFICIENCY INDEX</a>
        <nav aria-label="Main navigation"><a href="#rankings">Rankings</a><a href="#calculator">Cost lab</a><a href="#methodology">Methodology</a><a href="?tool=profitability" onClick={e=>{e.preventDefault();setTool("profitability");window.scrollTo({top:0})}}>Profitability</a></nav>
        <div className="status"><i /> DATASET · AUG 2026</div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">THE POWER-TRUE ASIC LEADERBOARD</p>
          <h1>More hash.<br /><em>Less heat.</em></h1>
          <p className="lede">Bitcoin mining hardware ranked by energy efficiency—not short-term coin price, network luck, or hype.</p>
          <a className="jump" href="#rankings">Explore the rankings <span>↓</span></a>
        </div>
        <div className="metric-card" aria-label="Joules per terahash: lower is better">
          <span>LOWER IS BETTER</span><strong>J/TH</strong><small>joules per terahash</small>
        </div>
        <div className="hero-stats">
          <div><b>{miners.length}</b><span>SHA-256 models</span></div>
          <div><b>{efficiencyFor(best).toFixed(2)}</b><span>best J/TH</span></div>
          <div><b>{(1000/efficiencyFor(best)).toFixed(1)}</b><span>TH/s per kW</span></div>
        </div>
      </section>

      <section className="rankings" id="rankings">
        <div className="section-heading">
          <div><p className="eyebrow">THE INDEX</p><h2>Efficiency, ranked.</h2></div>
          <p>Lower J/TH means less electricity for the same Bitcoin hashrate. Hash per watt is the inverse view—higher is better.</p>
        </div>

        <div className="controls">
          <label className="search"><span>⌕</span><input value={query} onChange={e=>{setQuery(e.target.value);setVisible(12)}} placeholder="Search model or maker" aria-label="Search model or maker" /></label>
          <div className="pills" aria-label="Filter by miner class">{(["All","Industrial","Home"] as const).map(item=><button key={item} className={segment===item?"active":""} onClick={()=>{setSegment(item);setVisible(12)}}>{item === "All" ? "All rigs" : item === "Home" ? "Home / compact" : item}</button>)}</div>
          <label className="sort">Cooling <select value={cooling} onChange={e=>{setCooling(e.target.value as "All" | Cooling);setVisible(12)}}><option value="All">All types</option><option value="Air">Air</option><option value="Hydro">Hydro</option><option value="Immersion">Immersion</option></select></label>
          <label className="sort">Sort by <select value={sort} onChange={e=>setSort(e.target.value as SortKey)}><option value="jth">Lowest J/TH</option><option value="hashPerKw">Highest TH/kW</option><option value="hashrate">Highest hashrate</option><option value="watts">Lowest power</option></select></label>
        </div>
        <div className="quick-filters" aria-label="Quick filters">
          <span>QUICK VIEW</span>{(["All","Under 100 W","Under 500 W","120 V","Quiet","SerpentX tested"] as Preset[]).map(item=><button key={item} className={preset===item?"active":""} onClick={()=>{setPreset(item);setVisible(12)}}>{item}</button>)}
        </div>
        <div className="data-strip" aria-label="Dataset quality summary"><span><b>{miners.length}</b> source-linked records</span><span><b>{formulaWarnings ? `${formulaWarnings} discrepancies` : "Formula checked"}</b> W ÷ TH/s</span><span><b>Indexed</b> Aug 2026</span><a href="https://github.com/SerpentXSF/most-efficient-bitcoin-miner/issues/new?template=miner-submission.yml" target="_blank" rel="noreferrer">Submit miner data ↗</a></div>

        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Hardware</th><th>Cooling</th><th>Hashrate</th><th>Power</th><th>Hash / kW</th><th>Efficiency</th><th>24h power</th></tr></thead>
            <tbody>{ranked.slice(0,visible).map((miner, index) => {
              const dayCost = miner.watts / 1000 * 24 * powerPrice;
              const efficiency = efficiencyFor(miner);
              return <tr key={miner.model}>
                <td className="rank">{String(index+1).padStart(2,"0")}</td>
                <td className="hardware"><button className="model-link" onClick={()=>openMiner(miner)}>{miner.model}</button><span>{miner.maker} · {miner.year} {miner.segment === "Home" && <i>Home</i>} {miner.status && <i>{miner.status}</i>}</span>{(miner.mode || miner.noise || miner.voltage) && <small className="spec-meta">{[miner.mode,miner.noise,miner.voltage].filter(Boolean).join(" · ")}</small>}{miner.note && <small>{miner.note}</small>}<label className="compare-check"><input type="checkbox" checked={compare.includes(slugFor(miner))} onChange={()=>toggleCompare(miner)} disabled={!compare.includes(slugFor(miner)) && compare.length >= 4} /> Compare</label></td>
                <td><span className={`cooling ${miner.cooling.toLowerCase()}`}>{miner.cooling}</span></td>
                <td>{miner.hashrate.toLocaleString()} <small>TH/s</small></td>
                <td>{miner.watts.toLocaleString()} <small>W</small></td>
                <td>{(1000/efficiency).toFixed(1)} <small>TH/kW</small></td>
                <td className="efficiency"><b>{displayEfficiency(efficiency)}</b> <small>J/TH</small><span><i style={{width:`${Math.min(100, efficiency/30*100)}%`}} /></span>{formulaDelta(miner)>0.015 && <small className="flag">Rated {miner.jth} J/TH</small>}</td>
                <td><strong>${dayCost.toFixed(2)}</strong><small> @ ${powerPrice.toFixed(2)}/kWh</small><div className="row-links"><a href={miner.source} target="_blank" rel="noreferrer">Source ↗</a>{miner.video && <a className="watch-link" href={miner.video.url} title={miner.video.title} target="_blank" rel="noreferrer">Watch ▶</a>}</div><small className="confidence">{confidenceFor(miner)}{miner.powerBoundary ? ` · ${miner.powerBoundary} power` : ""}</small></td>
              </tr>;
            })}</tbody>
          </table>
          {!ranked.length && <div className="empty">No miners match those filters.</div>}
        </div>
        {visible < ranked.length && <button className="load-more" onClick={()=>setVisible(v=>v+12)}>Show {Math.min(12, ranked.length-visible)} more <span>＋</span></button>}
        <p className="result-count">Showing {Math.min(visible,ranked.length)} of {ranked.length} matching models</p>

        <div className="mobile-rankings" aria-label="Mobile miner rankings">{ranked.slice(0,visible).map((miner,index)=>{
          const efficiency=efficiencyFor(miner);
          return <article className="miner-card" key={`mobile-${miner.model}`}>
            <div className="miner-card-top"><span className="rank">{String(index+1).padStart(2,"0")}</span><span className={`cooling ${miner.cooling.toLowerCase()}`}>{miner.cooling}</span></div>
            <button className="model-link" onClick={()=>openMiner(miner)}>{miner.model}</button><small>{miner.maker} · {miner.year}</small>
            <div className="card-metrics"><div><b>{displayEfficiency(efficiency)}</b><span>J/TH</span></div><div><b>{miner.hashrate.toLocaleString()}</b><span>TH/s</span></div><div><b>{miner.watts.toLocaleString()}</b><span>Watts</span></div></div>
            <div className="card-actions"><button onClick={()=>openMiner(miner)}>View profile</button><label><input type="checkbox" checked={compare.includes(slugFor(miner))} onChange={()=>toggleCompare(miner)} disabled={!compare.includes(slugFor(miner)) && compare.length >= 4}/> Compare</label></div>
          </article>})}</div>
      </section>

      <section className="cost-lab" id="calculator">
        <div className="cost-copy"><p className="eyebrow">THE COST LAB</p><h2>Watts become bills.</h2><p>Set your all-in electricity rate to recalculate every miner’s 24-hour energy cost. Efficiency comparisons stay independent of BTC price and network difficulty.</p></div>
        <div className="calculator-card">
          <label>YOUR ELECTRICITY RATE <output>${powerPrice.toFixed(3)} / kWh</output></label>
          <input type="range" min="0.02" max="0.20" step="0.005" value={powerPrice} onChange={e=>setPowerPrice(Number(e.target.value))} aria-label="Electricity rate in dollars per kilowatt hour" />
          <div className="range-labels"><span>$0.02</span><span>$0.20</span></div>
          <div className="saving"><span>Potential annual electricity difference*</span><strong>${annualSavings.toLocaleString(undefined,{maximumFractionDigits:0})}</strong><small>A4 Ultra efficiency vs. S19k Pro at equal 120 TH/s output</small></div>
        </div>
      </section>

      <section className="methodology" id="methodology">
        <div><p className="eyebrow">READ THE SIGNAL</p><h2>One unit.<br />No guesswork.</h2></div>
        <div className="formula"><span>POWER (W)</span><b>÷</b><span>HASHRATE (TH/s)</span><b>=</b><strong>J/TH</strong></div>
        <div className="method-grid">
          <article><b>01</b><h3>Normalize</h3><p>Every model is converted to joules per terahash. Because 1 watt equals 1 joule per second, watts divided by TH/s gives J/TH directly.</p></article>
          <article><b>02</b><h3>Rank</h3><p>Lowest manufacturer-rated J/TH wins. Ties are kept as ties; hashrate doesn’t break them because scale and efficiency are different questions.</p></article>
          <article><b>03</b><h3>Verify</h3><p>Primary specifications are preferred. Hashrate Index, WhatToMine, Hashrate.no, ASIC Miner Value, and specialist catalogs help cross-check gaps; every row links its source.</p></article>
        </div>
        <div className="notes"><strong>Important:</strong> Specifications are typical or advertised values, not independent lab measurements. J/TH is calculated automatically from the displayed power and hashrate. Mode, measurement boundary, ambient temperature, cooling infrastructure, PSU losses, and silicon variation can change wall efficiency. Announced hardware is labeled. This is an engineering comparison, not financial advice.</div>
        <div className="profitability-roadmap" id="roadmap"><span>SEPARATE DECISION TOOL</span><div><h3>Profitability has its own page.</h3><p>Market assumptions, hashprice, electricity rate, pool fees and timestamps stay separate from the durable efficiency index.</p><button onClick={()=>{setTool("profitability");window.scrollTo({top:0})}}>Open profitability lab →</button></div></div>
        <div className="data-download"><div><p className="eyebrow">OPEN DATA</p><h3>Take the index with you.</h3><p>Download the source-linked specifications and calculated efficiency values for your own analysis.</p></div><div><button onClick={()=>exportData("csv")}>Download CSV</button><button onClick={()=>exportData("json")}>Download JSON</button></div></div>
      </section>

      {compare.length > 0 && <aside className="compare-tray" aria-label="Miner comparison tray"><div><b>{compare.length}/4 selected</b><span>Compare efficiency, power and operating cost</span></div><button onClick={()=>setCompare([])}>Clear</button><button className="primary" onClick={()=>(document.getElementById("comparison") as HTMLDialogElement)?.showModal()}>Compare miners</button></aside>}

      <dialog id="comparison" className="comparison-dialog"><form method="dialog"><button className="dialog-close" aria-label="Close comparison">×</button></form><p className="eyebrow">SIDE-BY-SIDE</p><h2>Compare miners.</h2><div className="comparison-grid" id="comparison-grid">{comparedMiners.map(miner=>{const efficiency=efficiencyFor(miner);const annualKwh=miner.watts/1000*24*365;return <article key={miner.model}><button className="remove-compare" onClick={()=>toggleCompare(miner)} aria-label={`Remove ${miner.model}`}>×</button><small>{miner.maker}</small><h3>{miner.model}</h3><strong>{displayEfficiency(efficiency)} <span>J/TH</span></strong><dl><div><dt>Hashrate</dt><dd>{miner.hashrate.toLocaleString()} TH/s</dd></div><div><dt>Power</dt><dd>{miner.watts.toLocaleString()} W</dd></div><div><dt>Annual energy</dt><dd>{annualKwh.toLocaleString(undefined,{maximumFractionDigits:0})} kWh</dd></div><div><dt>Annual power cost</dt><dd>${(annualKwh*powerPrice).toLocaleString(undefined,{maximumFractionDigits:0})}</dd></div><div><dt>Measurement</dt><dd>{confidenceFor(miner)}{miner.powerBoundary?` · ${miner.powerBoundary}`:""}</dd></div></dl><button className="text-action" onClick={()=>{(document.getElementById("comparison") as HTMLDialogElement)?.close();openMiner(miner)}}>Full profile →</button></article>})}</div><p className="compare-note">Costs use ${powerPrice.toFixed(3)}/kWh from the Cost Lab. Annual figures assume continuous operation.</p></dialog>

      {activeMiner && <section className="profile-page" role="dialog" aria-modal="true" aria-label={`${activeMiner.model} profile`}><div className="profile-header"><button onClick={()=>setActiveSlug("")} className="back-link">← Back to rankings</button><span>PROFILE · INDEXED AUG 2026</span></div><div className="profile-hero"><div><p className="eyebrow">{activeMiner.maker} · {activeMiner.year}</p><h2>{activeMiner.model}</h2><div className="profile-badges"><span>{activeMiner.segment ?? "Industrial"}</span><span>{activeMiner.cooling}</span>{activeMiner.status&&<span>{activeMiner.status}</span>}{activeMiner.video&&<span className="tested">SerpentX video</span>}</div></div><div className="profile-efficiency"><span>CALCULATED EFFICIENCY</span><strong>{displayEfficiency(efficiencyFor(activeMiner))}</strong><small>J/TH · lower is better</small></div></div><div className="profile-body"><div className="profile-specs"><article><span>Hashrate</span><b>{activeMiner.hashrate.toLocaleString()} TH/s</b></article><article><span>Power</span><b>{activeMiner.watts.toLocaleString()} W</b></article><article><span>Hash per kW</span><b>{(1000/efficiencyFor(activeMiner)).toFixed(1)} TH/kW</b></article><article><span>24h power cost</span><b>${(activeMiner.watts/1000*24*powerPrice).toFixed(2)}</b></article></div><div className="profile-columns"><article><p className="eyebrow">OPERATING PROFILE</p><dl>{activeMiner.mode&&<div><dt>Mode</dt><dd>{activeMiner.mode}</dd></div>}{activeMiner.noise&&<div><dt>Noise</dt><dd>{activeMiner.noise}</dd></div>}{activeMiner.voltage&&<div><dt>Voltage</dt><dd>{activeMiner.voltage}</dd></div>}<div><dt>Power boundary</dt><dd>{activeMiner.powerBoundary ?? "Not specified"}</dd></div><div><dt>Source class</dt><dd>{confidenceFor(activeMiner)}</dd></div><div><dt>Reference efficiency</dt><dd>{activeMiner.jth} J/TH</dd></div></dl>{activeMiner.note&&<p className="profile-note">{activeMiner.note}</p>}<a className="source-button" href={activeMiner.source} target="_blank" rel="noreferrer">View data source ↗</a></article><article className="video-panel"><p className="eyebrow">HANDS-ON CONTEXT</p>{activeMiner.video?<><h3>{activeMiner.video.title}</h3><p>Watch SerpentX Tech’s coverage of this hardware for practical context beyond the specification sheet.</p><a href={activeMiner.video.url} target="_blank" rel="noreferrer">Watch on YouTube ▶</a></>:<><h3>No matching video yet.</h3><p>The profile stays focused on sourced specifications. Browse the channel for related home-mining coverage.</p><a href="https://www.youtube.com/@SerpentXTech" target="_blank" rel="noreferrer">Browse SerpentX Tech ▶</a></>}</article></div><div className="related"><p className="eyebrow">RELATED HARDWARE & MODES</p><div>{miners.filter(m=>m!==activeMiner&&(m.maker===activeMiner.maker||m.segment===activeMiner.segment)).sort((a,b)=>Math.abs(efficiencyFor(a)-efficiencyFor(activeMiner))-Math.abs(efficiencyFor(b)-efficiencyFor(activeMiner))).slice(0,3).map(miner=><button key={miner.model} onClick={()=>openMiner(miner)}><small>{miner.maker}</small><b>{miner.model}</b><span>{displayEfficiency(efficiencyFor(miner))} J/TH →</span></button>)}</div></div></div></section>}

      {tool === "profitability" && <section className="profit-page" role="dialog" aria-modal="true" aria-label="Bitcoin miner profitability lab"><div className="profile-header"><button onClick={()=>setTool("")} className="back-link">← Back to efficiency index</button><span>USER-SET ASSUMPTIONS · NOT LIVE FINANCIAL DATA</span></div><div className="profit-hero"><p className="eyebrow">PROFITABILITY LAB</p><h2>Market math,<br/><em>kept separate.</em></h2><p>Estimate operating margin using your own hashprice, electricity rate and pool fee. Efficiency remains the durable comparison; profitability is a moment-in-time scenario.</p></div><div className="profit-controls"><label>HASHPRICE <span>USD per PH/s per day</span><input type="number" min="0" step="0.1" value={hashprice} onChange={e=>setHashprice(Number(e.target.value))}/></label><label>ELECTRICITY <span>USD per kWh</span><input type="number" min="0" step="0.005" value={powerPrice} onChange={e=>setPowerPrice(Number(e.target.value))}/></label><label>POOL FEE <span>Percent</span><input type="number" min="0" max="100" step="0.1" value={poolFee} onChange={e=>setPoolFee(Number(e.target.value))}/></label></div><div className="profit-table"><div className="profit-head"><span>Miner</span><span>Gross / day</span><span>Power / day</span><span>Net / day</span><span>Margin</span></div>{miners.map(miner=>{const gross=miner.hashrate/1000*hashprice;const power=miner.watts/1000*24*powerPrice;const net=gross*(1-poolFee/100)-power;const margin=gross?net/gross*100:0;return {...miner,gross,power,net,margin}}).sort((a,b)=>b.net-a.net).map(miner=><button className="profit-row" key={miner.model} onClick={()=>{setTool("");openMiner(miner)}}><span><b>{miner.model}</b><small>{miner.maker} · {displayEfficiency(efficiencyFor(miner))} J/TH</small></span><span>${miner.gross.toFixed(2)}</span><span>−${miner.power.toFixed(2)}</span><span className={miner.net>=0?"positive":"negative"}>{miner.net>=0?"+":"−"}${Math.abs(miner.net).toFixed(2)}</span><span>{miner.margin.toFixed(0)}%</span></button>)}</div><div className="profit-disclaimer"><strong>Scenario only.</strong> The default hashprice is an editable example, not a live quote. Results exclude hardware cost, taxes, downtime, cooling overhead beyond listed miner power, pool variance and changes in network difficulty or BTC price. Verify current hashprice before making decisions.</div></section>}

      <footer><a className="brand" href="#top"><span>₿</span> ASIC EFFICIENCY INDEX</a><p>Built for miners who measure twice.</p><div><a href="https://www.youtube.com/@SerpentXTech" target="_blank" rel="noreferrer">SerpentX Tech ▶</a><a href="https://hashrateindex.com/rigs" target="_blank" rel="noreferrer">Hashrate Index ↗</a><a href="https://whattomine.com/asics" target="_blank" rel="noreferrer">WhatToMine ↗</a><a href="https://www.hashrate.no/asics" target="_blank" rel="noreferrer">Hashrate.no ↗</a><a href="https://www.asicminervalue.com/" target="_blank" rel="noreferrer">ASIC Miner Value ↗</a></div></footer>
    </main>
  );
}

