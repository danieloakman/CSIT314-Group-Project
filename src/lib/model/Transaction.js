import ModelWithDbConnection from "@model/ModelWithDbConnection";
import TransactionDB from "@database/transaction";
// import UserDB from "@database/user";
import _ from "lodash";

/*
 Realistically, transactions should only be created/updated through the driver model for subscriptions, and through the request model for request payments
 */
export default class Transaction extends ModelWithDbConnection {
  static MEMBERSHIP_PRICE = 200;
  static SERVICE_FEE = 0.25;

  constructor (record) {
    super(record);
    this.db = TransactionDB;

    // Freeze the record if it is finished. This will prevent any changes that shouldn't happen
    if (this.isCancelled || this.isFinalized) {
      Object.freeze(this._doc);
    }
  }

  async init () {
    await super.init();
    const commonDetails = {
      amount: 0, // Amount due
      cardNo: "",
      cardExpiry: "",
      cardCSV: "",
      isCancelled: false, // Has the transaction been cancelled
      isFinalized: false // Has the transaction been finalized/finished
    };
    let extraDetails = {};

    if (this.type === "request") {
      extraDetails = {
        requestID: "", // The request the transaction is tied to
        providerCut: 0, // The cut going to the service provider (the mechanic)
        companyCut: 0 // The cut going to the company
      };
    } else if (this.type === "subscription") {
      extraDetails = {
        amount: Transaction.MEMBERSHIP_PRICE
      };
    }
    this._doc = { ...this._doc, ...commonDetails, ...extraDetails };
  }

  static async getTransaction (TransactionID) {
    const record = await TransactionDB.getRecord(TransactionID);
    if (record) { return new Transaction(record); }
    return null;
  }

  /**
   * All transactions are initiated by a payer
   * @param {String} type can be "request" or "subscription"
   * @param {String} payerID The id of the payer initiating the transaction
   */
  static async createTransaction (type = "request", payerID) {
    const newTransaction = new Transaction({type, payerID});
    await newTransaction.init();
    // console.log(newTransaction);
    return TransactionDB.createRecord(newTransaction);
    /*
      Create payment
      Init payment
      Insert payment to database
    */
    /*
    A transaction object will first be created, with an immediately assigned transaction id and type.
    Then the details of the transaction will be filled out, according to its type.
    The transaction will then be "finalized", where the transaction will be "processed" and will either succeed or fail.
    If the transaction fails, it may then be edited and re-finalized, or cancelled.

    To the frontend, the required actions will be: create transaction object, set the transaction information, and finalize
   */
  }

  async finalize () {
    if (this.isCancelled) { return {ok: false, reason: "Attempting to finalize a transaction that has already been cancelled"}; }
    if (this.isFinalized) { return {ok: false, reason: "Attempting to finalize a transaction that has already been finalized"}; }
    switch (this.type) {
      case "request": {
        break;
      }
      case "subscription": {
        const cardTransactionID = TransactionDB.chargeCard(this.amount, this.cardNo, this.cardExpiry, this.cardCSV);

        if (cardTransactionID) {
          await TransactionDB.updateRecord(this, {cardTransactionID, isFinalized: true});
          Object.freeze(this._doc);
          return {ok: true, reason: "Payment successful"};
        } else {
          return {ok: false, reason: "Payment rejected"};
        }
      }
      default: {
        return {ok: false, reason: "Invalid transaction type"};
      }
    }
    return {ok: false, reason: "Payment system not fully implemented"};
  }

  async cancel () {
    await TransactionDB.updateRecord(this, {isCancelled: true});
  }

  // Common details
  get transactionID () { return this._doc._id; }
  get cardTransactionID () { return this._doc.cardTransactionID; }
  get type () { return this._doc.type; }
  get payerID () { return this._doc.payerID; }
  get amount () { return this._doc.amount; }
  get cardNo () { return this._doc.cardNo; }
  get cardExpiry () { return new Date(this._doc.cardExpiry); }
  get cardCSV () { return this._doc.cardCSV; }
  get isFinalized () { return this._doc.isFinalized; }
  get isCancelled () { return this._doc.isCancelled; }

  // Request details
  get requestID () { return this._doc.requestID; }
  get payeeID () { return this._doc.payeeID; }
  get providerCut () { return this._doc.providerCut; }
  get companyCut () { return this._doc.companyCut; }

  // Subscription details

  async setPayerID (payerID) {
    await TransactionDB.updateRecord(this, {payerID});
  }

  async setCardNo (cardNo) {
    await TransactionDB.updateRecord(this, {cardNo});
  }

  /**
   *
   * @param {Date} cardExpiry
   */
  async setCardExpiry (cardExpiry) {
    await TransactionDB.updateRecord(this, {cardExpiry: cardExpiry.getTime()});
  }

  async setCardCSV (cardCSV) {
    await TransactionDB.updateRecord(this, {cardCSV});
  }

  async setRequestID (requestID) {
    await TransactionDB.updateRecord(this, {requestID});
  }

  async setAmount (amount) {
    await TransactionDB.updateRecord(this, {amount});
  }

  /**
   * Sets multiple values in the transaction at once
   * @param {Object} delta The delta object containing changed values
   */
  async setMulti (delta) {
    await TransactionDB.updateRecord(this, delta);
  }
}
