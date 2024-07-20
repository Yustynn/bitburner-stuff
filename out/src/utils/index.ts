export { mFormat, rFormat, pFormat } from "utils/format.js"
export { getHosts, getInfo, getTargets } from "utils/host.js"
export { lock, release } from "utils/mutex.js"
export { getLog, updateLog } from "utils/state.js"
import { getTargets } from "utils/host.js"

/** @param {NS} ns */
export function main(ns: NS): undefined {
    getTargets(ns).forEach(t => ns.tprint(t))
}