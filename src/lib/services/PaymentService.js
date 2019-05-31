import DatabaseService from "@lib/services/DatabaseService";
const uuid = require("uuid/v4"); // random uuid

export default class PaymentService {
  static MEMBERSHIP_PRICE = 200; // $200, aimed at being competite with NRMA Premium Care annual price.
  static SERVICE_FEE = 0.25; // 25%

  /**
   * todo
   * @param driver Driver class object.
   * @returns {{pass: boolean, reason?: boolean, paymentId: string}} Pass and paymentId in an object.
   */
  static async payForMembership (driver) {
    const cardTransactionId = this._chargePaymentToCard(PaymentService.MEMBERSHIP_PRICE, driver.cardNo, driver.cardExpiry, driver.cardCSV);
    return DatabaseService.createPayment({
      type: "Payment for Membership",
      driverEmail: driver.email,
      cardTransactionId,
      driverPayed: PaymentService.MEMBERSHIP_PRICE,
      cardNo: driver.cardNo,
      cardExpiry: driver.cardExpiry,
      cardCSV: driver.cardCSV
    });
  }

  /**
   * todo
   * @param driver Driver class object.
   * @param mechanic Mechanic class object.
   * @param {number} offerAmount The amount in the offer.
   * @param {string} srId // Id of the related SR.
   * @returns {{pass: boolean, reason?: boolean, paymentId: string}} Pass and paymentId in an object.
   */
  static async payForServiceRequest (driver, mechanic, offerAmount, srId) {
    let payment = {
      srId,
      type: null,
      driverEmail: driver.email,
      mechanicEmail: mechanic.email,
      driverPayed: null,
      mechanicCut: offerAmount, // Mechanic gets 100% of the price they originally offered.
      companyCut: null,
    };
    if (driver.membership) {
      payment.type = "Membership Service Request Payment";
      payment.driverPayed = 0;
      payment.companyCut = 0;
    } else {
      payment.type = "Non-Membership Service Request Payment";
      payment.driverPayed = offerAmount * (1 + PaymentService.SERVICE_FEE); // Driver pays an extra SERVICE_FEE%.
      payment.companyCut = offerAmount * PaymentService.SERVICE_FEE; // Company gets the SERVICE_FEE%.
      payment.cardTransactionId = this._chargePaymentToCard(payment.driverPayed, driver.cardNo, driver.cardExpiry, driver.cardCSV);
      payment.cardNo = driver.cardNo;
      payment.cardExpiry = driver.cardExpiry;
      payment.cardCSV = driver.cardCSV;
    }
    this._depositCashToAccount(mechanic.bsb, mechanic.bankAccountNo);
    // Store payment in DB:
    return DatabaseService.createPayment(payment);
  }

  /**
   * Charge payment to (imaginary) card.
   * @returns {string} transactionId
   */
  static _chargePaymentToCard (paymentAmount, cardNo, cardExpiry, cardCSV) {
    if (cardNo && paymentAmount && cardExpiry & cardCSV) { // todo: maybe return null if cardExpiry elapsed
      /**
       * --- PAYMENT CHARGED TO CARD HERE ---
       */
      return uuid(); // Return transaction id.
    } else return null;
  }

  /**
   * Deposit cash to (imaginary) account.
   */
  static _depositCashToAccount (bsb, bankAccountNo) {
    /**
     * --- CASH DEPOSITED TO BANK ACCOUNT HERE ---
     */
    if (bsb && bankAccountNo) return true;
    else return false;
  }
}
