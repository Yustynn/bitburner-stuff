import { NS } from '@ns'

const MIN_MONEY_AVAILABLE = 3*10**6
const MIN_BUDGET = 1*10**6
const MONEY_RESERVE = 1*10**6
const MIN_FORECAST = 0.6
const MIN_VOLATILITY = 0.004
const UPGRADE_SCORE_THRESHOLD = 1.05
const UPGRADE_PROFIT_THRESHOLD = 0.5*10**6

const TICKS = 6

const COMMISSION = 100*1000

const openPositions = []
const closedPositions = []

function getSymInfo(ns: NS, sym) {
    const price = ns.stock.getPrice(sym)
    const forecast = ns.stock.getForecast(sym)
    const volatility = ns.stock.getVolatility(sym)

    const score = forecast * Math.pow(volatility, 0.5)

    return { sym, price, forecast, volatility, score }
}

export function getPicks(ns: NS): Array<Record> {
  const picks = []
  for (const sym of ns.stock.getSymbols()) {
    const symInfo = getSymInfo(ns, sym)

    if (symInfo.forecast < MIN_FORECAST) continue
    if (symInfo.volatility < MIN_VOLATILITY) continue

    picks.push(symInfo)
  }

  picks.sort((a, b) => b.score - a.score)
  return picks
}

function sellPosition(ns: NS, pos: Record): undefined {
  ns.tprint(pos)
  const { buyPrice, sym } = pos
  const  numShares = ns.stock.getPosition(sym)[0]
  const sellPrice = ns.stock.sellStock(sym, numShares)

  openPositions.splice(openPositions.indexOf(pos), 1)
  closedPositions.push({ sym, buyPrice, sellPrice, numShares })

  const profit = (sellPrice - buyPrice)*numShares - 2*COMMISSION

  ns.tprint(`Sold ${sym} (${numShares} shares), profit of ${profit/(10**6)}M`)
  ns.tprint(`Total profit so far from sales: ${getCurrProfit()/10**6}M`)
  ns.toast(`Total profit so far from sales: ${getCurrProfit()/10**6}M`)
}

function sellBadPositions(ns: NS): undefined {
  for (const pos of openPositions) {
    if (ns.stock.getForecast(pos.sym) < MIN_FORECAST) {
      sellPosition(ns, pos)
    }
  }
}

function getCurrProfit(): number {
  let profit = 0
  for (const { buyPrice, sellPrice, numShares } of closedPositions) {
    profit -= 2*COMMISSION // for buy + sell
    profit += (sellPrice - buyPrice) * numShares
  }
  
  return profit.toPrecision(3)
}

/** @param {NS} ns */
function sellWeakPositions(ns) {
  const picks = getPicks(ns)

  let availablePick;
  for (const pick of picks) {
    const numSharesHeld = openPositions.reduce((acc, pos) => acc + (pos.sym == pick.sym ? pos.numShares : 0), 0)
    if (numSharesHeld < ns.stock.getMaxShares(pick.sym)) {
      availablePick = pick;
      break;
    }
  }
  if (!availablePick) return

  const topScore = availablePick.score 

  for (const pos of openPositions) {
    const symInfo = getSymInfo(ns, pos.sym)
    const profit = (symInfo.price - pos.buyPrice) * pos.numShares
    
    if (profit >= UPGRADE_PROFIT_THRESHOLD && topScore / symInfo.score >= UPGRADE_SCORE_THRESHOLD) {
      ns.tprint(`Exiting weak position ${JSON.stringify(pos)}`)
      sellPosition(ns, pos)
    }
    else {
      ns.print(`[${Date.now()}] Maintain ${symInfo.sym}. Top score: ${topScore} vs pos score ${symInfo.score}`)
    }
  }
}

function buyGoodStock(ns: NS)  {
  let budget = ns.getServerMoneyAvailable("home") - MONEY_RESERVE - COMMISSION

  for (const pick of getPicks(ns)) {
    if (budget < MIN_BUDGET) {
      return
    }
    const sym = pick.sym


    const buyPrice = ns.stock.getPrice(sym)

    const maxShares = ns.stock.getMaxShares(sym)
    const currShares = ns.stock.getPosition(sym)[0]
    const desiredNumShares = Math.floor(budget / buyPrice)
    let numSharesToBuy = Math.min(desiredNumShares, maxShares - currShares)

    let result = ns.stock.buyStock(sym, numSharesToBuy)
    if (result == 0) {
      ns.tprint('ERROR: Could not buy the following:')
      ns.tprint(`\t${sym} (${numSharesToBuy} shares) for ${numSharesToBuy * buyPrice / (10 ** 6)}M (${buyPrice} each)`)
      numSharesToBuy *= 0.9
      result = ns.stock.buyStock(sym, numSharesToBuy)
      if (result == 0) {
        ns.tprint('ERROR: Could not buy the following:')
        ns.tprint(`\t${sym} (${numSharesToBuy} shares) for ${numSharesToBuy * buyPrice / (10 ** 6)}M (${buyPrice} each)`)
        ns.tprint('Giving up.')
        continue
      }
      ns.tprint('SUCCESS: Bought 90% of the volume')
      ns.tprint(`\t${sym} (${numSharesToBuy} shares) for ${numSharesToBuy * buyPrice / (10 ** 6)}M (${buyPrice} each)`)

    }

    budget -= result * numSharesToBuy - COMMISSION
    openPositions.push({ sym, numShares: numSharesToBuy, buyPrice })

    ns.tprint(`Picked ${JSON.stringify(pick)}`)
    ns.tprint(`Bought ${sym} (${numSharesToBuy} shares) for ${numSharesToBuy * buyPrice / (10 ** 6)}M (${buyPrice} each)`)
    ns.toast(`Bought ${sym} (${numSharesToBuy} shares) for ${numSharesToBuy * buyPrice / (10 ** 6)}M (${buyPrice} each)`)
  }

}

export async function main(ns: NS): undefined {
  while (true) {
    sellWeakPositions(ns)
    sellBadPositions(ns)
    if (ns.getServerMoneyAvailable("home") > MIN_MONEY_AVAILABLE) buyGoodStock(ns)
    await ns.sleep(TICKS*1000)
  }
}