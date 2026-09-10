"use client";

import { useMemo, useState } from "react";

type Rate = {
  provider: string;
  location: string;
  rate: number;
  priceLabel: string;
  minimum: string;
  term: string;
  fees: string;
  comparable: boolean;
  source: string;
  note?: string;
};

type Package = {
  provider: string;
  miner: string;
  th: number;
  watts: number;
  hardware: number;
  monthly: number;
  term: string;
  fees: string;
  source: string;
};

type AltPackage = {
  provider: string; miner: string; algorithm: string; coins: string;
  hash: number; hashUnit: string; watts: number; hardware: number; rate: number;
  location: string; source: string; note?: string;
};

const rates: Rate[] = [
  {provider:"EZ Blockchain",location:"United States",rate:.055,priceLabel:"From",minimum:"Quote",term:"Quote",fees:"Advertised all-in",comparable:false,source:"https://ezblockchain.net/mining-hosting/",note:"Starting price; minimum and exact site terms require a quote."},
  {provider:"Hashlabs",location:"Brazil",rate:.059,priceLabel:"Published",minimum:"Inquiry",term:"Quote",fees:"No add-on disclosed",comparable:true,source:"https://www.hashlabs.io/hosting"},
  {provider:"Sazmining",location:"Paraguay",rate:.059,priceLabel:"Published",minimum:"Buy & host",term:"Quote",fees:"+ 15% of BTC mined",comparable:false,source:"https://www.sazmining.com/pricing",note:"Power includes 5% cooling overhead; variable management fee prevents an all-in $/TH comparison."},
  {provider:"ASIC Host / NMC",location:"North Dakota / Minnesota",rate:.062,priceLabel:"From",minimum:"Quote",term:"Quote",fees:"Advertised all-in",comparable:false,source:"https://asic-host.com/",note:"Floor rate; final price and minimum require a quote."},
  {provider:"Sazmining",location:"Texas",rate:.062,priceLabel:"Published",minimum:"Buy & host",term:"Quote",fees:"+ 15% of BTC mined",comparable:false,source:"https://www.sazmining.com/pricing",note:"Power includes 5% cooling overhead; variable management fee prevents an all-in $/TH comparison."},
  {provider:"OneMiners",location:"United States",rate:.0695,priceLabel:"3-year prepay",minimum:"1 unit",term:"36 months",fees:"No service fee stated",comparable:false,source:"https://oneminers.com/pages/usa-asic-hosting-no-service-fees",note:"Special prepaid term; ordinary published tiers are $0.074–$0.0869/kWh."},
  {provider:"Hashlabs",location:"Kansas",rate:.069,priceLabel:"Published",minimum:"Inquiry",term:"Quote",fees:"No add-on disclosed",comparable:true,source:"https://www.hashlabs.io/hosting"},
  {provider:"Blockware Solutions",location:"United States",rate:.070,priceLabel:"Representative",minimum:"Buy & host",term:"Quote",fees:"All-in; deposit required",comparable:true,source:"https://blockwaresolutions.com/",note:"Public materials describe roughly $0.07–$0.08/kWh depending on volume."},
  {provider:"OneMiners",location:"United States",rate:.074,priceLabel:"Premium tier",minimum:"1 unit",term:"Quote",fees:"No service fee stated",comparable:true,source:"https://oneminers.com/pages/usa-asic-hosting-no-service-fees",note:"Page also lists $0.079 for miners bought online and $0.0869 for external miners."},
  {provider:"Wattum",location:"Texas",rate:.075,priceLabel:"Published",minimum:"Quote",term:"Quote",fees:"No add-on disclosed",comparable:true,source:"https://wattum.io/pages/hosting"},
  {provider:"Pickaxe",location:"United States",rate:.075,priceLabel:"Published",minimum:"1 unit",term:"Annual, paid monthly",fees:"Setup included",comparable:true,source:"https://www.pickaxe.io/hosting"},
  {provider:"StartMining",location:"United States",rate:.075,priceLabel:"2024 brochure",minimum:"Quote",term:"Quote",fees:"No take-or-pay stated",comparable:false,source:"https://www.antminerdistribution.com/wp-content/uploads/2024/11/Startmining-Hosting-USA.pdf",note:"Older public brochure; re-confirm availability and rate."},
  {provider:"Netsonic",location:"Green Bay, Wisconsin",rate:.075,priceLabel:"From",minimum:"1 unit",term:"Quote",fees:"Metered",comparable:false,source:"https://www.netsonic.net/asic-miner-hosting.php",note:"Starting rate; final terms require a quote."},
  {provider:"Musk Miners",location:"United States",rate:.080,priceLabel:"Published",minimum:"1 unit",term:"12 months",fees:"All-in; no service/rack fee",comparable:true,source:"https://www.muskminers.com/hosting/",note:"Only miners purchased through Musk Miners are eligible."},
  {provider:"Simple Mining",location:"United States",rate:.080,priceLabel:"Retail tier",minimum:"Under 500 kW",term:"12 months",fees:"All-in",comparable:true,source:"https://www.simplemining.io/insights/post/simple-mining-onboarding-guide",note:"Volume tiers are $0.075 at 500–999 kW and $0.07 at 1 MW+."},
  {provider:"Terra Hosting",location:"Indiana",rate:.085,priceLabel:"1–25 units",minimum:"1 unit",term:"Quote",fees:"$100 setup",comparable:true,source:"https://terrahosting.io/",note:"Published tiers fall to $0.075/kWh at 1 MW+."},
  {provider:"East Coast ASIC Hosting",location:"Wichita, Kansas",rate:.085,priceLabel:"From",minimum:"Quote",term:"Quote",fees:"Install + 2 months upfront",comparable:false,source:"https://eastcoastasichosting.com/"},
  {provider:"Iowa Mining",location:"Iowa",rate:.0875,priceLabel:"Published",minimum:"Quote",term:"Quote",fees:"$50 setup",comparable:false,source:"https://iowamining.io/services/",note:"Undated/older pricing page; re-confirm before purchase."},
  {provider:"AsicHive",location:"U.S. Midwest",rate:.110,priceLabel:"Published 2024",minimum:"10 units",term:"12 months",fees:"$50 setup; quarterly prepay",comparable:false,source:"https://www.asichive.com/",note:"Pricing marked updated September 2024; re-confirm capacity and rate."},
];

const packages: Package[] = [
  {provider:"Sazmining",miner:"Antminer S21 XP",th:270,watts:3645,hardware:2467,monthly:148,term:"Paraguay",fees:"+ 15% of BTC mined",source:"https://store.sazmining.com/"},
  {provider:"Sazmining",miner:"Antminer S21 XP",th:270,watts:3645,hardware:3447,monthly:165,term:"Texas",fees:"+ 15% of BTC mined",source:"https://store.sazmining.com/"},
  {provider:"Sazmining",miner:"Canaan Avalon A16",th:282,watts:3892,hardware:5897,monthly:176,term:"Texas",fees:"+ 15% of BTC mined",source:"https://store.sazmining.com/"},
  {provider:"Musk Miners",miner:"Antminer S21 Pro",th:234,watts:3510,hardware:2774,monthly:203.39,term:"12 months",fees:"All-in power",source:"https://www.muskminers.com/hosting/"},
  {provider:"Musk Miners",miner:"Antminer S21 XP",th:270,watts:3645,hardware:4249,monthly:209.95,term:"12 months",fees:"All-in power",source:"https://www.muskminers.com/hosting/"},
  {provider:"Musk Miners",miner:"Antminer S21 XP Hydro",th:473,watts:5676,hardware:7946.30,monthly:332.39,term:"12 months",fees:"All-in power",source:"https://www.muskminers.com/hosting/"},
];

const altPackages: AltPackage[] = [
  {provider:"Hashlabs",miner:"Antminer Z15 Pro",algorithm:"Equihash",coins:"ZEC",hash:860,hashUnit:"kSol/s",watts:2847,hardware:8400,rate:.059,location:"Brazil",source:"https://www.hashlabs.io/miners/antminer-z15-pro",note:"Page price can change before the required written offer."},
  {provider:"Musk Miners",miner:"Antminer Z15 Pro",algorithm:"Equihash",coins:"ZEC",hash:840,hashUnit:"kSol/s",watts:2780,hardware:8550,rate:.080,location:"United States",source:"https://www.muskminers.com/hosting/",note:"One-unit minimum; 12-month term; only Musk-purchased miners."},
  {provider:"OneMiners",miner:"Antminer Z15 Pro",algorithm:"Equihash",coins:"ZEC",hash:840,hashUnit:"kSol/s",watts:2780,hardware:11699,rate:.052,location:"Nigeria",source:"https://oneminers.com/products/antminer-z15-pro-840-kh-s",note:"Uses published online-ordered-miner rate; confirm inventory, location and checkout price."},
  {provider:"OneMiners",miner:"Antminer L11",algorithm:"Scrypt",coins:"LTC + DOGE",hash:27,hashUnit:"GH/s",watts:5670,hardware:5030,rate:.052,location:"Nigeria",source:"https://oneminers.com/products/antminer-l11-27-gh-s",note:"Online-miner hosting rate from the official hosting-center page."},
  {provider:"Musk Miners",miner:"Antminer L11",algorithm:"Scrypt",coins:"LTC + DOGE",hash:20,hashUnit:"GH/s",watts:3680,hardware:5550,rate:.080,location:"United States",source:"https://www.muskminers.com/hosting/"},
  {provider:"Hashlabs",miner:"Antminer L11",algorithm:"Scrypt",coins:"LTC + DOGE",hash:20,hashUnit:"GH/s",watts:3680,hardware:6200,rate:.059,location:"Brazil",source:"https://www.hashlabs.io/miners/antminer-l11",note:"Subject to written offer and facility capacity."},
  {provider:"Musk Miners",miner:"Antminer L9",algorithm:"Scrypt",coins:"LTC + DOGE",hash:16,hashUnit:"GH/s",watts:3360,hardware:3550,rate:.080,location:"United States",source:"https://www.muskminers.com/hosting/"},
  {provider:"Hashlabs",miner:"Antminer L9",algorithm:"Scrypt",coins:"LTC + DOGE",hash:16,hashUnit:"GH/s",watts:3360,hardware:3744,rate:.059,location:"Brazil",source:"https://www.hashlabs.io/miners",note:"Starting hardware price; written offer controls."},
  {provider:"Hashlabs",miner:"Antminer D9",algorithm:"X11",coins:"DASH",hash:1770,hashUnit:"GH/s",watts:2839,hardware:1732,rate:.059,location:"Brazil",source:"https://www.hashlabs.io/miners",note:"Starting hardware price; verify hosting availability."},
  {provider:"Hashlabs",miner:"Iceriver KS7",algorithm:"kHeavyHash",coins:"KAS",hash:30,hashUnit:"TH/s",watts:3500,hardware:1732,rate:.059,location:"Brazil",source:"https://www.hashlabs.io/miners",note:"Starting hardware price; verify hosting availability."},
];

const directory = [
  ["Musk Miners","Retail buy & host","Public rate","https://www.muskminers.com/hosting/"],
  ["Simple Mining","Retail / fleet hosting","Public rate","https://www.simplemining.io/insights/post/simple-mining-onboarding-guide"],
  ["Hashlabs","Retail / fleet hosting","Public rate","https://www.hashlabs.io/hosting"],
  ["Wattum","Retail / fleet hosting","Public rate","https://wattum.io/pages/hosting"],
  ["Pickaxe","Retail hosting","Public rate","https://www.pickaxe.io/hosting"],
  ["Sazmining","Retail buy & host","Public rate + variable fee","https://www.sazmining.com/bitcoin-miner-hosting"],
  ["Blockware Solutions","Buy, host & fleet services","Public range","https://blockwaresolutions.com/"],
  ["OneMiners","Retail buy & host / BYOM","Public tiers","https://oneminers.com/pages/usa-asic-hosting-no-service-fees"],
  ["EZ Blockchain","Fleet hosting","Starting rate","https://ezblockchain.net/mining-hosting/"],
  ["ASIC Host / NMC","Fleet hosting","Starting rate","https://asic-host.com/"],
  ["Netsonic","Retail / fleet BYOM","Starting rate","https://www.netsonic.net/asic-miner-hosting.php"],
  ["Terra Hosting","Retail / fleet BYOM","Public tiers","https://terrahosting.io/"],
  ["East Coast ASIC Hosting","Retail / fleet BYOM","Starting rate","https://eastcoastasichosting.com/"],
  ["AsicHive / VeriPic","Fleet BYOM","Public, older rate","https://www.asichive.com/"],
  ["Iowa Mining","Fleet BYOM","Public, older rate","https://iowamining.io/services/"],
  ["StartMining","Fleet hosting","Public, older brochure","https://www.antminerdistribution.com/wp-content/uploads/2024/11/Startmining-Hosting-USA.pdf"],
  ["Compass Mining","Retail buy & host","Account / quote","https://support.compassmining.io/hc/en-us/articles/5193858397341-Hosting-fee-FAQs"],
  ["River","U.S. managed mining","Account / quote","https://river.com/learn/what-is-hosted-mining/"],
  ["Frontier Mining","Fleet hosting","Quote required","https://www.frontiermining.com/asic-miner-sales-hosting-solution"],
  ["D-Central","Canada hosting & repair","Quote required","https://d-central.tech/questions-you-should-inquire-from-your-managed-hosting-provider/"],
  ["MiningStore","U.S. managed hosting","Quote required","https://miningstore.com/"],
  ["Stellar Forge Mining","Retail / fleet hosting","Quote required","https://www.stellarforgemining.com/shop-hosting"],
  ["Hashbranch","U.S. facility marketplace","Quote / platform","https://hashbranch.com/hosting"],
  ["Core Scientific","Institutional hosting","Enterprise contracts","https://investors.corescientific.com/sec-filings/all-sec-filings/content/0001628280-25-046272/0001628280-25-046272.pdf"],
  ["Applied Digital","Institutional hosting","Enterprise contracts","https://ir.applieddigital.com/"],
];

const sources = [
  ["Musk Miners — hosting rates, terms and inventory","https://www.muskminers.com/hosting/"],
  ["Sazmining — locations, energy rates and management fee","https://www.sazmining.com/pricing"],
  ["Sazmining Store — hosted miner package prices","https://store.sazmining.com/"],
  ["Simple Mining — onboarding and published rate tiers","https://www.simplemining.io/insights/post/simple-mining-onboarding-guide"],
  ["Hashlabs — U.S. and Brazil hosting offers","https://www.hashlabs.io/hosting"],
  ["Wattum — facility availability and rates","https://wattum.io/pages/hosting"],
  ["Pickaxe — hosting price and inclusions","https://www.pickaxe.io/hosting"],
  ["Blockware Solutions — buy-and-host offer","https://blockwaresolutions.com/"],
  ["OneMiners — U.S. tiers and long-term prepay offers","https://oneminers.com/pages/usa-asic-hosting-no-service-fees"],
  ["EZ Blockchain — starting all-in hosting rate","https://ezblockchain.net/mining-hosting/"],
  ["ASIC Host / NMC — facilities, floor rate and SLA","https://asic-host.com/"],
  ["Netsonic — Wisconsin hosting and starting rate","https://www.netsonic.net/asic-miner-hosting.php"],
  ["Terra Hosting — Indiana unit tiers and setup fee","https://terrahosting.io/"],
  ["East Coast ASIC Hosting — Kansas starting rate","https://eastcoastasichosting.com/"],
  ["Compass Mining — hosting fee scope and billing","https://support.compassmining.io/hc/en-us/articles/5193858397341-Hosting-fee-FAQs"],
  ["River — managed hosted-mining model","https://river.com/learn/what-is-hosted-mining/"],
  ["Core Scientific — filed description of third-party mining hosting","https://investors.corescientific.com/sec-filings/all-sec-filings/content/0001628280-25-046272/0001628280-25-046272.pdf"],
  ["Bitdeer — cloud hashrate calculator and plan terms","https://bitdeer.com/cloud-mining/calculator"],
  ["BitFuFu — cloud mining fee structure","https://help.bitfufu.com/en/article/how-to-start-bitfufu-cloud-mining-106mfm1/"],
  ["ECOS — cloud mining and equipment terms","https://ecosmininggroup.com/legal/terms-of-service/"],
  ["Bitmain — official Z15 Pro specifications and 2026 batch price","https://www.bitmain.com/news-detail/433"],
  ["Hashlabs — hosted Z15 Pro offer","https://www.hashlabs.io/miners/antminer-z15-pro"],
  ["Hashlabs — hosted L11 Scrypt offer","https://www.hashlabs.io/miners/antminer-l11"],
  ["OneMiners — Z15 Pro sale and hosting option","https://oneminers.com/products/antminer-z15-pro-840-kh-s"],
  ["OneMiners — location-specific hosting rates","https://oneminers.com/pages/hosting-centers"],
  ["Minerstat — live ZEC and ASIC profitability snapshot","https://minerstat.com/"],
];

const money = (value:number) => value.toLocaleString(undefined,{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2});

export function HostingIndex({onClose}:{onClose:()=>void}) {
  const [view,setView] = useState<"rates"|"packages"|"altcoins"|"rentals"|"directory"|"method">("rates");
  const [hashrate,setHashrate] = useState(270);
  const [watts,setWatts] = useState(3645);
  const [comparableOnly,setComparableOnly] = useState(true);
  const rankedRates = useMemo(()=>rates.filter(rate=>!comparableOnly||rate.comparable).sort((a,b)=>a.rate-b.rate),[comparableOnly]);
  const rankedPackages = useMemo(()=>packages.map(item=>({...item,firstYear:(item.hardware+item.monthly*12)/item.th})).sort((a,b)=>a.firstYear-b.firstYear),[]);
  const zecGrossPerKsolDay = 56.37 / 840;
  const monthlyAt = (rate:number) => watts/1000*24*30*rate;

  return <section className="hosting-page" role="dialog" aria-modal="true" aria-label="Bitcoin miner hosting index">
    <header className="hosting-topbar"><button onClick={onClose} className="back-link">← Efficiency index</button><span>RESEARCHED · SEP 09 2026</span></header>
    <section className="hosting-hero">
      <div><p className="eyebrow">THE HOSTING PROCUREMENT INDEX</p><h2>Compare the rack.<br/><em>Not the headline.</em></h2><p>Official, source-linked Bitcoin ASIC hosting offers separated by contract type. Public rates rank; quote-only providers remain discoverable.</p></div>
      <aside><span>PUBLIC PRICING FOUND</span><strong>{rates.length}</strong><small>site / tier offers</small></aside>
    </section>
    <nav className="hosting-tabs" aria-label="Hosting index sections">
      {([['rates','Hosting rates'],['packages','Bitcoin buy + host'],['altcoins','Altcoin miners'],['rentals','Hashrate rental'],['directory','Provider directory'],['method','Method & sources']] as const).map(([key,label])=><button key={key} className={view===key?"active":""} onClick={()=>setView(key)}>{label}</button>)}
    </nav>

    {view === "rates" && <section className="hosting-section">
      <div className="hosting-intro"><div><p className="eyebrow">COLOCATION / BYOM</p><h3>Power cost, normalized.</h3></div><p>Ranking uses published USD/kWh. Your miner inputs turn each rate into daily, 30-day and monthly cost per terahash. Orange rows have sufficiently complete public terms for a direct comparison.</p></div>
      <div className="hosting-controls"><label>HASHRATE <span>TH/s</span><input type="number" min="0.01" step="1" value={hashrate} onChange={e=>setHashrate(Math.max(.01,Number(e.target.value)))}/></label><label>POWER <span>watts at wall</span><input type="number" min="1" step="1" value={watts} onChange={e=>setWatts(Math.max(1,Number(e.target.value)))}/></label><label className="hosting-check"><input type="checkbox" checked={comparableOnly} onChange={e=>setComparableOnly(e.target.checked)}/><span>Comparable public offers only</span></label><div><span>YOUR MINER</span><strong>{(watts/hashrate).toFixed(2)} J/TH</strong></div></div>
      <div className="hosting-table-wrap"><table className="hosting-table"><thead><tr><th>#</th><th>Provider / location</th><th>Rate</th><th>Minimum / term</th><th>Fees & caveats</th><th>Per day</th><th>30 days</th><th>Monthly $/TH</th></tr></thead><tbody>{rankedRates.map((rate,index)=><tr key={`${rate.provider}-${rate.location}`} className={rate.comparable?"verified-row":"complex-row"}><td className="rank">{String(index+1).padStart(2,"0")}</td><td><strong>{rate.provider}</strong><small>{rate.location}</small><a href={rate.source} target="_blank" rel="noreferrer">Official source ↗</a></td><td><strong>${rate.rate.toFixed(4)}</strong><small>per kWh · {rate.priceLabel}</small></td><td><strong>{rate.minimum}</strong><small>{rate.term}</small></td><td><strong>{rate.fees}</strong>{rate.note&&<small>{rate.note}</small>}</td><td>{money(monthlyAt(rate.rate)/30)}</td><td><strong>{money(monthlyAt(rate.rate))}</strong></td><td><strong>{money(monthlyAt(rate.rate)/hashrate)}</strong></td></tr>)}</tbody></table></div>
      <p className="hosting-footnote"><strong>Comparable means comparable on disclosed hosting charges—not vetted, recommended, or guaranteed.</strong> Starting/floor rates, stale prices, special prepayment, and variable revenue-share fees are hidden by default. Toggle them on to inspect the wider market.</p>
    </section>}

    {view === "packages" && <section className="hosting-section"><div className="hosting-intro"><div><p className="eyebrow">BUY + HOST</p><h3>Ownership has two price tags.</h3></div><p>Hardware and twelve months of published hosting are combined, then divided by nominal hashrate. Revenue-share, taxes, deposits, shipping, repairs, and resale value remain separate.</p></div><div className="hosting-table-wrap"><table className="hosting-table"><thead><tr><th>#</th><th>Provider / miner</th><th>Hash / power</th><th>Hardware</th><th>Hosting / mo.</th><th>Hardware $/TH</th><th>12-month fixed $/TH</th><th>Other fees</th></tr></thead><tbody>{rankedPackages.map((item,index)=><tr key={`${item.provider}-${item.miner}-${item.term}`}><td className="rank">{String(index+1).padStart(2,"0")}</td><td><strong>{item.provider}</strong><small>{item.miner} · {item.term}</small><a href={item.source} target="_blank" rel="noreferrer">Official offer ↗</a></td><td><strong>{item.th} TH/s</strong><small>{item.watts.toLocaleString()} W · {(item.watts/item.th).toFixed(1)} J/TH</small></td><td>{money(item.hardware)}</td><td>{money(item.monthly)}</td><td>{money(item.hardware/item.th)}</td><td><strong>{money(item.firstYear)}</strong></td><td>{item.fees}</td></tr>)}</tbody></table></div><p className="hosting-footnote"><strong>12-month fixed $/TH = (hardware price + 12 × stated monthly hosting) ÷ nominal TH/s.</strong> This is procurement cost—not profit, payback, or ROI. Sazmining’s 15% management charge varies with mined BTC and is not included in its fixed-cost ranking.</p></section>}

    {view === "altcoins" && <section className="hosting-section"><div className="hosting-intro"><div><p className="eyebrow">NON-SHA-256 · HOSTING ONLY</p><h3>Equihash, Scrypt & more.</h3></div><p>These miners appear only in the Hosting Index. Algorithms use different hash units, so cost per hash is compared within an algorithm—never across Zcash, Litecoin/Dogecoin, Kaspa, Dash, or Bitcoin.</p></div><div className="zec-verdict"><div><span>BEST DISCLOSED ZCASH COMBINATION</span><h4>Hashlabs · Z15 Pro · Brazil</h4><p>Lowest calculated operating cost among the three current sell-and-host offers, paired with the highest listed hashrate. Final hardware price and capacity still require a written offer.</p></div><div><small>EST. DAILY OPERATING PROFIT*</small><strong>{money(860*zecGrossPerKsolDay-(2847/1000*24*.059))}</strong><span>≈ 157-day simple hardware payback at the captured revenue snapshot</span></div></div><div className="hosting-table-wrap"><table className="hosting-table altcoin-table"><thead><tr><th>Provider / location</th><th>Algorithm / coins</th><th>Miner</th><th>Hashrate / power</th><th>Hardware</th><th>Hosting / mo.</th><th>Hardware cost / hash</th><th>ZEC profit snapshot*</th></tr></thead><tbody>{altPackages.map(item=>{const monthly=item.watts/1000*24*30*item.rate;const zecProfit=item.algorithm==="Equihash"?item.hash*zecGrossPerKsolDay-item.watts/1000*24*item.rate:null;return <tr key={`${item.provider}-${item.miner}-${item.location}`}><td><strong>{item.provider}</strong><small>{item.location} · ${item.rate.toFixed(3)}/kWh</small><a href={item.source} target="_blank" rel="noreferrer">Official offer ↗</a></td><td><strong>{item.algorithm}</strong><small>{item.coins}</small></td><td><strong>{item.miner}</strong>{item.note&&<small>{item.note}</small>}</td><td><strong>{item.hash.toLocaleString()} {item.hashUnit}</strong><small>{item.watts.toLocaleString()} W</small></td><td>{money(item.hardware)}</td><td>{money(monthly)}</td><td><strong>{money(item.hardware/item.hash)}</strong><small>per {item.hashUnit.replace('/s','')}</small></td><td>{zecProfit===null?<small>Use algorithm-specific live revenue</small>:<><strong>{money(zecProfit)} / day</strong><small>≈ {Math.round(item.hardware/zecProfit)}-day simple payback</small></>}</td></tr>})}</tbody></table></div><p className="hosting-footnote"><strong>*Comparable ZEC snapshot, not a forecast.</strong> Revenue is normalized from Minerstat’s September 9, 2026 Z15 Pro ZEC estimate of approximately $51.03/day net at $0.08/kWh, implying about $56.37/day gross for 840 kSol/s. The table adjusts only hashrate and each host’s electricity rate; it excludes pool fees, downtime, taxes, repairs, shipping, difficulty and coin-price changes. Recalculate immediately before buying.</p></section>}

    {view === "rentals" && <section className="hosting-section rental-panel"><div className="hosting-intro"><div><p className="eyebrow">CLOUD / RENTED HASHRATE</p><h3>Keep contracts in their lane.</h3></div><p>A rental contract is not miner ownership and cannot be ranked fairly against colocation. The offers below are reference examples, not a live leaderboard, because promotions, regional access, energy charges and checkout pricing change frequently.</p></div><div className="rental-grid"><article><span>PROMOTIONAL EXAMPLE</span><h4>Bitdeer</h4><strong>$0.0029 <small>/ TH / day</small></strong><p>Official page example: $26 hash-rate fee for 50 TH/s over 180 days, with electricity shown as $0 at capture. Regional restrictions apply; verify checkout.</p><a href="https://bitdeer.com/cloud-mining/btc" target="_blank" rel="noreferrer">Check current plans ↗</a></article><article><span>FEE-STRUCTURE EXAMPLE</span><h4>BitFuFu</h4><strong>$0.0585 <small>/ TH / day</small></strong><p>Official help example combines a $0.0054 hash-rate fee and $0.0531 service fee. It illustrates the formula and is not presented as a current purchasable quote.</p><a href="https://help.bitfufu.com/en/article/how-to-start-bitfufu-cloud-mining-106mfm1/" target="_blank" rel="noreferrer">Read fee model ↗</a></article><article><span>CHECKOUT REQUIRED</span><h4>ECOS</h4><strong>Unranked</strong><p>ECOS advertises cloud contracts and hosted equipment, but variable service/hosting terms make the promotional headline insufficient for a reliable all-in $/TH/day figure.</p><a href="https://www.ecosmininggroup.com/cloud-mining/" target="_blank" rel="noreferrer">Review current offer ↗</a></article></div><p className="hosting-footnote"><strong>Before renting hashrate:</strong> verify machine ownership, withdrawal rules, energy escalation clauses, termination rights, KYC/geography, maintenance deductions, and whether the plan can be unprofitable before its term ends.</p></section>}

    {view === "directory" && <section className="hosting-section"><div className="hosting-intro"><div><p className="eyebrow">SCREENED DIRECTORY</p><h3>25 providers and operators.</h3></div><p>Included when an identifiable company maintains an official ASIC-hosting page, product, help center, or public filing. Presence here is evidence of an offering—not an endorsement or solvency check.</p></div><div className="provider-grid">{directory.map(([name,type,pricing,url])=><article key={name}><span>{pricing}</span><h4>{name}</h4><p>{type}</p><a href={url} target="_blank" rel="noreferrer">Official evidence ↗</a></article>)}</div><div className="exclusion-note"><strong>Not counted as a provider:</strong> directories with no hosting contract, hardware-only brokers, self-miners that do not solicit customers, anonymous storefronts without verifiable company detail, and services limited to non-SHA-256 hardware. Institutional operators are included only when official filings show active third-party Bitcoin-mining hosting.</div></section>}

    {view === "method" && <section className="hosting-section"><div className="hosting-intro"><div><p className="eyebrow">METHOD & SOURCES</p><h3>Useful, not falsely precise.</h3></div><p>This is a curated global, English-language official-source survey—not a claim that every private hosting contract on earth is indexed. Prices were reviewed September 9, 2026 and should be re-quoted before money or hardware moves.</p></div><div className="method-cards"><article><b>01</b><h4>Separate products</h4><p>BYOM power hosting, buy-and-host packages, hashrate rental, and enterprise contracts are not merged into one misleading score.</p></article><article><b>02</b><h4>Normalize disclosed cost</h4><p>30-day power = kW × 24 × 30 × $/kWh. Monthly $/TH divides that result by the user’s nominal hashrate.</p></article><article><b>03</b><h4>Expose exclusions</h4><p>Setup, deposits, revenue shares, minimums, prepay, stale pricing, and quote-only terms stay visible beside the headline rate.</p></article></div><div className="due-diligence"><h4>Contract checklist</h4><ul><li>Who owns the miner and who controls the pool and payout wallet?</li><li>Is billing based on nameplate power, metered draw, or hashrate?</li><li>Are curtailment credits passed through, and is uptime defined or guaranteed?</li><li>What happens after non-payment, failure, site closure, or contract termination?</li><li>Are deposits refundable and are repair labor, parts, shipping, taxes, and insurance included?</li><li>Can you retrieve, sell, transfer, or relocate the machine—and at what cost?</li></ul></div><div className="source-list"><h4>Primary sources</h4>{sources.map(([label,url],index)=><a href={url} target="_blank" rel="noreferrer" key={url}><span>{String(index+1).padStart(2,"0")}</span>{label}<b>↗</b></a>)}</div><p className="hosting-footnote"><strong>Editorial standard:</strong> official sources are preferred and claims are attributed. A public rate may still be incomplete, unavailable, or unsuitable. This page is independent research and not financial advice; no provider paid for placement.</p></section>}
  </section>;
}

