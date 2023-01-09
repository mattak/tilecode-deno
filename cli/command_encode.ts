import { TileCode } from "../lib/tilecode.ts";
import { parseTileCode } from "../lib/parser.ts";

interface encodeOptions {
  hex?: true | undefined;
  binary?: true | undefined;
  tileId?: true | undefined;
  locationCenter?: true | undefined;
  locationStart?: true | undefined;
  formatJson?: true | undefined;
  formatTsv?: true | undefined;
}

function printJson(map: { [key: string]: string }) {
  console.log(JSON.stringify(map));
}

function printTsv(map: { [key: string]: string }) {
  for (let key of Object.keys(map)) {
    console.log(`${key}\t${map[key]}`);
  }
}

export function executeEncode(
  options: encodeOptions,
  argument: string,
) {
  const tilecode: TileCode = parseTileCode(argument);
  if (options.hex) {
    if (!tilecode.isAvailableHexCode()) {
      throw new Error("tilecode zoom level must be even.");
    }
    console.log(tilecode.toHexString(true));
    return;
  }
  if (options.binary) {
    console.log(tilecode.toBinaryString(true));
    return;
  }
  if (options.tileId) {
    console.log(tilecode.toString());
    return;
  }
  if (options.locationCenter) {
    const center = tilecode.getLocationCenter();
    console.log(`${center.lat},${center.lng}`);
    return;
  }
  if (options.locationStart) {
    const start = tilecode.getLocationStart();
    console.log(`${start.lat},${start.lng}`);
    return;
  }

  const map: { [key: string]: string } = {};
  if (tilecode.isAvailableHexCode()) map["Hex"] = tilecode.toHexString(true);
  map["Binary"] = tilecode.toBinaryString(true);
  map["TileId"] = tilecode.toString();
  const center = tilecode.getLocationCenter();
  map["LocationCenter"] = `${center.lat},${center.lng}`;
  const start = tilecode.getLocationStart();
  map["LocationStart"] = `${start.lat},${start.lng}`;

  if (options.formatJson) {
    printJson(map);
  } else if (options.formatTsv) {
    printTsv(map);
  } else {
    printTsv(map);
  }
}
