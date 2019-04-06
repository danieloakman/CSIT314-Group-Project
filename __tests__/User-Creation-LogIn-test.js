/* eslint-disable no-console */
const Driver = require('../src/components/users/Driver');
const Mechanic = require('../src/components/users/Mechanic');
const Admin = require('../src/components/users/Admin');
let allUsers = require('../assets/test-files/users');
const fs = require('fs');

describe('User creation and login tests', () => {
  jest.useFakeTimers();

  it('User creation', async () => {
    let driver = new Driver('driver', 'test', 'test@test.com', 'test123');
    driver.saveUser();

    let mechanic = new Mechanic('mechanic', 'test', 'test2@test.com', 'test123');
    mechanic.saveUser();

    let admin = new Admin('admin', 'test', 'test3@test.com', 'test123');
    admin.saveUser();

    console.log(`Successfully created: ${JSON.stringify([driver, mechanic, admin], null, 2)}`);

    // Remove these users:
    let usersToRemove = [driver.email, mechanic.email, admin.email];
    allUsers = require('../assets/test-files/users');
    usersToRemove.forEach(user => {
      if (allUsers[user]) delete allUsers[user];
    });
    fs.writeFileSync('./assets/test-files/users.json', JSON.stringify(allUsers, null, 2), { flag: 'w' });
    console.log(`Succesfully deleted: ${JSON.stringify(usersToRemove, null, 2)}`);
  });

  it('Log in', async () => {
    // todo
  });
});
