import DBConnector from "./core";

class PaymentDB extends DBConnector {
  constructor () {
    super("db.payments");
  }

  getPayment () {

  }

  createPayment () {

  }

  updatePayment () {

  }

  deletePayment () {

  }
}

export default new PaymentDB();
