/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable require-jsdoc */
import crypto from 'crypto';
import axios from 'axios';
import AES_128_ENCRYPT from '../middlewares/encryption/encryption';

// import config module
import config from '../config/index';


const {
  SINGLE_PAYMENT_TEST_URL,
  BULK_PAYMENT_TEST_URL,
  PAYMENT_STATUS_TEST_URL,
  GET_ACTIVE_BANKS_TEST_URL,
  PAYMENT_STATUS_BULK_TEST_URL,
  remApiKey,
  remApiToken,
  mySecret
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
      const apiKey = `${remApiKey}`;
      const apiToken = `${remApiToken}`;
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

      const secret = `${mySecret}`;


      const apiHash = crypto
        .createHash('sha512', secret)
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
        .status(200)
        .json({ message: 'All banks retrieved', getAllBank });
    } catch (error) {
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
      const apiKey = `${remApiKey}`;
      const apiToken = `${remApiToken}`;
      let fromBank = '044';
      let debitAccount = '1234565678';
      let toBank = '058';
      let creditAccount = '0582915208099';
      let narration = 'Regular Payment';
      let amount = '5000';
      let beneficiaryEmail = 'qa@test.com';

      creditAccount = AES_128_ENCRYPT(creditAccount);
      const d = new Date();
      const requestId = d.getTime();
      const randomnumber = Math.floor(Math.random() * 1101233);
      let transRef = randomnumber;

      const object = apiKey + requestId + apiToken;
      const apiHash = crypto
        .createHash('sha512')
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

      const singlePayment = (await axios.post(
        `${SINGLE_PAYMENT_TEST_URL}`,
        body,
        {
          headers: reqHeaders
        }
      )).data;
      if (singlePayment.status !== 'success') {
        return res.status(400).json({ message: 'Invalid Request' });
      }

      return res.status(200).json({ message: 'Payment Status', singlePayment });
    } catch (error) {
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
      const apiKey = `${remApiKey}`;
      const apiToken = `${remApiToken}`;
      let transRef = '1110000890395';

      const d = new Date();
      const requestId = d.getTime();

      const object = apiKey + requestId + apiToken;
      const apiHash = crypto
        .createHash('sha512')
        .update(object)
        .digest('hex');

      transRef = AES_128_ENCRYPT(transRef);

      console.log(transRef);

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

      const reqHeaders = {
        MERCHANT_ID: merchantId,
        API_KEY: apiKey,
        REQUEST_ID: requestId,
        REQUEST_TS: timeStamp,
        API_DETAILS_HASH: apiHash
      };
      const body = {
        transRef
      };

      const paymentStatus = (await axios.post(
        `${PAYMENT_STATUS_TEST_URL}`,
        body,
        {
          headers: reqHeaders
        }
      )).data;
      return res
        .status(200)
        .json({ message: 'Your payment status', paymentStatus });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   *@description  Bulk payment
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message
   *@memberof remitaPaymentController
   */

  static async bulkPayment(req, res) {
    try {
      const merchantId = 'KUDI1234';
      const apiKey = `${remApiKey}`;
      const apiToken = `${remApiToken}`;
      let bankCode = '044';
      let debitAccount = '1234565678';
      let narration = 'Regular Payment';
      let batchRef = Math.floor(Math.random() * 432223);

      // /List 1
      let benficiaryBankCode1 = '058';
      let benficiaryAccountNumber1 = '0582915208017';
      let narration1 = 'Regular Payment';
      const amount1 = '5000';
      let beneficiaryEmail1 = 'qa@test.com';
      let transRef1 = Math.floor(Math.random() * 11012);

      // /List 2
      let benficiaryBankCode2 = '058';
      let benficiaryAccountNumber2 = '0582915208017';
      let narration2 = 'Regular Payment';
      const amount2 = '6000';
      let beneficiaryEmail2 = 'qa@test.com';
      let transRef2 = Math.floor(Math.random() * 1101233);

      // /List3
      let benficiaryBankCode3 = '058';
      let benficiaryAccountNumber3 = '0582915208017';
      let narration3 = 'Regular Payment';
      const amount3 = '3000';
      let beneficiaryEmail3 = 'qa@test.com';
      let transRef3 = Math.floor(Math.random() * 3201233);

      const d = new Date();
      const requestId = d.getTime();

      // hashin
      const object = apiKey + requestId + apiToken;

      const secret = `${mySecret}`;
      const apiHash = crypto
        .createHash('sha512', secret)
        .update(object)
        .digest('hex');

      benficiaryAccountNumber1 = AES_128_ENCRYPT(
        benficiaryAccountNumber1
      );
      benficiaryBankCode1 = AES_128_ENCRYPT(benficiaryBankCode1);
      narration1 = AES_128_ENCRYPT(narration1);
      const newAmount1 = AES_128_ENCRYPT(amount1);
      transRef1 = AES_128_ENCRYPT(transRef1);
      beneficiaryEmail1 = AES_128_ENCRYPT(beneficiaryEmail1);
      benficiaryAccountNumber2 = AES_128_ENCRYPT(
        benficiaryAccountNumber2
      );
      benficiaryBankCode2 = AES_128_ENCRYPT(benficiaryBankCode2);
      narration2 = AES_128_ENCRYPT(narration2);
      const newAmount2 = AES_128_ENCRYPT(amount2);
      transRef2 = AES_128_ENCRYPT(transRef2);
      beneficiaryEmail2 = AES_128_ENCRYPT(beneficiaryEmail2);
      benficiaryAccountNumber3 = AES_128_ENCRYPT(
        benficiaryAccountNumber3
      );
      benficiaryBankCode3 = AES_128_ENCRYPT(benficiaryBankCode3);
      narration3 = AES_128_ENCRYPT(narration3);
      const newAmount3 = AES_128_ENCRYPT(amount3);
      transRef3 = AES_128_ENCRYPT(transRef3);
      beneficiaryEmail3 = AES_128_ENCRYPT(beneficiaryEmail3);
      batchRef = AES_128_ENCRYPT(batchRef);
      narration = AES_128_ENCRYPT(narration);
      bankCode = AES_128_ENCRYPT(bankCode);
      debitAccount = AES_128_ENCRYPT(debitAccount);

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

      let totalAmount = +amount1 + +amount2 + +amount3;
      totalAmount = AES_128_ENCRYPT(totalAmount);

      const body = {
        bulkPaymentInfo: {
          totalAmount,
          batchRef,
          debitAccount,
          narration,
          bankCode
        },
        paymentDetails: [
          {
            transRef: transRef1,
            narration: narration1,
            benficiaryEmail: beneficiaryEmail1,
            benficiaryBankCode: benficiaryBankCode1,
            benficiaryAccountNumber: benficiaryAccountNumber1,
            amount: newAmount1
          },
          {
            transRef: transRef2,
            narration: narration2,
            benficiaryEmail: beneficiaryEmail2,
            benficiaryBankCode: benficiaryBankCode2,
            benficiaryAccountNumber: benficiaryAccountNumber2,
            amount: newAmount2
          },
          {
            transRef: transRef3,
            narration: narration3,
            benficiaryEmail: beneficiaryEmail3,
            benficiaryBankCode: benficiaryBankCode3,
            benficiaryAccountNumber: benficiaryAccountNumber3,
            amount: newAmount3
          }
        ]
      };

      const reqHeaders = {
        MERCHANT_ID: merchantId,
        API_KEY: apiKey,
        REQUEST_ID: requestId,
        REQUEST_TS: timeStamp,
        API_DETAILS_HASH: apiHash
      };

      const bulkPayments = (await axios.post(`${BULK_PAYMENT_TEST_URL}`, body, {
        headers: reqHeaders
      })).data;

      if (bulkPayments.status !== 'success') return res.status(404).json({ message: 'Bulk payments not found' });
      return res.status(200).json({ message: 'Bulk Payments', bulkPayments });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   *@description  Bulk payment status
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message
   *@memberof remitaPaymentController
   */

  static async paymentStatusBulk(req, res) {
    try {
      const merchantId = 'KUDI1234';
      const apiKey = `${remApiKey}`;
      const apiToken = `${remApiToken}`;
      let transRef = '325592';

      const d = new Date();
      const requestId = d.getTime();

      // hashin
      const object = apiKey + requestId + apiToken;

      const secret = `${mySecret}`;
      const apiHash = crypto
        .createHash('sha512', secret)
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

      const reqHeaders = {
        MERCHANT_ID: merchantId,
        API_KEY: apiKey,
        REQUEST_ID: requestId,
        REQUEST_TS: timeStamp,
        API_DETAILS_HASH: apiHash
      };
      const body = {
        batchRef: transRef
      };

      const paymentStatus = (await axios.post(
        `${PAYMENT_STATUS_BULK_TEST_URL}`,
        body,
        {
          headers: reqHeaders
        }
      )).data;
      return res
        .status(200)
        .json({ message: 'Your payment status', paymentStatus });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default remitaPaymentController;
