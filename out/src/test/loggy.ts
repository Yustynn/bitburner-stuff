import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    while (true) {
        ns.print("hi")
        await ns.sleep(1000)
    }
}