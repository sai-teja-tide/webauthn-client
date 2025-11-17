const BASE64URL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

// Use a lookup table to find the index.
const BASE64URL_LOOKUP_TABLE = new Uint8Array(256);
for (let charIndex = 0; charIndex < BASE64URL_CHARS.length; charIndex++) {
  BASE64URL_LOOKUP_TABLE[BASE64URL_CHARS.charCodeAt(charIndex)] = charIndex;
}

export function encode(arrayBuffer: ArrayBuffer): string {
  const bytes = new Uint8Array(arrayBuffer);
  const byteLength = bytes.length;
  let base64UrlEncoded = '';

  for (let byteIndex = 0; byteIndex < byteLength; byteIndex += 3) {
    base64UrlEncoded += BASE64URL_CHARS[bytes[byteIndex] >> 2];
    base64UrlEncoded += BASE64URL_CHARS[((bytes[byteIndex] & 3) << 4) | (bytes[byteIndex + 1] >> 4)];
    base64UrlEncoded += BASE64URL_CHARS[((bytes[byteIndex + 1] & 15) << 2) | (bytes[byteIndex + 2] >> 6)];
    base64UrlEncoded += BASE64URL_CHARS[bytes[byteIndex + 2] & 63];
  }

  if (byteLength % 3 === 2) {
    base64UrlEncoded = base64UrlEncoded.substring(0, base64UrlEncoded.length - 1);
  } else if (byteLength % 3 === 1) {
    base64UrlEncoded = base64UrlEncoded.substring(0, base64UrlEncoded.length - 2);
  }

  return base64UrlEncoded;
}

export function decode(base64UrlString: string): ArrayBuffer {
  const bufferLength = base64UrlString.length * 0.75;
  const stringLength = base64UrlString.length;
  const bytes = new Uint8Array(bufferLength);
  let bytePosition = 0;

  for (let charIndex = 0; charIndex < stringLength; charIndex += 4) {
    const encodedChar1 = BASE64URL_LOOKUP_TABLE[base64UrlString.charCodeAt(charIndex)];
    const encodedChar2 = BASE64URL_LOOKUP_TABLE[base64UrlString.charCodeAt(charIndex + 1)];
    const encodedChar3 = BASE64URL_LOOKUP_TABLE[base64UrlString.charCodeAt(charIndex + 2)];
    const encodedChar4 = BASE64URL_LOOKUP_TABLE[base64UrlString.charCodeAt(charIndex + 3)];

    bytes[bytePosition++] = (encodedChar1 << 2) | (encodedChar2 >> 4);
    bytes[bytePosition++] = ((encodedChar2 & 15) << 4) | (encodedChar3 >> 2);
    bytes[bytePosition++] = ((encodedChar3 & 3) << 6) | (encodedChar4 & 63);
  }

  return bytes.buffer;
}
