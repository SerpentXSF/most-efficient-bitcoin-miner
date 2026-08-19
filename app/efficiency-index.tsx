"use client";

import { useMemo, useState } from "react";

type Cooling = "Air" | "Hydro" | "Immersion";
type Miner = {
  maker: string; model: string; hashrate: number; watts: number; jth: number;
  cooling: Cooling; year: number; source: string; sourceName: string; status?: "Shipping" | "Announced";
  segment?: "Industrial" | "Home";
  note?: string;
  mode?: string;
  noise?: string;
  voltage?: string;
  powerBoundary?: "Wall" | "Board";
  confidence?: "Manufacturer" | "Catalog" | "Open hardware";
  video?: { url: string; title: string };
};

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
  { maker:"FutureBit", model:"Apollo III — comparison mode", hashrate:18, watts:270, jth:15, cooling:"Air", year:2026, segment:"Home", status:"Announced", note:"Preorder · approximate manufacturer comparison", source:"https://www.futurebit.io/apollo-iii", sourceName:"FutureBit" },
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

  const ranked = useMemo(() => {
    const q = query.trim().toLowerCase();
    return miners.filter(m => (cooling === "All" || m.cooling === cooling) && (segment === "All" || (m.segment ?? "Industrial") === segment) && (!q || `${m.maker} ${m.model}`.toLowerCase().includes(q)))
      .sort((a,b) => sort === "jth" ? efficiencyFor(a)-efficiencyFor(b) : sort === "hashPerKw" ? (1000/efficiencyFor(b))-(1000/efficiencyFor(a)) : sort === "hashrate" ? b.hashrate-a.hashrate : a.watts-b.watts);
  }, [query, cooling, segment, sort]);

  const best = [...miners].sort((a,b)=>efficiencyFor(a)-efficiencyFor(b))[0];
  const baseline = miners.find(m=>m.model === "Antminer S19k Pro")!;
  const annualSavings = ((baseline.watts - (baseline.hashrate * efficiencyFor(best))) / 1000) * 24 * 365 * powerPrice;
  const formulaWarnings = miners.filter(miner => formulaDelta(miner) > 0.015).length;

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="ASIC Efficiency Index home"><span>₿</span> ASIC EFFICIENCY INDEX</a>
        <nav aria-label="Main navigation"><a href="#rankings">Rankings</a><a href="#calculator">Cost lab</a><a href="#methodology">Methodology</a></nav>
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
        <div className="data-strip" aria-label="Dataset quality summary"><span><b>{miners.length}</b> verified records</span><span><b>{formulaWarnings ? `${formulaWarnings} flagged` : "Formula checked"}</b> W ÷ TH/s</span><span><b>Updated</b> Aug 2026</span><a href="https://github.com/SerpentXSF/most-efficient-bitcoin-miner/issues/new" target="_blank" rel="noreferrer">Suggest a correction ↗</a></div>

        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Hardware</th><th>Cooling</th><th>Hashrate</th><th>Power</th><th>Hash / kW</th><th>Efficiency</th><th>24h power</th></tr></thead>
            <tbody>{ranked.slice(0,visible).map((miner, index) => {
              const dayCost = miner.watts / 1000 * 24 * powerPrice;
              const efficiency = efficiencyFor(miner);
              return <tr key={miner.model}>
                <td className="rank">{String(index+1).padStart(2,"0")}</td>
                <td className="hardware"><strong>{miner.model}</strong><span>{miner.maker} · {miner.year} {miner.segment === "Home" && <i>Home</i>} {miner.status && <i>{miner.status}</i>}</span>{(miner.mode || miner.noise || miner.voltage) && <small className="spec-meta">{[miner.mode,miner.noise,miner.voltage].filter(Boolean).join(" · ")}</small>}{miner.note && <small>{miner.note}</small>}</td>
                <td><span className={`cooling ${miner.cooling.toLowerCase()}`}>{miner.cooling}</span></td>
                <td>{miner.hashrate.toLocaleString()} <small>TH/s</small></td>
                <td>{miner.watts.toLocaleString()} <small>W</small></td>
                <td>{(1000/efficiency).toFixed(1)} <small>TH/kW</small></td>
                <td className="efficiency"><b>{efficiency.toFixed(efficiency < 10 ? 2 : efficiency < 100 ? 1 : 0)}</b> <small>J/TH</small><span><i style={{width:`${Math.min(100, efficiency/30*100)}%`}} /></span></td>
                <td><strong>${dayCost.toFixed(2)}</strong><small> @ ${powerPrice.toFixed(2)}/kWh</small><div className="row-links"><a href={miner.source} target="_blank" rel="noreferrer">Source ↗</a>{miner.video && <a className="watch-link" href={miner.video.url} title={miner.video.title} target="_blank" rel="noreferrer">Watch ▶</a>}</div><small className="confidence">{confidenceFor(miner)}{miner.powerBoundary ? ` · ${miner.powerBoundary} power` : ""}</small></td>
              </tr>;
            })}</tbody>
          </table>
          {!ranked.length && <div className="empty">No miners match those filters.</div>}
        </div>
        {visible < ranked.length && <button className="load-more" onClick={()=>setVisible(v=>v+12)}>Show {Math.min(12, ranked.length-visible)} more <span>＋</span></button>}
        <p className="result-count">Showing {Math.min(visible,ranked.length)} of {ranked.length} matching models</p>
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
      </section>

      <footer><a className="brand" href="#top"><span>₿</span> ASIC EFFICIENCY INDEX</a><p>Built for miners who measure twice.</p><div><a href="https://www.youtube.com/@SerpentXTech" target="_blank" rel="noreferrer">SerpentX Tech ▶</a><a href="https://hashrateindex.com/rigs" target="_blank" rel="noreferrer">Hashrate Index ↗</a><a href="https://whattomine.com/asics" target="_blank" rel="noreferrer">WhatToMine ↗</a><a href="https://www.hashrate.no/asics" target="_blank" rel="noreferrer">Hashrate.no ↗</a><a href="https://www.asicminervalue.com/" target="_blank" rel="noreferrer">ASIC Miner Value ↗</a></div></footer>
    </main>
  );
}
