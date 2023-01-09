# tilecode by deno

![tilecode module version](https://shield.deno.dev/x/tilecode)
![test workflow](https://github.com/mattak/tilecode-deno/actions/workflows/test.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

tilecode encoding command line app and library by deno.

## Install

```shell
deno install --name tilecode https://deno.land/x/tilecode@0.0.3/main.ts
```

The command is installed at `$HOME/.deno/bin/tilecode`

## Usage

```shell
$ tilecode <zoom,lat,lng>
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
