# Most Efficient Bitcoin Miner

A source-linked ranking of SHA-256 Bitcoin mining hardware by energy efficiency. The index covers both industrial ASICs and home or compact miners, from current hydro-cooled systems to Bitaxe, NerdAxe, Jingle Miner, Hammer Miner, Avalon Nano, GekkoScience, and Goldshell devices.

## Live website

[Open the public ASIC Efficiency Index](https://serpentxsf.github.io/most-efficient-bitcoin-miner/)

The public site is hosted free through GitHub Pages and does not require a ChatGPT login.

## What the index measures

The default ranking places the most efficient miner first and proceeds from lowest to highest energy use.

```text
J/TH = power draw in watts ÷ hashrate in TH/s
TH/kW = 1,000 ÷ J/TH
```

- **J/TH (joules per terahash):** lower is better.
- **TH/kW (terahashes per kilowatt):** higher is better.
- **24-hour power cost:** recalculated from the electricity rate selected on the site.

Profitability, BTC price, network difficulty, pool luck, and hardware purchase price are intentionally excluded from the primary efficiency ranking.

## Features

- Strict lowest-to-highest J/TH ranking by default
- Industrial and home/compact hardware filters
- Air, hydro, and immersion cooling filters
- Search by manufacturer or model
- Alternate sorting by TH/kW, hashrate, or power draw
- Adjustable electricity-cost calculator
- A source link for every hardware record
- Responsive desktop and mobile layouts

## Data and verification

Primary manufacturer specifications are preferred. Established mining databases and specialist hardware catalogs are used to cross-check specifications and fill coverage gaps, including:

- [BITMAIN](https://www.bitmain.com/)
- [Bitdeer](https://www.bitdeer.com/shop/explorer)
- [Hashrate Index](https://hashrateindex.com/rigs)
- [WhatToMine](https://whattomine.com/asics)
- [Hashrate.no](https://www.hashrate.no/asics)
- [ASIC Miner Value](https://www.asicminervalue.com/)
- Manufacturer and open-hardware product pages linked from individual rows

FutureBit home miners are sourced from the official [Apollo III](https://www.futurebit.io/apollo-iii), [Apollo II](https://www.futurebit.io/apollo-ii), and [Apollo BTC](https://www.futurebit.io/apollo-btc) product pages. Mode-specific and approximate manufacturer comparison figures are labeled in the index.

Specifications are advertised or typical values rather than independent laboratory measurements. Firmware, operating mode, cooling, PSU efficiency, ambient conditions, and silicon variation can change performance at the wall. Announced hardware is labeled on the site.

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

Create the static GitHub Pages build with:

```bash
npm run build:pages
```

## Contributing data

Corrections and additional SHA-256 or ASICBOOST SHA-256 miners are welcome. Please include:

1. Manufacturer and exact model or operating mode
2. Advertised or measured hashrate
3. Wall power draw
4. Cooling type and form factor
5. A primary specification sheet or reputable source URL

If values are independently measured, identify the firmware, voltage/frequency settings, PSU, and measurement point.

## Disclaimer

This project is an engineering comparison and educational resource, not financial advice. Verify electrical requirements, cooling infrastructure, noise, warranty terms, and current manufacturer specifications before purchasing or operating mining equipment.
