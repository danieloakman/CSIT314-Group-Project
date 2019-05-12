import DBConnector from "./core";

class UserDB extends DBConnector {
  constructor () {
    super("db.vehicles");
  }

  async getVehicle () {

  }

  async createVehicle () {

  }

  async updateVehicle () {

  }

  async deleteVehicle () {

  }
}

export default new UserDB();
