/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable require-jsdoc */
import CryptoJS from 'crypto-js';
import crypto from 'crypto';
import axios from 'axios';
import CircularJSON from 'circular-json';

// import config module
import config from '../config/index';

const {
  SINGLE_PAYMENT_TEST_URL,
  BULK_PAYMENT_TEST_URL,
  PAYMENT_STATUS_TEST_URL,
  GET_ACTIVE_BANKS_TEST_URL,
  PAYMENT_STATUS_BULK_TEST_URL
  //   apiKey,
  //   apiToken
} = config;

/**
 * @description defines the action for the Remita payment endpoints
 * @class remitaPaymentController
 */
class remitaPaymentController {
  /**
   *@description get All banks
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message
   *@memberof remitaPaymentController
   */

  static async getAllBanks(req, res) {
    try {
      // const merchantId = 'KUDI1234';
      const apiKey = 'S1VESTEyMzR8S1VESQ==';
      const apiToken = 'dWFBTVVGTGZRUEZaemRvVC8wYVNuRkVTc2REVi9GWGdCMHRvWHNXTnovaz0=';
      const today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth() + 1; // January is 0!
      const yyyy = today.getFullYear();
      if (dd < 10) {
        dd = `0${dd}`;
      }
      if (mm < 10) {
        mm = `0${mm}`;
      }
      const hours = today.getUTCHours();
      const minutes = today.getUTCMinutes();
      const seconds = today.getUTCSeconds();
      const timeStamp = `${yyyy}-${mm}-${dd}T${hours}:${minutes}:${seconds}+000000`;
      const d = new Date();
      const requestId = d.getTime();
      const object = apiKey + requestId + apiToken;
      //   const apiHash = CryptoJS.SHA512(apiKey + requestId + apiToken);
      //   const apiHash = CryptoJS.SHA512(object);

      const apiHash = crypto
        .createHash('sha512')
        .update(object)
        .digest('hex');

      const reqHeaders = {
        API_KEY: apiKey,
        REQUEST_ID: requestId,
        REQUEST_TS: timeStamp,
        API_DETAILS_HASH: apiHash
      };

      const getAllBank = (await axios.post(
        `${GET_ACTIVE_BANKS_TEST_URL}`,
        {},
        {
          headers: reqHeaders
        }
      )).data;
      if (getAllBank.status !== 'success') {
        return res.status(400).json({ message: 'Invalid Request' });
      }
      return res
        .status(201)
        .json({ message: 'All banks retrieved', getAllBank });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return res.status(500).json({ error });
    }
  }

  /**
   *@description get a single payment
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message
   *@memberof remitaPaymentController
   */

  static async getSinglePayment(req, res) {
    try {
      const merchantId = 'KUDI1234';
      const apiKey = 'S1VESTEyMzR8S1VESQ==';
      const apiToken = 'dWFBTVVGTGZRUEZaemRvVC8wYVNuRkVTc2REVi9GWGdCMHRvWHNXTnovaz0=';
      let fromBank = '044';
      let debitAccount = '1234565678';
      let toBank = '058';
      let creditAccount = '0582915208099';
      let narration = 'Regular Payment';
      let amount = '5000';
      let beneficiaryEmail = 'qa@test.com';

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
        );
        return encryptData;
      };


      creditAccount = AES_128_ENCRYPT(creditAccount);
      const d = new Date();
      const requestId = d.getTime();
      const randomnumber = Math.floor(Math.random() * 1101233);
      let transRef = randomnumber;

      //   const randomnumber = crypto.randomBytes(20).toString('hex');
      //   let transRef = randomnumber;
      const object = apiKey + requestId + apiToken;
      const secret = 'mySecret';
      const apiHash = crypto
        .createHmac('sha512', secret)
        .update(object)
        .digest('hex');

      toBank = AES_128_ENCRYPT(toBank);
      narration = AES_128_ENCRYPT(narration);
      amount = AES_128_ENCRYPT(amount);
      transRef = AES_128_ENCRYPT(transRef);
      fromBank = AES_128_ENCRYPT(fromBank);
      debitAccount = AES_128_ENCRYPT(debitAccount);
      beneficiaryEmail = AES_128_ENCRYPT(beneficiaryEmail);
      let dd = d.getDate();
      let mm = d.getMonth() + 1; // January is 0!
      const yyyy = d.getFullYear();
      if (dd < 10) {
        dd = `0${dd}`;
      }
      if (mm < 10) {
        mm = `0${mm}`;
      }
      const hours = d.getUTCHours();
      const minutes = d.getUTCMinutes();
      const seconds = d.getUTCSeconds();
      const timeStamp = `${yyyy}-${mm}-${dd}T${hours}:${minutes}:${seconds}+000000`;

      const body = {
        toBank,
        creditAccount,
        narration,
        amount,
        transRef,
        fromBank,
        debitAccount,
        beneficiaryEmail
      };

      const reqHeaders = {
        MERCHANT_ID: merchantId,
        API_KEY: apiKey,
        REQUEST_ID: requestId,
        REQUEST_TS: timeStamp,
        API_DETAILS_HASH: apiHash
      };
      // console.log(reqHeaders);
      const singlePayment = (await axios.post(
        `${SINGLE_PAYMENT_TEST_URL}`,
        body,
        {
          headers: reqHeaders
        }
      )).data;

      // if (singlePayment.status !== 'success') {
      //   return res.status(400).json({ message: 'Invalid Request' });
      // }
      return res
        .status(201)
        .json({ message: 'All banks retrieved', singlePayment });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   *@description  payment status
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message
   *@memberof remitaPaymentController
   */

  static async paymentStatus(req, res) {
    try {
      const merchantId = 'KUDI1234';
      const apiKey = 'S1VESTEyMzR8S1VESQ==';
      const apiToken = 'dWFBTVVGTGZRUEZaemRvVC8wYVNuRkVTc2REVi9GWGdCMHRvWHNXTnovaz0=';
      let transRef = '1110000890395';
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
        );
        return encryptData;
      };
      const d = new Date();
      const requestId = d.getTime();
      //   const apiHash = CryptoJS.SHA512(apiKey + requestId + apiToken);

      const object = apiKey + requestId + apiToken;
      const apiHash = crypto
        .createHash('sha512')
        .update(object)
        .digest('hex');
      transRef = AES_128_ENCRYPT(transRef);
      let dd = d.getDate();
      let mm = d.getMonth() + 1; // January is 0!
      const yyyy = d.getFullYear();
      if (dd < 10) {
        dd = `0${dd}`;
      }
      if (mm < 10) {
        mm = `0${mm}`;
      }
      const hours = d.getUTCHours();
      const minutes = d.getUTCMinutes();
      const seconds = d.getUTCSeconds();
      const timeStamp = `${yyyy}-${mm}-${dd}T${hours}:${minutes}:${seconds}+000000`;

      const body = {

        transRef

      };

      const reqHeaders = {
        MERCHANT_ID: merchantId,
        API_KEY: apiKey,
        REQUEST_ID: requestId,
        REQUEST_TS: timeStamp,
        API_DETAILS_HASH: apiHash
      };

      const paymentStatus = (await axios.post(`${PAYMENT_STATUS_TEST_URL}`, JSON.stringify(body), {
        headers: reqHeaders
      })).data;

      return res
        .status(201)
        .json({ message: 'Your payment status', paymentStatus });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }
}

export default remitaPaymentController;
