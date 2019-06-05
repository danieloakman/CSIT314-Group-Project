/* eslint-disable no-console */

/**
 * @arg numbeOfdrivers first arg.
 * @arg numberOfMechanics second arg.
 */

const fs = require("fs");
const uuid = require("uuid/v4");
if (process.argv.length < 4) {
  console.log("Missing args");
  return;
}

const datasets = {
  authentication: require("./datasets/authentication"),
  cars: require("./datasets/cars"),
  descriptions: require("./datasets/descriptions").description,
  locations: require("./datasets/locations"),
  names: require("./datasets/names"),
  phoneNumbers: require("./datasets/phoneNumbers"),
};

const genDriver = () => {
  return {
    _id: uuid(),
    type: "Driver",
    givenName: datasets.names.firstNames[Math.floor((Math.random() * datasets.names.firstNames.length - 1) + 1)],
    surname: datasets.names.lastNames[Math.floor((Math.random() * datasets.names.lastNames.length - 1) + 1)],
    email: datasets.authentication.emails[Math.floor((Math.random() * datasets.authentication.emails.length - 1) + 1)],
    password: "test123",
    vehicles: [],
    phoneNo: datasets.phoneNumbers[Math.floor((Math.random() * datasets.phoneNumbers.length - 1) + 1)],
    creationDate: Date.now(),
    location: genLocation()
  };
};

const genVehicle = () => {
  let vehicle = datasets.cars[Math.floor((Math.random() * datasets.cars.length - 1) + 1)];
  vehicle._id = uuid();
  vehicle.creationDate = Date.now();
  return vehicle;
};

const genMechanic = () => {
  return {
    _id: uuid(),
    type: "Mechanic",
    givenName: datasets.names.firstNames[Math.floor((Math.random() * datasets.names.firstNames.length - 1) + 1)],
    surname: datasets.names.lastNames[Math.floor((Math.random() * datasets.names.lastNames.length - 1) + 1)],
    email: datasets.authentication.emails[Math.floor((Math.random() * datasets.authentication.emails.length - 1) + 1)],
    password: "test123",
    isVerified: false,
    aggregateRating: 0,
    activeOffer: null,
    offersSent: [],
    phoneNo: null,
    bsb: null,
    bankAccountNo: null,
    mechanicLicenceNo: null,
    awaitingVerification: false,
    averageRating: 0,
    ratingScore: 0,
    ratingCount: 0,
    creationDate: Date.now()
  };
};

const genSR = (driverID, vehicleID, location) => {
  return {
    _id: uuid(),
    description: datasets.descriptions[Math.floor((Math.random() * datasets.descriptions.length - 1) + 1)],
    location,
    driverID,
    vehicleID,
    offers: [],
    status: "Awaiting offer acceptance",
    completionDate: null,
    selectedOfferID: null,
    creationDate: Date.now()
  };
};

function getRandomLocation (location, radius, useMilesInstead = false) {
  // 69 and 111 is the amount of miles and kilometres in 1 degree of latitude.
  const radiusInDegrees = useMilesInstead ? radius / 69 : radius / 111;
  let u = Math.random();
  let v = Math.random();
  let w = radiusInDegrees * Math.sqrt(u);
  let t = 2 * Math.PI * v;
  // Note: the constant 0.7 is to adjust distibution to be more circular for our specific latitude in NSW.
  let randLatitude = (w * Math.cos(t)) / (Math.cos(location.longitude) / 0.7) + location.latitude;
  let randLongitude = (w * Math.sin(t)) + location.longitude;
  return {
    timestamp: Date.now(),
    mocked: false,
    coords: {
      latitude: randLatitude,
      longitude: randLongitude,
      heading: 0,
      speed: 0,
      altitude: 37.5,
      accuracy: 16.34
    }
  };
}

const genLocation = () => {
  let loc = datasets.locations[Math.floor((Math.random() * datasets.locations.length - 1) + 1)];
  return getRandomLocation(
    {latitude: loc.latitude, longitude: loc.longitude},
    loc.kmRadius
  );
};

let testUsers = [
  {
    _id: "TestUser1",
    type: "Driver",
    givenName: "John",
    surname: "Lennon",
    email: "driver@test.com",
    password: "test123",
    vehicles: [
      "9fe70aad-8568-4568-92b7-f96276fdcea6"
    ],
    phoneNo: "04123456789",
    creationDate: 1559633723000
  },
  {
    _id: "TestUser2",
    type: "Driver",
    givenName: "Paul",
    surname: "Mccartney",
    email: "driver2@test.com",
    password: "test123",
    activeRequest: "d0155f80-47b7-434e-ba0d-980cee2da5aa",
    vehicles: [
      "0e3ad9ab-d62f-4a90-b2d4-219227a90de6"
    ],
    location: {
      timestamp: 1557223186000,
      mocked: false,
      coords: {
        heading: 0,
        longitude: 150.874157,
        speed: 0,
        altitude: 37.599998474121094,
        latitude: -34.436349,
        accuracy: 16.340999603271484
      }
    },
    phoneNo: "04023456789",
    creationDate: 1559633723000
  },
  {
    _id: "TestUser3",
    type: "Mechanic",
    givenName: "George",
    surname: "Harrison",
    email: "mechanic@test.com",
    password: "test123",
    isVerified: true,
    aggregateRating: 0,
    activeOffer: null,
    offersSent: [],
    phoneNo: null,
    bsb: 123456,
    bankAccountNo: 1234567891,
    mechanicLicenceNo: 1234567,
    awaitingVerification: false,
    averageRating: 0,
    ratingScore: 0,
    ratingCount: 0,
    creationDate: 1559633723000
  },
  {
    _id: "TestUser4",
    type: "Admin",
    givenName: "Ringo",
    surname: "Star",
    email: "admin@test.com",
    password: "test123",
    jobs: [],
    phoneNo: "",
    creationDate: 1559633723000
  }
];
let testUsersPath = "./assets/data/testUsers.json";
let testRequests = [
  {
    _id: "d0155f80-47b7-434e-ba0d-980cee2da5aa",
    description: "",
    location: {
      timestamp: 1557223186000,
      mocked: false,
      coords: {
        heading: 0,
        longitude: 150.874157,
        speed: 0,
        altitude: 37.599998474121094,
        latitude: -34.436349,
        accuracy: 16.340999603271484
      }
    },
    driverID: "TestUser2",
    vehicleID: "0e3ad9ab-d62f-4a90-b2d4-219227a90de6",
    offers: [],
    status: "Awaiting offer acceptance",
    completionDate: null,
    selectedOfferID: null,
    creationDate: 1559633723000
  },
  {
    _id: "d0155f80-47b7-434e-ba0d-980cee2da5ab",
    location: {
      timestamp: 1557223186000,
      mocked: false,
      coords: {
        heading: 0,
        longitude: 150.874157,
        speed: 0,
        altitude: 37.599998474121094,
        latitude: -34.436349,
        accuracy: 16.340999603271484
      }
    },
    driverID: "TestUser2",
    vehicleID: "0e3ad9ab-d62f-4a90-b2d4-219227a90de6",
    description: "Engine blew up",
    offers: [
      "TestOffer1"
    ],
    status: "Completed",
    completionDate: 1559633723000,
    selectedOfferID: "TestOffer1",
    creationDate: 1559633723000
  }
];
let testRequestsPath = "./assets/data/testRequests.json";
let testVehicles = [
  {
    _id: "9fe70aad-8568-4568-92b7-f96276fdcea6",
    make: "Hyundai",
    model: "Elantra",
    year: 2012,
    plate: "N9KI45",
    vin: "1G4HD57276U972445",
    creationDate: 1559633723,
    imageURI: "https://i.stack.imgur.com/9eHIv.png"
  },
  {
    _id: "0e3ad9ab-d62f-4a90-b2d4-219227a90de6",
    make: "Nissan",
    model: "Versa",
    year: 2011,
    plate: "V6VJ1M",
    vin: "2G4WD552X61834033",
    creationDate: 1559633723000
  }
];
let testVehiclesPath = "./assets/data/testVehicles.json";
let numberOfDrivers = process.argv[2];
let numberOfMechanics = process.argv[3];

for (let i = 0; i < numberOfDrivers; i++) {
  let driver = genDriver();
  let vehicle = genVehicle();
  driver.vehicles.push(vehicle._id);
  testVehicles.push(vehicle);
  let sr = genSR(driver._id, vehicle._id, driver.location);
  driver.activeRequest = sr._id;
  testUsers.push(driver);
  testRequests.push(sr);
}
for (let i = 0; i < numberOfMechanics; i++) {
  testUsers.push(genMechanic());
}

fs.writeFileSync(testUsersPath, JSON.stringify(testUsers, null, 2));
fs.writeFileSync(testRequestsPath, JSON.stringify(testRequests, null, 2));
fs.writeFileSync(testVehiclesPath, JSON.stringify(testVehicles, null, 2));
