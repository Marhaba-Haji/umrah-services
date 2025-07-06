
import { createHash } from 'crypto';

export interface PayUConfig {
  merchantKey: string;
  salt: string;
  baseUrl: string;
  successUrl: string;
  failureUrl: string;
}

export interface PayUPaymentRequest {
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  hash: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
}

export interface PayUPaymentResponse {
  mihpayid: string;
  mode: string;
  status: string;
  unmappedstatus: string;
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  hash: string;
  field1?: string;
  field2?: string;
  field3?: string;
  field4?: string;
  field5?: string;
  error?: string;
  error_Message?: string;
}

export const generatePayUHash = (
  key: string,
  txnid: string,
  amount: string,
  productinfo: string,
  firstname: string,
  email: string,
  salt: string,
  udf1 = '',
  udf2 = '',
  udf3 = '',
  udf4 = '',
  udf5 = ''
): string => {
  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
  return createHash('sha512').update(hashString).digest('hex');
};

export const verifyPayUHash = (
  salt: string,
  status: string,
  udf1: string,
  udf2: string,
  udf3: string,
  udf4: string,
  udf5: string,
  email: string,
  firstname: string,
  productinfo: string,
  amount: string,
  txnid: string,
  key: string,
  receivedHash: string
): boolean => {
  const hashString = `${salt}|${status}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  const generatedHash = createHash('sha512').update(hashString).digest('hex');
  return generatedHash === receivedHash;
};

export const generateTransactionId = (): string => {
  return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
