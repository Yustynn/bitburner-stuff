import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    ns.rm("log.json")
    ns.write("log.json", "{}")
}