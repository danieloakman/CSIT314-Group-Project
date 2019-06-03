import ModelWithDbConnection from "@model/ModelWithDbConnection";
import TransactionDB from "@database/transaction";
// import UserDB from "@database/user";
import _ from "lodash";

/*
 Realistically, transactions should only be created/updated through the driver model for subscriptions, and through the request model for request payments
 */

/**
 * Provided fields:
 * All transactions: type, payerID
 * Subscriptions and regular requests: cardNo, cardCSV, cardExpiry
 * Regular and member requests: requestID, offerID, payeeID, amount, payeeBSB, payeeAccountNo
 *
 * Generated fields:
 * All transactions: id, amountPayed, isFinalized, isCancelled
 * Subscriptions: amount
 * Subscriptions and regular requests: cardTransactionID
 * Regular and member requests: companyCut, providerCut
 */
export default class Transaction extends ModelWithDbConnection {
  static MEMBERSHIP_PRICE = 200;
  static SERVICE_FEE = 0.1; // Percentage of offer taken by comapny

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
      amountPayed: 0,
      isCancelled: false, // Has the transaction been cancelled
      isFinalized: false // Has the transaction been finalized/finished
    };
    let extraDetails = {};

    if (this.type in ["memberRequest", "regularRequest"]) {
      extraDetails = {
        requestID: "", // The request the transaction is tied to
        offerID: "",
        providerCut: 0, // The cut going to the service provider (the mechanic)
        companyCut: 0, // The cut going to the company,
        payeeID: "",
        payeeAccountNo: "",
        payeeBSB: ""
      };
      if (this.type === "memberRequest") {
        extraDetails = {
          ...extraDetails,
          cardNo: "",
          cardExpiry: "",
          cardCSV: "",
        };
      }
    } else if (this.type === "subscription") {
      extraDetails = {
        cardNo: "",
        cardExpiry: "",
        cardCSV: "",
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
      case "regularRequest": {
        const cardTransactionID = TransactionDB.chargeCard(this.amount, this.cardNo, this.cardExpiry, this.cardCSV);

        const delta = {
          cardTransactionID,
          amountPayed: this.amount,
          companyCut: this.amount * Transaction.SERVICE_FEE,
          providerCut: this.amount - (this.amount * Transaction.SERVICE_FEE),
          isFinalized: true,
        };
        const succ = await TransactionDB.depositCashToAccount(this.amount, this.payeeBSB, this.payeeAccountNo);

        if (cardTransactionID && succ) {
          await TransactionDB.updateRecord(this, delta);
          Object.freeze(this._doc);
          return {ok: true, reason: "Payment successful"};
        } else {
          return {ok: false, reason: "Payment rejected"};
        }
      }
      case "memberRequest": {
        const delta = {
          companyCut: 0,
          providerCut: this.amount,
          amountPayed: 0,
          isFinalized: true
        };
        await TransactionDB.updateRecord(this, delta);
        const succ = await TransactionDB.depositCashToAccount(this.amount, this.payeeBSB, this.payeeAccountNo);
        if (succ) {
          await TransactionDB.updateRecord(this, delta);
          Object.freeze(this._doc);
          return {ok: true, reason: "Payment successful"};
        } else {
          return {ok: false, reason: "Payment rejected"};
        }
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
  get amountPayed () { return this._doc.amountPayed; }
  get isFinalized () { return this._doc.isFinalized; }
  get isCancelled () { return this._doc.isCancelled; }
  get cardNo () { return this._doc.cardNo; }
  get cardExpiry () { return new Date(this._doc.cardExpiry); }
  get cardCSV () { return this._doc.cardCSV; }

  // Request details
  get requestID () { return this._doc.requestID; }
  get offerID () { return this._doc.offerID; }
  get payeeID () { return this._doc.payeeID; }
  get payeeBSB () { return this._doc.payeeBSB; }
  get payeeAccountNo () { return this._doc.payeeAccountNo; }
  get providerCut () { return this._doc.providerCut; }
  get companyCut () { return this._doc.companyCut; }

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
    return TransactionDB.updateRecord(this, delta);
  }
}
