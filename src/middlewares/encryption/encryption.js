
import CryptoJS from 'crypto-js';


const AES_128_ENCRYPT = function (rawData) {
  let key = 'cymsrniuxqtgfzva';
  let iv = 'czidrfwqugpaxvkj';
  key = CryptoJS.enc.Utf8.parse(key);
  iv = CryptoJS.enc.Utf8.parse(iv);
  const encryptData = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(rawData),
    key,
    {
      keySize: 128 / 8,
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  ).toString();
  return encryptData;
};

export default AES_128_ENCRYPT;
