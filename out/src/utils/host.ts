import { NS } from '@ns'

export function getHosts(ns: NS): Array<string> {
    const hosts = new Set()
    let toCheck = ["home"]

    while (toCheck.length) {
        const host = toCheck.pop()
        if (!hosts.has(host)) {
            toCheck = toCheck.concat(ns.scan(host))
            hosts.add(host)
        }
    }

    return Array.from(hosts)
}

export function getInfo(ns: NS, host: string): Array<Record<string, unknown>> {
    const money = ns.getServerMoneyAvailable(host)
    const maxMoney = ns.getServerMaxMoney(host)

    const reqHackingLvl = ns.getServerRequiredHackingLevel(host)
    const minSec = ns.getServerMinSecurityLevel(host)
    const baseSec = ns.getServerBaseSecurityLevel(host)
    const sec = ns.getServerSecurityLevel(host)

    const ram = ns.getServerMaxRam(host)
    const ramUsed = ns.getServerUsedRam(host)

    return {
        host,
        reqHackingLvl,
        money, maxMoney,
        sec, minSec, baseSec,
        ram, ramUsed
    }
}

/** @param {NS} ns */
export function getTargets(ns: NS): Array<Record<string, unknown>> {
    return getHosts(ns)
        .map(host => getInfo(ns, host))
        .filter(({ host }) => ns.hasRootAccess(host))
}