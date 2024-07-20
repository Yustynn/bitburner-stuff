
import { NS } from '@ns'
import { logExec } from "/runners/logExec.js"

export async function main(ns: NS): undefined {
    const host = ns.args[0]
    const file = ns.args[1]
    const frac = +ns.args[2]
    const args = ns.args.slice(3)

    if (host != "home") {
        ns.rm(file, host)
        ns.scp(file, host)
    }

    const ramPerThread = ns.getScriptRam(file)
    const ramToUse = ns.getServerMaxRam(host) * frac
    const nThreads = Math.floor(ramToUse / ramPerThread)

    ns.tprint(`Assigning ${host} to run ${file} (${nThreads} threads, ${(frac*100).toPrecision(3)}% of RAM) with args ${args}`)

    await logExec(ns, file, host, nThreads, args)
}