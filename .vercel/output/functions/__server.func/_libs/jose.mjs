const encoder = new TextEncoder();
const decoder = new TextDecoder();
const strictDecoder = new TextDecoder("utf-8", { fatal: true });
function concat(...buffers) {
  const size = buffers.reduce((acc, { length }) => acc + length, 0);
  const buf = new Uint8Array(size);
  let i = 0;
  for (const buffer of buffers) {
    buf.set(buffer, i);
    i += buffer.length;
  }
  return buf;
}
function encode(string) {
  const bytes = new Uint8Array(string.length);
  for (let i = 0; i < string.length; i++) {
    const code = string.charCodeAt(i);
    if (code > 127) {
      throw new TypeError("non-ASCII string encountered in encode()");
    }
    bytes[i] = code;
  }
  return bytes;
}
const unusable = (name, prop = "algorithm.name") => new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`);
function checkUsage(key, usage) {
  if (!key.usages.includes(usage)) {
    throw new TypeError(`CryptoKey does not support this operation, its usages must include ${usage}.`);
  }
}
function checkModulusLength(alg, key) {
  const { modulusLength } = key.algorithm;
  if (typeof modulusLength !== "number" || modulusLength < 2048) {
    throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`);
  }
}
function checkCryptoKey(key, expected, usage) {
  const algorithm = key.algorithm;
  if (algorithm.name !== expected.name) {
    throw unusable(expected.name);
  }
  if (expected.hash && algorithm.hash?.name !== expected.hash) {
    throw unusable(expected.hash, "algorithm.hash");
  }
  if (expected.namedCurve && algorithm.namedCurve !== expected.namedCurve) {
    throw unusable(expected.namedCurve, "algorithm.namedCurve");
  }
  if (expected.length !== void 0 && algorithm.length !== expected.length) {
    throw unusable(expected.length, "algorithm.length");
  }
  checkUsage(key, usage);
}
function message(msg, actual, ...types) {
  if (types.length > 2) {
    const last = types.pop();
    msg += `one of type ${types.join(", ")}, or ${last}.`;
  } else if (types.length === 2) {
    msg += `one of type ${types[0]} or ${types[1]}.`;
  } else {
    msg += `of type ${types[0]}.`;
  }
  if (actual == null) {
    msg += ` Received ${actual}`;
  } else if (typeof actual === "function" && actual.name) {
    msg += ` Received function ${actual.name}`;
  } else if (typeof actual === "object" && actual != null) {
    if (actual.constructor?.name) {
      msg += ` Received an instance of ${actual.constructor.name}`;
    }
  }
  return msg;
}
const withAlg = (alg, actual, ...types) => message(`Key for the ${alg} algorithm must be `, actual, ...types);
class JOSEError extends Error {
  static code = "ERR_JOSE_GENERIC";
  code = "ERR_JOSE_GENERIC";
  constructor(message2, options) {
    super(message2, options);
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
}
class JWTClaimValidationFailed extends JOSEError {
  static code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
  code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
  claim;
  reason;
  payload;
  constructor(message2, payload, claim = "unspecified", reason = "unspecified") {
    super(message2, { cause: { claim, reason, payload } });
    this.claim = claim;
    this.reason = reason;
    this.payload = payload;
  }
}
class JWTExpired extends JOSEError {
  static code = "ERR_JWT_EXPIRED";
  code = "ERR_JWT_EXPIRED";
  claim;
  reason;
  payload;
  constructor(message2, payload, claim = "unspecified", reason = "unspecified") {
    super(message2, { cause: { claim, reason, payload } });
    this.claim = claim;
    this.reason = reason;
    this.payload = payload;
  }
}
class JOSEAlgNotAllowed extends JOSEError {
  static code = "ERR_JOSE_ALG_NOT_ALLOWED";
  code = "ERR_JOSE_ALG_NOT_ALLOWED";
}
class JOSENotSupported extends JOSEError {
  static code = "ERR_JOSE_NOT_SUPPORTED";
  code = "ERR_JOSE_NOT_SUPPORTED";
}
class JWSInvalid extends JOSEError {
  static code = "ERR_JWS_INVALID";
  code = "ERR_JWS_INVALID";
}
class JWTInvalid extends JOSEError {
  static code = "ERR_JWT_INVALID";
  code = "ERR_JWT_INVALID";
}
class JWKSInvalid extends JOSEError {
  static code = "ERR_JWKS_INVALID";
  code = "ERR_JWKS_INVALID";
}
class JWKSNoMatchingKey extends JOSEError {
  static code = "ERR_JWKS_NO_MATCHING_KEY";
  code = "ERR_JWKS_NO_MATCHING_KEY";
  constructor(message2 = "no applicable key found in the JSON Web Key Set", options) {
    super(message2, options);
  }
}
class JWKSMultipleMatchingKeys extends JOSEError {
  [Symbol.asyncIterator] = async function* () {
  };
  static code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
  code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
  constructor(message2 = "multiple matching keys found in the JSON Web Key Set", options) {
    super(message2, options);
  }
}
class JWSSignatureVerificationFailed extends JOSEError {
  static code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
  code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
  constructor(message2 = "signature verification failed", options) {
    super(message2, options);
  }
}
const isCryptoKey = (key) => {
  if (key?.[Symbol.toStringTag] === "CryptoKey")
    return true;
  try {
    return key instanceof CryptoKey;
  } catch {
    return false;
  }
};
const isKeyObject = (key) => key?.[Symbol.toStringTag] === "KeyObject";
const isKeyLike = (key) => isCryptoKey(key) || isKeyObject(key);
function decodeBase64(encoded) {
  if (Uint8Array.fromBase64) {
    return Uint8Array.fromBase64(encoded);
  }
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
const invalid = "The input to be decoded is not correctly encoded.";
function decode(input) {
  if (Uint8Array.fromBase64) {
    try {
      return Uint8Array.fromBase64(typeof input === "string" ? input : decoder.decode(input), {
        alphabet: "base64url"
      });
    } catch (cause) {
      throw new TypeError(invalid, { cause });
    }
  }
  let encoded = input;
  if (encoded instanceof Uint8Array) {
    encoded = decoder.decode(encoded);
  }
  if (encoded.includes("+") || encoded.includes("/")) {
    throw new TypeError(invalid);
  }
  encoded = encoded.replace(/-/g, "+").replace(/_/g, "/");
  try {
    return decodeBase64(encoded);
  } catch {
    throw new TypeError(invalid);
  }
}
function isObject(input) {
  if (typeof input !== "object" || input === null || Object.prototype.toString.call(input) !== "[object Object]") {
    return false;
  }
  const prototype = Object.getPrototypeOf(input);
  if (prototype === null) {
    return true;
  }
  let proto = prototype;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return prototype === proto;
}
function isDisjoint(...headers) {
  const parameters = /* @__PURE__ */ new Set();
  for (const header of headers) {
    if (!header)
      continue;
    for (const parameter of Object.keys(header)) {
      if (parameters.has(parameter)) {
        return false;
      }
      parameters.add(parameter);
    }
  }
  return true;
}
const isJWK = (key) => isObject(key) && typeof key.kty === "string";
const isPublicJWK = (key) => key.kty !== "oct" && key.d === void 0 && key.priv === void 0;
const isSecretJWK = (key) => key.kty === "oct" && typeof key.k === "string";
function decodeBase64url(value, label, ErrorClass) {
  try {
    return decode(value);
  } catch {
    throw new ErrorClass(`Failed to base64url decode the ${label}`);
  }
}
function encodeBase64url(value, label, ErrorClass) {
  try {
    return encode(value);
  } catch {
    throw new ErrorClass(`The ${label} is not a valid base64url string`);
  }
}
function parseJoseHeader(b64, ErrorClass, message2) {
  let parsed;
  try {
    parsed = JSON.parse(strictDecoder.decode(decode(b64)));
  } catch {
    throw new ErrorClass(message2);
  }
  if (!isObject(parsed)) {
    throw new ErrorClass(message2);
  }
  return parsed;
}
async function jwkToKey(entry, jwk) {
  if (jwk.kty === "RSA" && "oth" in jwk && jwk.oth !== void 0) {
    throw new JOSENotSupported('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');
  }
  if (!entry.kty.includes(jwk.kty)) {
    throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
  }
  const algorithm = entry.resolve?.({ kty: jwk.kty, crv: jwk.crv }) ?? entry.subtle;
  const isPrivate = !!(jwk.d || jwk.priv);
  const keyData = { ...jwk };
  if (keyData.kty !== "AKP") {
    delete keyData.alg;
  }
  delete keyData.use;
  return crypto.subtle.importKey("jwk", keyData, algorithm, jwk.ext ?? !isPrivate, jwk.key_ops ?? entry.usages[isPrivate ? 1 : 0]);
}
const tag = (key) => key[Symbol.toStringTag];
const jwkMatchesOp = (entry, key, usage) => {
  const { alg } = entry;
  if (key.use !== void 0) {
    const expected = "sig";
    if (key.use !== expected) {
      throw new TypeError(`Invalid key for this operation, its "use" must be "${expected}" when present`);
    }
  }
  if (key.alg !== void 0 && key.alg !== alg) {
    throw new TypeError(`Invalid key for this operation, its "alg" must be "${alg}" when present`);
  }
  if (Array.isArray(key.key_ops)) {
    const expectedKeyOp = usage;
    if (!key.key_ops.includes(expectedKeyOp)) {
      throw new TypeError(`Invalid key for this operation, its "key_ops" must include "${expectedKeyOp}" when present`);
    }
  }
};
function checkKeyType(entry, key, usage) {
  const { alg, secret } = entry;
  if (secret && key instanceof Uint8Array)
    return [BYTES, key];
  if (isJWK(key)) {
    if (secret ? !isSecretJWK(key) : !isPublicJWK(key)) {
      throw new TypeError(secret ? `JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present` : `JSON Web Key for this operation must be a ${"public"} JWK`);
    }
    jwkMatchesOp(entry, key, usage);
    return [JWK, key];
  }
  if (!isKeyLike(key)) {
    throw new TypeError(secret ? withAlg(alg, key, "CryptoKey", "KeyObject", "JSON Web Key", "Uint8Array") : withAlg(alg, key, "CryptoKey", "KeyObject", "JSON Web Key"));
  }
  if (secret) {
    if (key.type !== "secret") {
      throw new TypeError(`${tag(key)} instances for symmetric algorithms must be of type "secret"`);
    }
  } else {
    if (key.type === "secret") {
      throw new TypeError(`${tag(key)} instances for asymmetric algorithms must not be of type "secret"`);
    }
    const expectedType = "public";
    if ((key.type === "public" || key.type === "private") && key.type !== expectedType) {
      const operation = "verifying";
      throw new TypeError(`${tag(key)} instances for asymmetric algorithm ${operation} must be of type "${expectedType}"`);
    }
  }
  return isCryptoKey(key) ? [CRYPTO, key] : [KEYOBJECT, key];
}
const BYTES = 0;
const CRYPTO = 1;
const KEYOBJECT = 2;
const JWK = 3;
let cache;
const nist = {
  __proto__: null,
  prime256v1: "P-256",
  secp384r1: "P-384",
  secp521r1: "P-521"
};
function cached(key, alg, value) {
  cache ||= /* @__PURE__ */ new WeakMap();
  const entry = cache.get(key);
  if (value) {
    if (entry) {
      entry[alg] = value;
    } else {
      cache.set(key, { __proto__: null, [alg]: value });
    }
  }
  return value ?? entry?.[alg];
}
const handleJWK = async (key, jwk, entry) => cached(key, entry.alg) ?? cached(key, entry.alg, await jwkToKey(entry, { ...jwk, alg: entry.alg }));
const handleKeyObject = (keyObject, entry) => {
  const hit = cached(keyObject, entry.alg);
  if (hit)
    return hit;
  const isPublic = keyObject.type === "public";
  const usages = entry.usages[isPublic ? 0 : 1];
  const { asymmetricKeyType } = keyObject;
  const crv = nist[keyObject.asymmetricKeyDetails?.namedCurve];
  const params = entry.resolve?.({ crv, asymmetricKeyType }) ?? entry.subtle;
  return cached(keyObject, entry.alg, keyObject.toCryptoKey(params, isPublic, usages));
};
async function prepareKey(entry, key, usage) {
  const tagged = checkKeyType(entry, key, usage);
  switch (tagged[0]) {
    case BYTES:
    case CRYPTO:
      return tagged[1];
    case JWK: {
      const key2 = tagged[1];
      if (key2.k) {
        return decode(key2.k);
      }
      if (!Object.isFrozen(key2)) {
        const { key_ops } = key2;
        if (Array.isArray(key_ops))
          Object.freeze(key_ops);
        Object.freeze(key2);
      }
      return handleJWK(key2, key2, entry);
    }
    case KEYOBJECT: {
      const keyObject = tagged[1];
      if (keyObject.type === "secret") {
        return keyObject.export();
      }
      if ("toCryptoKey" in keyObject && typeof keyObject.toCryptoKey === "function") {
        return handleKeyObject(keyObject, entry);
      }
      return handleJWK(keyObject, keyObject.export({ format: "jwk" }), entry);
    }
  }
}
function table(entries) {
  const out = { __proto__: null };
  for (const alg in entries) {
    out[alg] = { ...entries[alg], alg };
  }
  return out;
}
const JWS_RECOGNIZED = { __proto__: null, b64: true };
function validateAlgorithms(option, algorithms) {
  if (algorithms !== void 0 && (!Array.isArray(algorithms) || algorithms.some((s) => typeof s !== "string"))) {
    throw new TypeError(`"${option}" option must be an array of strings`);
  }
  if (!algorithms) {
    return void 0;
  }
  return new Set(algorithms);
}
function validateCrit(Err, recognizedDefault, recognizedOption, protectedHeader, joseHeader) {
  if (joseHeader.crit !== void 0 && protectedHeader?.crit === void 0) {
    throw new Err('"crit" (Critical) Header Parameter MUST be integrity protected');
  }
  if (!protectedHeader || protectedHeader.crit === void 0) {
    return [];
  }
  if (!Array.isArray(protectedHeader.crit) || protectedHeader.crit.length === 0 || protectedHeader.crit.some((input) => typeof input !== "string" || input.length === 0)) {
    throw new Err('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
  }
  const recognized = recognizedOption === void 0 ? recognizedDefault : { __proto__: null, ...recognizedOption, ...recognizedDefault };
  for (const parameter of protectedHeader.crit) {
    if (!(parameter in recognized)) {
      throw new JOSENotSupported(`Extension Header Parameter "${parameter}" is not recognized`);
    }
    if (!Object.hasOwn(joseHeader, parameter) || joseHeader[parameter] === void 0) {
      throw new Err(`Extension Header Parameter "${parameter}" is missing`);
    }
    if (recognized[parameter] && (!Object.hasOwn(protectedHeader, parameter) || protectedHeader[parameter] === void 0)) {
      throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`);
    }
  }
  return protectedHeader.crit;
}
async function getSigKey(entry, key, usage) {
  if (key instanceof Uint8Array) {
    return crypto.subtle.importKey("raw", key, entry.subtle, false, [
      usage
    ]);
  }
  checkCryptoKey(key, entry.subtle, usage);
  if (entry.minRsaBits)
    checkModulusLength(entry.alg, key);
  return key;
}
async function verify(entry, key, signature, data) {
  const cryptoKey = await getSigKey(entry, key, "verify");
  try {
    return await crypto.subtle.verify(entry.signing, cryptoKey, signature, data);
  } catch {
    return false;
  }
}
const sig = [["verify"], ["sign"]];
function hmac(bits) {
  const subtle = { name: "HMAC", hash: `SHA-${bits}` };
  return { kty: ["oct"], secret: true, subtle, signing: subtle, usages: sig };
}
function rsa(bits, saltLength) {
  const name = saltLength ? "RSA-PSS" : "RSASSA-PKCS1-v1_5";
  const subtle = { name, hash: `SHA-${bits}` };
  return {
    kty: ["RSA"],
    subtle,
    signing: saltLength ? { ...subtle, saltLength } : subtle,
    usages: sig,
    minRsaBits: 2048
  };
}
function ecdsa(crv, bits) {
  return {
    kty: ["EC"],
    crv,
    subtle: { name: "ECDSA", namedCurve: crv },
    signing: { name: "ECDSA", hash: `SHA-${bits}` },
    usages: sig
  };
}
function eddsa() {
  const subtle = { name: "Ed25519" };
  return {
    kty: ["OKP"],
    crv: "Ed25519",
    subtle,
    signing: subtle,
    usages: sig
  };
}
function mldsa(bits) {
  const name = `ML-DSA-${bits}`;
  const subtle = { name };
  return {
    kty: ["AKP"],
    subtle,
    signing: subtle,
    usages: sig
  };
}
const JWS = table({
  HS256: hmac(256),
  HS384: hmac(384),
  HS512: hmac(512),
  RS256: rsa(256),
  RS384: rsa(384),
  RS512: rsa(512),
  PS256: rsa(256, 32),
  PS384: rsa(384, 48),
  PS512: rsa(512, 64),
  ES256: ecdsa("P-256", 256),
  ES384: ecdsa("P-384", 384),
  ES512: ecdsa("P-521", 512),
  EdDSA: eddsa(),
  Ed25519: eddsa(),
  "ML-DSA-44": mldsa(44),
  "ML-DSA-65": mldsa(65),
  "ML-DSA-87": mldsa(87)
});
function jwsAlgorithm(alg) {
  const entry = typeof alg === "string" ? JWS[alg] : void 0;
  if (!entry) {
    throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
  }
  return entry;
}
function prepareVerify(options) {
  return [options && validateAlgorithms("algorithms", options.algorithms), options?.crit];
}
async function verifySignature(jws, shared, key) {
  const { protected: encodedProtected, header, payload: inputPayload } = jws;
  let parsedProt = {};
  if (encodedProtected) {
    parsedProt = parseJoseHeader(encodedProtected, JWSInvalid, "JWS Protected Header is invalid");
  }
  let joseHeader;
  if (header !== void 0) {
    if (!isDisjoint(parsedProt, header)) {
      throw new JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
    }
    joseHeader = { ...parsedProt, ...header };
  } else {
    joseHeader = parsedProt;
  }
  const extensions = validateCrit(JWSInvalid, JWS_RECOGNIZED, shared[1], parsedProt, joseHeader);
  let b64 = true;
  if (extensions.includes("b64")) {
    b64 = parsedProt.b64;
    if (typeof b64 !== "boolean") {
      throw new JWSInvalid('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
    }
  }
  const { alg } = joseHeader;
  if (typeof alg !== "string" || !alg) {
    throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
  }
  if (shared[0] && !shared[0].has(alg)) {
    throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter value not allowed');
  }
  if (b64) {
    if (typeof inputPayload !== "string") {
      throw new JWSInvalid("JWS Payload must be a string");
    }
  } else if (typeof inputPayload !== "string" && !(inputPayload instanceof Uint8Array)) {
    throw new JWSInvalid("JWS Payload must be a string or an Uint8Array instance");
  }
  let resolvedKey = false;
  if (typeof key === "function") {
    key = await key(parsedProt, jws);
    resolvedKey = true;
  }
  const entry = jwsAlgorithm(alg);
  const data = concat(encodedProtected !== void 0 ? encode(encodedProtected) : new Uint8Array(), encode("."), typeof inputPayload === "string" ? b64 ? shared[2] ??= encodeBase64url(inputPayload, "payload", JWSInvalid) : encoder.encode(inputPayload) : inputPayload);
  const signature = decodeBase64url(jws.signature, "signature", JWSInvalid);
  const k = await prepareKey(entry, key, "verify");
  const verified = await verify(entry, k, signature, data);
  if (!verified) {
    throw new JWSSignatureVerificationFailed();
  }
  let payload;
  if (b64) {
    payload = decodeBase64url(inputPayload, "payload", JWSInvalid);
  } else if (typeof inputPayload === "string") {
    payload = encoder.encode(inputPayload);
  } else {
    payload = inputPayload;
  }
  return [payload, parsedProt, b64, k, resolvedKey];
}
async function verifyCompact(jws, shared, key) {
  if (jws instanceof Uint8Array) {
    jws = decoder.decode(jws);
  }
  if (typeof jws !== "string") {
    throw new JWSInvalid("Compact JWS must be a string or Uint8Array");
  }
  const { 0: protectedHeader, 1: payload, 2: signature, length } = jws.split(".");
  if (length !== 3) {
    throw new JWSInvalid("Invalid Compact JWS");
  }
  return verifySignature({ payload, protected: protectedHeader, signature }, shared, key);
}
const epoch = (date) => Math.floor(date.getTime() / 1e3);
const multipliers = {
  s: 1,
  m: 60,
  h: 3600,
  d: 86400,
  w: 604800,
  y: 31557600
};
const REGEX = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
const checkFailed = "check_failed";
function secs(str) {
  const matched = REGEX.exec(str);
  if (!matched || matched[4] && matched[1]) {
    throw new TypeError("Invalid time period format");
  }
  const value = parseFloat(matched[2]);
  const numericDate = Math.round(value * multipliers[matched[3][0].toLowerCase()]);
  if (matched[1] === "-" || matched[4] === "ago") {
    return -numericDate;
  }
  return numericDate;
}
function validateInput(label, input) {
  if (!Number.isFinite(input)) {
    throw new TypeError(`Invalid ${label} input`);
  }
  return input;
}
const normalizeTyp = (value) => {
  if (value.includes("/")) {
    return value.toLowerCase();
  }
  return `application/${value.toLowerCase()}`;
};
const checkAudiencePresence = (audPayload, audOption) => {
  if (typeof audPayload === "string") {
    return audOption.includes(audPayload);
  }
  if (Array.isArray(audPayload)) {
    return audOption.some((aud) => audPayload.includes(aud));
  }
  return false;
};
function validateNumericDate(payload, claim, required = false) {
  const value = payload[claim];
  if (value === void 0 && !required)
    return void 0;
  if (typeof value !== "number") {
    throw new JWTClaimValidationFailed(`"${claim}" claim must be a number`, payload, claim, "invalid");
  }
  return value;
}
function unexpectedClaim(payload, claim) {
  throw new JWTClaimValidationFailed(`unexpected "${claim}" claim value`, payload, claim, checkFailed);
}
function validateClaimsSet(protectedHeader, encodedPayload, options = {}) {
  let payload;
  try {
    payload = JSON.parse(strictDecoder.decode(encodedPayload));
  } catch {
  }
  if (!isObject(payload)) {
    throw new JWTInvalid("JWT Claims Set must be a top-level JSON object");
  }
  const { typ } = options;
  if (typ && (typeof protectedHeader.typ !== "string" || normalizeTyp(protectedHeader.typ) !== normalizeTyp(typ))) {
    throw new JWTClaimValidationFailed('unexpected "typ" JWT header value', payload, "typ", checkFailed);
  }
  const { requiredClaims = [], issuer, subject, audience, maxTokenAge } = options;
  const presenceCheck = [...requiredClaims];
  if (maxTokenAge !== void 0)
    presenceCheck.push("iat");
  if (audience !== void 0)
    presenceCheck.push("aud");
  if (subject !== void 0)
    presenceCheck.push("sub");
  if (issuer !== void 0)
    presenceCheck.push("iss");
  for (const claim of new Set(presenceCheck.reverse())) {
    if (!Object.hasOwn(payload, claim)) {
      throw new JWTClaimValidationFailed(`missing required "${claim}" claim`, payload, claim, "missing");
    }
  }
  if (issuer !== void 0 && !(Array.isArray(issuer) ? issuer : [issuer]).includes(payload.iss)) {
    unexpectedClaim(payload, "iss");
  }
  if (subject !== void 0 && payload.sub !== subject) {
    unexpectedClaim(payload, "sub");
  }
  if (audience !== void 0 && !checkAudiencePresence(payload.aud, typeof audience === "string" ? [audience] : audience)) {
    unexpectedClaim(payload, "aud");
  }
  const { clockTolerance } = options;
  let tolerance = 0;
  if (typeof clockTolerance === "string") {
    tolerance = secs(clockTolerance);
  } else if (clockTolerance !== void 0) {
    if (typeof clockTolerance !== "number") {
      throw new TypeError("Invalid clockTolerance option type");
    }
    tolerance = clockTolerance;
  }
  validateInput("clockTolerance option", tolerance);
  const { currentDate } = options;
  const now = validateInput("currentDate option", epoch(currentDate || /* @__PURE__ */ new Date()));
  const iat = validateNumericDate(payload, "iat", maxTokenAge !== void 0);
  const nbf = validateNumericDate(payload, "nbf");
  if (nbf !== void 0) {
    if (nbf > now + tolerance) {
      throw new JWTClaimValidationFailed('"nbf" claim timestamp check failed', payload, "nbf", checkFailed);
    }
  }
  const exp = validateNumericDate(payload, "exp");
  if (exp !== void 0) {
    if (exp <= now - tolerance) {
      throw new JWTExpired('"exp" claim timestamp check failed', payload, "exp", checkFailed);
    }
  }
  if (maxTokenAge !== void 0) {
    const age = now - iat;
    const max = typeof maxTokenAge === "number" ? maxTokenAge : secs(maxTokenAge);
    if (age - tolerance > max) {
      throw new JWTExpired('"iat" claim timestamp check failed (too far in the past)', payload, "iat", checkFailed);
    }
    if (age < 0 - tolerance) {
      throw new JWTClaimValidationFailed('"iat" claim timestamp check failed (it should be in the past)', payload, "iat", checkFailed);
    }
  }
  return payload;
}
async function jwtVerify(jwt, key, options) {
  const verified = await verifyCompact(jwt, prepareVerify(options), key);
  if (!verified[2]) {
    throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
  }
  const payload = validateClaimsSet(verified[1], verified[0], options);
  const result = { payload, protectedHeader: verified[1] };
  if (typeof key === "function") {
    return { ...result, key: verified[3] };
  }
  return result;
}
function signatureAlgorithm(alg) {
  const entry = typeof alg === "string" ? JWS[alg] : void 0;
  if (!entry || entry.secret) {
    throw new JOSENotSupported('Unsupported "alg" value for a JSON Web Key Set');
  }
  return entry;
}
function isJWKSLike(jwks) {
  if (!jwks || typeof jwks !== "object") {
    return false;
  }
  const { keys } = jwks;
  return Array.isArray(keys) && keys.every(isObject);
}
class LocalJWKSetImpl {
  #jwks;
  #cached = /* @__PURE__ */ new WeakMap();
  constructor(jwks) {
    if (!isJWKSLike(jwks)) {
      throw new JWKSInvalid("JSON Web Key Set malformed");
    }
    this.#jwks = structuredClone(jwks);
  }
  jwks() {
    return this.#jwks;
  }
  async getKey(protectedHeader, token) {
    const { alg, kid } = { ...protectedHeader, ...token?.header };
    const entry = signatureAlgorithm(alg);
    const candidates = this.#jwks.keys.filter((jwk2) => entry.kty.includes(jwk2.kty) && (typeof kid !== "string" || kid === jwk2.kid) && (!(typeof jwk2.alg === "string" || jwk2.kty === "AKP") || alg === jwk2.alg) && (typeof jwk2.use !== "string" || jwk2.use === "sig") && (!Array.isArray(jwk2.key_ops) || jwk2.key_ops.includes("verify")) && (!entry.crv || jwk2.crv === entry.crv));
    const { 0: jwk, length } = candidates;
    if (length === 0) {
      throw new JWKSNoMatchingKey();
    }
    if (length !== 1) {
      const error = new JWKSMultipleMatchingKeys();
      const _cached = this.#cached;
      error[Symbol.asyncIterator] = async function* () {
        for (const jwk2 of candidates) {
          try {
            yield await importWithAlgCache(_cached, jwk2, entry);
          } catch {
          }
        }
      };
      throw error;
    }
    return importWithAlgCache(this.#cached, jwk, entry);
  }
}
async function importWithAlgCache(cache2, jwk, entry) {
  const cached2 = cache2.get(jwk) || cache2.set(jwk, { __proto__: null }).get(jwk);
  if (cached2[entry.alg] === void 0) {
    const key = await jwkToKey(entry, { ...jwk, alg: entry.alg, ext: true });
    if (key.type !== "public") {
      throw new JWKSInvalid("JSON Web Key Set members must be public keys");
    }
    cached2[entry.alg] = key;
  }
  return cached2[entry.alg];
}
function createLocalJWKSet(jwks) {
  const set = new LocalJWKSetImpl(jwks);
  const localJWKSet = async (protectedHeader, token) => set.getKey(protectedHeader, token);
  Object.defineProperty(localJWKSet, "jwks", {
    value: () => structuredClone(set.jwks())
  });
  return localJWKSet;
}
function decodeProtectedHeader(token) {
  let protectedB64u;
  if (typeof token === "string") {
    const parts = token.split(".");
    if (parts.length === 3 || parts.length === 5) {
      [protectedB64u] = parts;
    }
  } else if (typeof token === "object" && token) {
    if ("protected" in token) {
      protectedB64u = token.protected;
    } else {
      throw new TypeError("Token does not contain a Protected Header");
    }
  }
  const invalid2 = "Invalid Token or Protected Header formatting";
  if (typeof protectedB64u !== "string" || !protectedB64u) {
    throw new TypeError(invalid2);
  }
  return parseJoseHeader(protectedB64u, TypeError, invalid2);
}
export {
  createLocalJWKSet as c,
  decodeProtectedHeader as d,
  jwtVerify as j
};
