# tilecode by deno

tilecode encoding/decoding implementation by deno.

## Install

```shell
$ deno install --name tilecode ./main.ts
```

The command is installed at `$HOME/.deno/bin/tilecode`

## Usage

```shell
$ tilecode <zoom> <lat> <lng>
$ tilecode <zoom/x/y>
$ tilecode <binarycode>
$ tilecode <hexcode>
```

## Example

```shell
$ tilecode 4,31.95216223802496,146.25
$ tilecode 4/14/6
$ tilecode 0xbc
$ tilecode 0b10111100
Hex	0xbc
Binary	0b10111100
TileId	4/14/6
LocationCenter	31.95216223802496,146.25
LocationStart	40.97989806962013,135
```
