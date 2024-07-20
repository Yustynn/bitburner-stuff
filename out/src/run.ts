import { NS } from '@ns'

const HACK = "/std/hack.js"
// const GROW = "/std/grow.js"
const GROW_OR_WEAKEN = "/std/growOrWeaken.js"
const WEAKEN = "/std/weaken.js"

const RUNNER_FRAC = "/runners/runFrac.js"
const RUNNER_THREADS = "/runners/runThreads.js"

function assignTarget(ns: NS, server: string, target: string, ramFrac: number): undefined {
    ns.run(RUNNER_FRAC, 1, server, HACK, 0.1 * ramFrac, target, ns.getServerMaxMoney(target)*0.95)
    ns.run(RUNNER_FRAC, 1, server, WEAKEN, 0.2 * ramFrac, target)
    ns.run(RUNNER_FRAC, 1, server, GROW_OR_WEAKEN, 0.7 * ramFrac, target)
}

/** @param {NS} ns */
export function main(ns: NS): undefined {
    let server;
    server = "home"
    assignTarget(ns, server, "n00dles", 0.3)
    server = "serve-0"
    assignTarget(ns, server, "kuai-gong", 0.99)
    server = "serve-1"
    assignTarget(ns, server, "ecorp", 0.99)
    server = "serve-2"
    assignTarget(ns, server, "megacorp", 0.99)
    server = "serve-3"
    assignTarget(ns, server, "clarkinc", 0.99)
    server = "serve-4"
    assignTarget(ns, server, "b-and-a", 0.99)
    server = "serve-5"
    assignTarget(ns, server, "omnitek", 0.99)
    server = "serve-6"
    assignTarget(ns, server, "4sigma", 0.99)
    server = "serve-7"
    assignTarget(ns, server, "blade", 0.99)
    server = "serve-8"
    assignTarget(ns, server, "nwo", 0.99)

    server = null; // fuck you, TypeScript
}