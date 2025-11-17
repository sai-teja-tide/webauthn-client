import { decode, encode } from './base64url.helpers';

export function publicKeyCredentialToJSON(
  publicKeyCredential: Array<any> | ArrayBuffer | Object | any
): any {
  if (publicKeyCredential instanceof Array) {
    const jsonArray = [];
    for (const arrayItem of publicKeyCredential) {
      jsonArray.push(publicKeyCredentialToJSON(arrayItem));
    }

    return jsonArray;
  }

  if (publicKeyCredential instanceof ArrayBuffer) {
    return encode(publicKeyCredential);
  }

  if (publicKeyCredential instanceof Object) {
    const jsonObject: any = {};

    for (const propertyKey in publicKeyCredential) {
      jsonObject[propertyKey] = publicKeyCredentialToJSON(publicKeyCredential[propertyKey]);
    }

    return jsonObject;
  }

  return publicKeyCredential;
}

export function generateRandomBuffer(bufferLength: number = 32): Uint8Array {
  const randomBuffer = new Uint8Array(bufferLength);
  window.crypto.getRandomValues(randomBuffer);

  return randomBuffer;
}

export function preformatMakeCredentialRequest(makeCredentialRequest: any): any {
  makeCredentialRequest.challenge = decode(makeCredentialRequest.challenge);
  makeCredentialRequest.user.id = decode(makeCredentialRequest.user.id);

  return makeCredentialRequest;
}

export function preformatGetAssertionRequest(getAssertionRequest: any): any {
  getAssertionRequest.challenge = decode(getAssertionRequest.challenge);

  for (const allowedCredential of getAssertionRequest.allowCredentials) {
    allowedCredential.id = decode(allowedCredential.id);
  }

  return getAssertionRequest;
}
