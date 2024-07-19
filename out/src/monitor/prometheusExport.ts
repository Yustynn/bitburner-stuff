import { NS } from '@ns'
import { getHosts, getInfo } from '/utils/index.js' 

const URL = "http://localhost:2139/save"
const TIMEOUT = 1000


export function getStocksValue(ns: NS): number {
    let value = ns.getServerMoneyAvailable("home")

    for (const sym of ns.stock.getSymbols()) {
        const n = ns.stock.getPosition(sym)[0]
        const price = ns.stock.getPrice(sym)

        value += n * price
    }

    return value
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

function mkPlayerMetrics(ns: NS): Record {
    const stocksValue = getStocksValue(ns)
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
        const playerInfo = mkPlayerMetrics(ns)

        const data = {hostInfo, playerInfo, timestamp}

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