import { NS } from '@ns'

export async function main(ns: NS): undefined {
  while (true) {
    ns.print("state: GROW_START")
    await ns.grow(ns.args[0])
    ns.print("state: GROW_END")
  }
}