import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { hashAlgorithms, hashBytes, hashText, toHex } from "../hash";

const VECTORS: Record<string, { abc: string; empty: string }> = {
  "SHA-1": {
    abc: "a9993e364706816aba3e25717850c26c9cd0d89d",
    empty: "da39a3ee5e6b4b0d3255bfef95601890afd80709",
  },
  "SHA-256": {
    abc: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    empty: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  },
  "SHA-384": {
    abc: "cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7",
    empty: "38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b",
  },
  "SHA-512": {
    abc: "ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f",
    empty:
      "cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e",
  },
};

describe("hashText", () => {
  for (const algorithm of hashAlgorithms) {
    it(`${algorithm} matches the published vectors`, async () => {
      assert.equal(await hashText("abc", algorithm), VECTORS[algorithm].abc);
      assert.equal(await hashText("", algorithm), VECTORS[algorithm].empty);
    });
  }

  it("hashes the UTF-8 bytes of Unicode text", async () => {
    assert.equal(await hashText("café", "SHA-256"), await hashBytes(new TextEncoder().encode("café"), "SHA-256"));
    assert.notEqual(await hashText("café", "SHA-256"), await hashText("cafe", "SHA-256"));
  });

  it("can return uppercase hex", async () => {
    assert.equal(await hashText("abc", "SHA-1", { uppercase: true }), VECTORS["SHA-1"].abc.toUpperCase());
  });
});

describe("hashBytes", () => {
  it("hashes raw bytes and array buffers", async () => {
    const bytes = Uint8Array.from([0x61, 0x62, 0x63]);
    assert.equal(await hashBytes(bytes, "SHA-256"), VECTORS["SHA-256"].abc);
    assert.equal(await hashBytes(bytes.buffer, "SHA-256"), VECTORS["SHA-256"].abc);
  });
});

describe("toHex", () => {
  it("pads every byte to two digits", () => {
    assert.equal(toHex(Uint8Array.from([0, 1, 15, 16, 255])), "00010f10ff");
    assert.equal(toHex(Uint8Array.from([171, 205]), true), "ABCD");
  });
});
