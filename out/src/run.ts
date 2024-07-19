import { NS } from '@ns'

const HACK = "/std/hack.js"
// const GROW = "/std/grow.js"
const GROW_OR_WEAKEN = "/std/growOrWeaken.js"
const WEAKEN = "/std/weaken.js"
const MONITOR = "/std/monitor.js"

const RUNNER_FRAC = "/runners/runFrac.js"
const RUNNER_THREADS = "/runners/runThreads.js"

function assignTarget(ns: NS, server: string, target: string, ramFrac: number, minAmtM: number): undefined {
    ns.killall(target)
    ns.run(RUNNER_THREADS, 1, target, MONITOR, 1, target)

    ns.run(RUNNER_FRAC, 1, server, HACK, 0.1 * ramFrac, target, minAmtM * 10 ** 6)
    ns.run(RUNNER_FRAC, 1, server, WEAKEN, 0.2 * ramFrac, target)
    ns.run(RUNNER_FRAC, 1, server, GROW_OR_WEAKEN, 0.7 * ramFrac, target)
}

/** @param {NS} ns */
export async function main(ns: NS): undefined {
    let server;

    server = "serve-0"
    ns.killall(server)
    assignTarget(ns, server, "global-pharm", 0.67, 42000)
    assignTarget(ns, server, "lexo-corp", 0.33, 42000)

    server = null; // fuck you, TypeScript
}