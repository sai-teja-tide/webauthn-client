export interface IRegisterPayload {
  username: string;
  name: string;
}

export interface IRecoveryResponse {
  "data": IRecoveryData
}

export interface IRecoveryData {
  "challenge": string,
  "timeout": number,
  "credentialId": string
}

export const userId = "2201479d-f073-4de0-8147-9df073cde0ba"
