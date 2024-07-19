import { NS } from '@ns'

export async function main(ns : NS) : undefined {
    const host = ns.args[0]
    const file = ns.args[1]
    const nThreads = +ns.args[2]
    const args = ns.args.slice(3)

    if (host != "home") {
        ns.rm(file, host)
        ns.scp(file, host)
    }

    const ramPerThread = ns.getScriptRam(file)
    const ramUsed = (ramPerThread * nThreads / 10**9).toPrecision(2)

    ns.tprint(`Assigning ${host} to run ${file} (${nThreads} threads, ${ramUsed}GB RAM) with args ${args}`)

    ns.exec(file, host, nThreads, ...args)
}