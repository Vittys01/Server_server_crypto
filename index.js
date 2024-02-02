import crypto from "crypto";

const generateKey = async () => {
  return crypto.subtle.generateKey({ name: "AES-CBC", length: 192 }, true, [
    "encrypt",
    "decrypt",
  ]);
};

// Export the key to an ArrayBuffer
const exportKey = async (key) => {
  return crypto.subtle.exportKey("raw", key);
};

// Import the key from an ArrayBuffer
const importKey = async (keyBuffer) => {
  return crypto.subtle.importKey("raw", keyBuffer, { name: "AES-CBC" }, true, [
    "encrypt",
    "decrypt",
  ]);
};

// Convert a string to an ArrayBuffer
const stringToArrayBuffer = (str) => {
  const encoder = new TextEncoder();
  return encoder.encode(str);
};

// Convert an ArrayBuffer to a string
const arrayBufferToString = (buffer) => {
  const decoder = new TextDecoder();
  return decoder.decode(buffer);
};

const buf2hex = (buffer) => {
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
};

function hexStringToArrayBuffer(hexString) {
  // remove the leading 0x
  hexString = hexString.replace(/^0x/, "");

  // ensure even number of characters
  if (hexString.length % 2 != 0) {
    console.log(
      "WARNING: expecting an even number of characters in the hexString"
    );
  }

  // check for some non-hex characters
  var bad = hexString.match(/[G-Z\s]/i);
  if (bad) {
    console.log("WARNING: found non-hex characters", bad);
  }

  // split the string into pairs of octets
  var pairs = hexString.match(/[\dA-F]{2}/gi);

  // convert the octets to integers
  var integers = pairs.map(function (s) {
    return parseInt(s, 16);
  });

  var array = new Uint8Array(integers);

  return array.buffer;
}

// Encrypt data with AES-192
const encrypt = async (data, key) => {
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    key,
    stringToArrayBuffer(data)
  );

  return { iv, data: new Uint8Array(encryptedBuffer) };
};

// Decrypt data with AES-192
const decrypt = async (encryptedData, key) => {
  const { iv, data } = encryptedData;
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv },
    key,
    data
  );

  return arrayBufferToString(decryptedBuffer);
};
( async function () {
  const encryptedDataHex = "d6a60c3535491b50c7654c6dbb0df3cec3c358d81d8fa9ef0f412801d784c00828dfa4fc595d0fa600a1f843929970c7c21122cce30138374e84fef4ffbbc6d333bbe77e93941e5ff7fba768685ef61b";
  const ivHex = "263611e818f2f8c62c08ce9428f88a89";

  const encryptedDataArrayBuffer =  hexStringToArrayBuffer(encryptedDataHex);
  const ivArrayBuffer =  hexStringToArrayBuffer(ivHex);

  const objeto = {
    iv: ivArrayBuffer,
    data:encryptedDataArrayBuffer
  }
  // Import the key
  const key = await importKey(stringToArrayBuffer("e8c40a8d-4fba-4afb-bee5-0029141775dc".replace(/-/g, "")));
  // Decrypt the data
  const decryptedData = await decrypt(objeto, key);
  console.log(decryptedData);
  console.log( generateKey() );
} )();

