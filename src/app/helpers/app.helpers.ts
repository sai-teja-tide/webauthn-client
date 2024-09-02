import { decode, encode } from './base64url.helpers';

export function publicKeyCredentialToJSON(
  pubKeyCred: Array<any> | ArrayBuffer | Object | any
): any {
  if (pubKeyCred instanceof Array) {
    let arr = [];
    for (let i of pubKeyCred) arr.push(publicKeyCredentialToJSON(i));

    return arr;
  }

  if (pubKeyCred instanceof ArrayBuffer) {
    return encode(pubKeyCred);
  }

  if (pubKeyCred instanceof Object) {
    let obj: any = {};

    for (let key in pubKeyCred) {
      obj[key] = publicKeyCredentialToJSON(pubKeyCred[key]);
    }

    return obj;
  }

  return pubKeyCred;
}

export function generateRandomBuffer(len: number) {
  len = len || 32;

  let randomBuffer = new Uint8Array(len);
  window.crypto.getRandomValues(randomBuffer);

  return randomBuffer;
}

export function preformatMakeCredReq(makeCredReq: any) {
  makeCredReq.challenge = decode(makeCredReq.challenge);
  makeCredReq.user.id = decode(makeCredReq.user.id);

  return makeCredReq;
}

export function preformatGetAssertReq(getAssert: any) {
  getAssert.challenge = decode(getAssert.challenge);

  for (let allowCred of getAssert.allowCredentials) {
    allowCred.id = decode(allowCred.id);
  }

  return getAssert;
}
