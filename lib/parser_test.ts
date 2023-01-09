import { parseTileCode } from "./parser.ts";
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.143.0/testing/asserts.ts";
import { TileCode } from "./tilecode.ts";

Deno.test("parseTileCode:tile", () => {
  assertEquals(parseTileCode("0/0/0"), new TileCode(0, 0, 0));
});

Deno.test("parseTileCode:hex", () => {
  assertEquals(parseTileCode("0x"), new TileCode(0, 0, 0));
  assertEquals(parseTileCode("0x0"), new TileCode(2, 0, 0));
  assertEquals(parseTileCode("0xf"), new TileCode(2, 3, 3));
  assertEquals(parseTileCode("0xF"), new TileCode(2, 3, 3));
  assertEquals(parseTileCode("0xa5"), new TileCode(4, 12, 3));
});

Deno.test("parseTileCode:binary", () => {
  assertEquals(parseTileCode("0b"), new TileCode(0, 0, 0));
  assertEquals(parseTileCode("0b00"), new TileCode(1, 0, 0));
  assertEquals(parseTileCode("0b10"), new TileCode(1, 1, 0));
  assertEquals(parseTileCode("0b11"), new TileCode(1, 1, 1));
  assertEquals(parseTileCode("0b1001"), new TileCode(2, 2, 1));
  assertThrows(() => {
    parseTileCode("0b0");
  });
  assertThrows(() => {
    parseTileCode("0b000");
  });
});

Deno.test("parseTileCode:zoom,lat,lng", () => {
  assertEquals(parseTileCode("0,0,0"), new TileCode(0, 0, 0));
  assertEquals(parseTileCode("1,0,0"), new TileCode(1, 1, 1));
  assertEquals(parseTileCode("1,85,-180"), new TileCode(1, 0, 0));
  assertEquals(parseTileCode("1,-85,179"), new TileCode(1, 1, 1));
});
