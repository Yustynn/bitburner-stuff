import { NS } from '@ns'

export async function main(ns: NS): undefined {
  while (true) {
    ns.print("state: WEAKEN_START")
    await ns.sleep(100)
    await ns.weaken(ns.args[0])
    await ns.sleep(100)
    ns.print("state: WEAKEN_END")
  }
}