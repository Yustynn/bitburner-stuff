import { NS } from '@ns'

export async function main(ns: NS): undefined {
  while (true) {
    ns.print("state: GROW_START")
    await ns.sleep(100)
    await ns.grow(ns.args[0])
    await ns.sleep(100)
    ns.print("state: GROW_END")
  }
}