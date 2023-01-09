import { TileCode, TileIdConverter } from "./tilecode.ts";
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.143.0/testing/asserts.ts";

Deno.test("TileIdConverter.location2tile", () => {
  // z:0
  assertEquals(TileIdConverter.location2tile(0, 0, 0), [0, 0]);
  assertEquals(TileIdConverter.location2tile(0, 85, 0), [0, 0]);
  assertEquals(TileIdConverter.location2tile(0, -85, 0), [0, 0]);
  assertEquals(TileIdConverter.location2tile(0, 0, -180), [0, 0]);
  assertEquals(TileIdConverter.location2tile(0, 0, 179), [0, 0]);
  // z:1
  assertEquals(TileIdConverter.location2tile(1, 85, -180), [0, 0]);
  assertEquals(TileIdConverter.location2tile(1, 0, -180), [0, 1]);
  assertEquals(TileIdConverter.location2tile(1, -85, -180), [0, 1]);
  assertEquals(TileIdConverter.location2tile(1, 85, 0), [1, 0]);
  assertEquals(TileIdConverter.location2tile(1, 85, 179), [1, 0]);
});

Deno.test("TileIdConverter.tile2location", () => {
  // z:0
  assertEquals(TileIdConverter.tile2location(0, 0, 0), [
    85.0511287798066,
    -180.0,
  ]);
  assertEquals(TileIdConverter.tile2location(0, 0.5, 0.5), [0, 0]);
  // z:1
  assertEquals(TileIdConverter.tile2location(1, 0, 0), [
    85.0511287798066,
    -180.0,
  ]);
  assertEquals(TileIdConverter.tile2location(1, 1, 1), [0, 0]);
  assertEquals(TileIdConverter.tile2location(1, 1, 0), [85.0511287798066, 0]);
  assertEquals(TileIdConverter.tile2location(1, 0, 1), [0, -180]);
});
Deno.test("TileCode.getHex", () => {
  assertEquals(new TileCode(0, 0, 0).getHex(), []);
  assertEquals(new TileCode(2, 0, 0).getHex(), [0]);
  assertEquals(new TileCode(4, 0, 0).getHex(), [0, 0]);
  assertEquals(new TileCode(2, (1 << 2) - 1, (1 << 2) - 1).getHex(), [15]);
  assertEquals(new TileCode(4, (1 << 4) - 1, (1 << 4) - 1).getHex(), [15, 15]);
  // x: 0 0 0 1
  // y: 0 0 1 1
  assertEquals(new TileCode(4, 1, 3).getHex(), [0, 7]);

  assertThrows(() => {
    new TileCode(1, 0, 0).getHex();
  });
  assertThrows(() => {
    new TileCode(3, 0, 0).getHex();
  });
});

Deno.test("TileCode.getBinary", () => {
  assertEquals(new TileCode(0, 0, 0).getBinary(), []);
  assertEquals(new TileCode(1, 0, 0).getBinary(), [0, 0]);
  assertEquals(new TileCode(1, 1, 0).getBinary(), [1, 0]);
  assertEquals(new TileCode(1, 0, 1).getBinary(), [0, 1]);

  assertEquals(new TileCode(4, 0, 0).getBinary(), [0, 0, 0, 0, 0, 0, 0, 0]);
  assertEquals(new TileCode(4, (1 << 4) - 1, (1 << 4) - 1).getBinary(), [
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
  ]);
  assertEquals(new TileCode(8, (1 << 8) - 1, (1 << 8) - 1).getBinary(), [
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
  ]);
  assertEquals(new TileCode(8, 0xf0, 0x0f).getBinary(), [
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
  ]);
});

Deno.test("TileCode.toHexString", () => {
  assertEquals(new TileCode(0, 0, 0).toHexString(false), "");
  assertEquals(new TileCode(0, 0, 0).toHexString(true), "0x");

  assertEquals(new TileCode(2, 0, 0).toHexString(true), "0x0");
  assertEquals(
    new TileCode(2, (1 << 2) - 1, (1 << 2) - 1).toHexString(true),
    "0xf",
  );

  assertEquals(
    new TileCode(4, (1 << 4) - 1, (1 << 4) - 1).toHexString(true),
    "0xff",
  );
  // x: 1111
  // y: 0000
  // 1010_1010
  assertEquals(new TileCode(4, 0xf, 0x0).toHexString(true), "0xaa");
});

Deno.test("TileCode.toBinaryString", () => {
  assertEquals(new TileCode(0, 0, 0).toBinaryString(false), "");
  assertEquals(new TileCode(0, 0, 0).toBinaryString(true), "0b");

  assertEquals(new TileCode(4, 0, 0).toBinaryString(true), "0b00000000");
  assertEquals(
    new TileCode(4, (1 << 4) - 1, (1 << 4) - 1).toBinaryString(true),
    "0b11111111",
  );

  assertEquals(
    new TileCode(8, (1 << 8) - 1, (1 << 8) - 1).toBinaryString(true),
    "0b1111111111111111",
  );
  assertEquals(
    new TileCode(8, 0xf0, 0x0f).toBinaryString(true),
    "0b1010101001010101",
  );
});

Deno.test("TileCode.getLocationStart", () => {
  assertEquals(new TileCode(0, 0, 0).getLocationStart(), {
    lat: 85.0511287798066,
    lng: -180,
  });
  assertEquals(new TileCode(1, 0, 0).getLocationStart(), {
    lat: 85.0511287798066,
    lng: -180,
  });
  assertEquals(new TileCode(1, 1, 0).getLocationStart(), {
    lat: 85.0511287798066,
    lng: 0,
  });
  assertEquals(new TileCode(1, 0, 1).getLocationStart(), { lat: 0, lng: -180 });
});

Deno.test("TileCode.getLocationCenter", () => {
  assertEquals(new TileCode(0, 0, 0).getLocationCenter(), { lat: 0, lng: 0 });
  assertEquals(new TileCode(1, 0, 0).getLocationCenter(), {
    lat: 66.51326044311186,
    lng: -90,
  });
  assertEquals(new TileCode(1, 1, 0).getLocationCenter(), {
    lat: 66.51326044311186,
    lng: 90,
  });
  assertEquals(new TileCode(1, 0, 1).getLocationCenter(), {
    lat: -66.51326044311186,
    lng: -90,
  });
});

Deno.test("TileCode.plus", () => {
  assertEquals(new TileCode(0, 0, 0).plus(1, 2), new TileCode(0, 0, 0));
  assertEquals(new TileCode(1, 1, 0).plus(1, 2), new TileCode(1, 0, 0));
  assertEquals(new TileCode(1, 0, 1).plus(2, 1), new TileCode(1, 0, 0));
  assertEquals(new TileCode(1, 1, 0).plus(-1, -2), new TileCode(1, 0, 0));
  assertEquals(new TileCode(2, 0, 0).plus(1, 2), new TileCode(2, 1, 2));
});

Deno.test("TileCode.fromLocation", () => {
  assertEquals(TileCode.fromLocation(0, 0, 0), new TileCode(0, 0, 0));
  assertEquals(
    TileCode.fromLocation(1, 85.0511287798065, -180),
    new TileCode(1, 0, 0),
  );
  assertEquals(TileCode.fromLocation(1, 0, 0), new TileCode(1, 1, 1));
  assertEquals(
    TileCode.fromLocation(1, -85.0511287798065, 179),
    new TileCode(1, 1, 1),
  );
});

Deno.test("TileCode.fromHex", () => {
  assertEquals(TileCode.fromHex([]), new TileCode(0, 0, 0));

  // z:2
  assertEquals(TileCode.fromHex([0]), new TileCode(2, 0, 0));
  // 1 1
  //  0 0
  // 0b1010
  assertEquals(TileCode.fromHex([10]), new TileCode(2, 3, 0));
  // 0 1
  //  1 0
  // 0b0110
  assertEquals(TileCode.fromHex([6]), new TileCode(2, 1, 2));

  // z:2
  assertEquals(TileCode.fromHex([0, 0]), new TileCode(4, 0, 0));
  // x: 0b1101
  // y: 0b0010
  assertEquals(TileCode.fromHex([10, 6]), new TileCode(4, 13, 2));
});

Deno.test("TileCode.fromBinary", () => {
  assertEquals(TileCode.fromBinary([]), new TileCode(0, 0, 0));

  // z:1
  assertEquals(TileCode.fromBinary([0, 0]), new TileCode(1, 0, 0));
  assertEquals(TileCode.fromBinary([1, 0]), new TileCode(1, 1, 0));
  assertEquals(TileCode.fromBinary([0, 1]), new TileCode(1, 0, 1));

  // z:2
  assertEquals(TileCode.fromBinary([0, 0, 0, 0]), new TileCode(2, 0, 0));
  assertEquals(TileCode.fromBinary([1, 0, 0, 1]), new TileCode(2, 2, 1));
  assertEquals(TileCode.fromBinary([0, 1, 1, 0]), new TileCode(2, 1, 2));

  // z:3
  assertEquals(TileCode.fromBinary([0, 0, 0, 0, 0, 0]), new TileCode(3, 0, 0));
  assertEquals(TileCode.fromBinary([1, 0, 0, 1, 1, 1]), new TileCode(3, 5, 3));
  assertEquals(TileCode.fromBinary([0, 1, 1, 0, 0, 0]), new TileCode(3, 2, 4));
});

Deno.test("TileCode.fromHexString", () => {
  assertEquals(TileCode.fromHexString("0x"), new TileCode(0, 0, 0));

  // z:2
  assertEquals(TileCode.fromHexString("0x0"), new TileCode(2, 0, 0));
  // 1 1 0 0
  //  0 0 1 1
  // 0b10100101
  assertEquals(TileCode.fromHexString("0xa5"), new TileCode(4, 12, 3));
  // 0 1 0 1
  //  1 0 1 0
  // 0b01100110
  assertEquals(TileCode.fromHexString("0x66"), new TileCode(4, 5, 10));

  // z:8
  assertEquals(TileCode.fromHexString("0x0000"), new TileCode(8, 0, 0));
  // x: 0b1100_0101
  // y: 0b0011_1010
  assertEquals(TileCode.fromHexString("0xa566"), new TileCode(8, 197, 58));
});
