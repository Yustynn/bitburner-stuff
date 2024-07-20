import { NS } from '@ns'
import { getInfo } from '/utils/index.js'

export async function main(ns : NS) : Promise<void> {
    ns.tprint(getInfo(ns, ns.args[0]))
    ns.tprint(ns.getHackingLevel())
    
}