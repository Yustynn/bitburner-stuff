import { NS } from '@ns'
import { getHosts, getInfo } from '/utils/index.js' 

const URL = "http://localhost:2139/save"
const TIMEOUT = 1000


export function getStocksPositionValue(stockPositionInfo: Record): number {
    let value = 0
    for (const {numHeld, price} of Object.values(stockPositionInfo)) {
        value += numHeld * price
    }

    return value
}

export function getStockPositionInfo(ns: NS): Record {
    const symInfo = {}

    for (const sym of ns.stock.getSymbols()) {
        const numHeld = ns.stock.getPosition(sym)[0]
        const price = ns.stock.getPrice(sym)

        if (numHeld > 0) {
            symInfo[sym] = {
                numHeld,
                price
            }
        }
    }

    return symInfo
}

function mkHostInfo(ns: NS, timestamp: date): Record {
    const hostInfo = {}
    getHosts(ns).forEach(h => {
        const info = getInfo(ns, h)
        delete info["host"]
        info["timestamp"] = timestamp

        if (ns.getHackingLevel() >= info.reqHackingLvl) hostInfo[h] = info
    })

    return hostInfo
}

function mkPlayerMetrics(ns: NS, stocksPositionInfo: Record): Record {
    const stocksValue = getStocksPositionValue(stocksPositionInfo)
    const cashOnHand = ns.getServerMoneyAvailable("home")
    const netWorth = stocksValue + cashOnHand

    const playerInfo = ns.getPlayer()

    return {
        money: {
            stocksValue,
            cashOnHand,
            netWorth
        },
        skills: playerInfo.skills,
        experience: playerInfo.exp,
        multipliers: playerInfo.mults
    }
}


export async function main(ns : NS) : undefined {
    while (true) {
        const timestamp = Date.now()
        const hostInfo = mkHostInfo(ns, timestamp)
        const stocksPositionInfo = getStockPositionInfo(ns)
        const playerInfo = mkPlayerMetrics(ns, stocksPositionInfo)

        const data = { hostInfo, playerInfo, stocksPositionInfo }

        await fetch(URL, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        await ns.sleep(TIMEOUT)
    }

}