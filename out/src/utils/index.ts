export { mFormat, rFormat, pFormat } from "utils/format.js"
export { getHosts, getInfo, getTargets } from "utils/host.js"
import { getHosts, getInfo, getTargets } from "utils/host.js"

/** @param {NS} ns */
export function main(ns: NS): undefined {
    getTargets(ns).forEach(t => ns.tprint(t))
}