/* eslint-disable no-console */
const Driver = require("../src/components/users/Driver");
const Mechanic = require("../src/components/users/Mechanic");
const Admin = require("../src/components/users/Admin");
let allUsers = require("../assets/test-files/database");

describe("User creation and login tests", () => {
  jest.useFakeTimers();

  it("User creation", async () => {
    // fields here must match the attributes in the User and it's derived classes.
    let driver = new Driver({
      firstName: "driver",
      lastName: "test",
      email: "test@test.com",
      password: "test123"
    });

    let mechanic = new Mechanic({
      email: "test2@test.com",
      firstName: "mechanic",
      lastName: "test",
      password: "test123"
    });

    let admin = new Admin({
      firstName: "admin",
      email: "test3@test.com",
      password: "test123",
      lastName: "test"
    });

    console.log(`Successfully created: ${JSON.stringify([driver, mechanic, admin], null, 2)}`);
  });

  it("Log in", async () => {
    // todo
  });
});
