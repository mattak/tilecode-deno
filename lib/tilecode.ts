export interface Location {
  lat: number;
  lng: number;
}

export class TileIdConverter {
  // cf. https://developers.google.com/maps/documentation/javascript/examples/map-coordinates
  static location2tile(
    zoom: number,
    lat: number,
    lng: number,
  ): [number, number] {
    const scale = 1 << zoom;
    let siny = Math.sin(lat * Math.PI / 180);
    siny = Math.min(Math.max(siny, -0.9999), 0.9999);

    const x = Math.floor((0.5 + lng / 360) * scale);
    const y = Math.floor(
      (
        0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)
      ) * scale,
    );
    return [x, y];
  }

  // cf. https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_(JavaScript/ActionScript,_etc.)
  static tile2location(zoom: number, x: number, y: number): [number, number] {
    const scale = 1 << Math.floor(zoom);
    const lng = x / scale * 360 - 180;
    const n = Math.PI - 2 * Math.PI * y / scale;
    const lat = 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
    return [lat, lng];
  }
}

export class TileCode {
  zoom: number;
  x: number;
  y: number;

  constructor(zoom: number, x: number, y: number) {
    this.zoom = zoom;
    this.x = x;
    this.y = y;
  }

  getHex(): number[] {
    if (this.zoom % 2 != 0) {
      throw Error("Invalid zoom level. zoom must be divided by 2");
    }
    const level = Math.floor(this.zoom / 2);
    const array: number[] = [];

    for (let i = 0; i < level; i++) {
      let v = 0;
      for (let k = 0; k < 2; k++) {
        const z: number = (this.zoom - 1) - (i * 2) - k;
        const ref: number = 1 << z;
        if ((this.x & ref) != 0) v |= 1 << (2 * (1 - k) + 1);
        if ((this.y & ref) != 0) v |= 1 << (2 * (1 - k));
      }
      array.push(v);
    }

    return array;
  }

  getBinary(): number[] {
    const array: number[] = [];
    for (let i = 0; i < this.zoom; i++) {
      const ax = this.x >> (this.zoom - i - 1) & 0x01;
      const ay = this.y >> (this.zoom - i - 1) & 0x01;
      array.push(ax);
      array.push(ay);
    }
    return array;
  }

  toHexString(withPrefix: boolean): string {
    let result = withPrefix ? "0x" : "";
    const buffer = this.getHex();
    result += buffer.map((e) => e.toString(16)).join("");
    return result;
  }

  toBinaryString(withPrefix: boolean): string {
    let result = withPrefix ? "0b" : "";
    const buffer = this.getBinary();
    result += buffer.map((e) => e == 1 ? "1" : "0").join("");
    return result;
  }

  toString(): string {
    return `${this.zoom}/${this.x}/${this.y}`;
  }

  getLocationStart(): Location {
    const v = TileIdConverter.tile2location(this.zoom, this.x, this.y);
    return { lat: v[0], lng: v[1] };
  }

  getLocationCenter(): Location {
    const v = TileIdConverter.tile2location(
      this.zoom,
      this.x + 0.5,
      this.y + 0.5,
    );
    return { lat: v[0], lng: v[1] };
  }

  plus(ax: number, ay: number): TileCode {
    const limit = 1 << this.zoom;
    const nx = (this.x + ax) % limit;
    const ny = (this.y + ay) % limit;
    return new TileCode(this.zoom, nx, ny);
  }

  isAvailableHexCode(): boolean {
    return this.zoom % 2 == 0;
  }

  static fromLocation(
    zoom: number,
    latitude: number,
    longitude: number,
  ): TileCode {
    const v = TileIdConverter.location2tile(zoom, latitude, longitude);
    return new TileCode(zoom, v[0], v[1]);
  }

  static fromHex(numbers: number[]): TileCode {
    const z = numbers.length * 2;
    let sx = 0;
    let sy = 0;
    for (let i = 0; i < numbers.length; i++) {
      let x = 0;
      let y = 0;
      x += (numbers[i] & 0b1000) >> 2;
      x += (numbers[i] & 0b0010) >> 1;
      y += (numbers[i] & 0b0100) >> 1;
      y += (numbers[i] & 0b0001) >> 0;
      sx += x << (2 * (numbers.length - i - 1));
      sy += y << (2 * (numbers.length - i - 1));
    }
    return new TileCode(z, sx, sy);
  }

  static fromBinary(numbers: number[]): TileCode {
    if (numbers.length % 2 != 0) throw Error("numbers must be even size");
    const z = numbers.length / 2;
    let x = 0;
    let y = 0;
    for (let i = 0; i < z; i++) {
      const cx = numbers[2 * i];
      const cy = numbers[2 * i + 1];
      if (cx == 1) {
        x += 1 << (z - i - 1);
      }
      if (cy == 1) {
        y += 1 << (z - i - 1);
      }
    }
    return new TileCode(z, x, y);
  }

  static fromHexString(text: string): TileCode {
    text = text.replace(/^0x/, "");
    if (text.length < 1) return new TileCode(0, 0, 0);
    const numbers = text.match(/.{1}/g)!.map((b) => parseInt(b, 16));
    return TileCode.fromHex(numbers);
  }

  static fromBinaryString(text: string): TileCode {
    text = text.replace(/^0b/, "");
    if (text.length < 1) return new TileCode(0, 0, 0);
    const numbers = text.match(/.{1}/g)!.map((b) => parseInt(b, 2));
    return TileCode.fromBinary(numbers);
  }
}
