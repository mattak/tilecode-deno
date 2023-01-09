import { TileCode } from "./tilecode.ts";

export function parseTileCode(argument: string): TileCode {
  if (argument.includes("/")) {
    return parseTileId(argument);
  } else if (argument.startsWith("0x")) {
    return parseHexCode(argument);
  } else if (argument.startsWith("0b")) {
    return parseBinaryCode(argument);
  } else if (argument.includes(",")) {
    return parseZoomLatLng(argument);
  }
  throw new Error(`Argument is not matched pattern: ${argument}`);
}

function parseTileId(tileId: string): TileCode {
  const args = tileId.split("/");
  const zoom = Number.parseInt(args[0]);
  const x = Number.parseInt(args[1]);
  const y = Number.parseInt(args[2]);
  return new TileCode(zoom, x, y);
}

function parseZoomLatLng(zoomLatLng: string): TileCode {
  const args = zoomLatLng.split(",");
  const zoom = Number.parseFloat(args[0]);
  const lat = Number.parseFloat(args[1]);
  const lng = Number.parseFloat(args[2]);
  return TileCode.fromLocation(zoom, lat, lng);
}

function parseHexCode(text: string): TileCode {
  return TileCode.fromHexString(text);
}

function parseBinaryCode(text: string): TileCode {
  return TileCode.fromBinaryString(text);
}
