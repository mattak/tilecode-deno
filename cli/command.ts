import { Command } from "https://deno.land/x/cliffy@v0.25.7/mod.ts";
import { VERSION } from "../version.ts";
import { executeEncode } from "./command_encode.ts";

export async function runCommand() {
  await new Command()
    .name("tilecode")
    .version(VERSION)
    .description("Encode map tile id to hex code, binary code.")
    .usage(
      "<__tile_id__|__hex_code__|__binary_code__|__location__> [options]",
    )
    .example(
      "Hex",
      "Format: `0x<hex_digit>*`.\ntilecode 0x\ntilecode 0xbc\ntilecode 0xbc1a73afe",
    )
    .example(
      "Binary",
      "Format: `0b<binary_digit>*`. Binary digits length must be even.\ntilecode 0b\ntilecode 0b01\ntilecode 0b1101",
    )
    .example(
      "TileId",
      "Format: `<zoom>/<x>/<y>`.\ntilecode 0/0/0\ntilecode 1/0/1\ntilecode 18/232831/103246",
    )
    .example(
      "Location",
      "Format: `<zoom>/<latitude>/<longitude>`.\ntilecode 0,0,0\ntilecode 1,85.0,123.2\ntilecode 18,35.658789693553345,139.7454489910092",
    )
    .example("json", "tilecode --format-json 0b1101")
    .example("tsv", "tilecode --format-tsv 18/232831/103246")
    .option("--hex", "print only hex code. format: `0x<hex>*`. zoom level must be even if using this option.")
    .option("--binary", "print only binary code. format: `0b<binary>*`")
    .option("--tile-id", "print only tile id. format: `<zoom>/<x>/<y>`")
    .option(
      "--location-center",
      "print only center location of tile. format: `<lat>,<lng>`",
    )
    .option(
      "--location-start",
      "print only start location of tile. format: `<lat>,<lng>`",
    )
    .option("--format-json", "print as json format")
    .option("--format-tsv", "print as tsv format")
    .arguments(
      "<tileId_or_hex_or_binary_or_zoom_lat_lng:string> [lat:double] [lng:double]",
    )
    .action((options, ...args) => {
      executeEncode(options, args[0]);
    })
    .parse(Deno.args);
}
