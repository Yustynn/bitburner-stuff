import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    ns.run("unstock.js")
    await ns.sleep(100)
    ns.run("stock.js")
    ns.run("monitor/prometheusExport.js")
    ns.run("resetLog.js")
    ns.run("run.js")

}