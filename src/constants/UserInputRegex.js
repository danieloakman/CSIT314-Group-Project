export default {
  // From http://emailregex.com/:
  email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

  // For first or last name:
  name: /^([A-Z])[a-z]+$/,

  // Australian phone number Regex from https://manual.limesurvey.org/Using_regular_expressions:
  phoneNo: /^(?:\+?61|0)[2-478](?:[ -]?[0-9]){8}$/,

  // Must be between 6 and 20 digits long and with at least one number:
  password: /^(?=.*\d).{6,20}$/,

  // Bank state branch, 6 digit number:
  bsb: /^\d{6}$/,

  // Bank account number, 10 non-zero numbers:
  bankAccountNo: /^[1-9]{10}$/,

  // Motor vehicle repairer licence number, With or without "MVRL" then 7 digits:
  mechanicLicenceNo: /^(MVRL|)\d{7}$/i,

  // Card number:
  cardNo: /^\d{16}$/,

  // Card expiry:
  cardExpiry: /^(1[0-2]|[1-9])\/\d{2}$/,

  // Card CSV:
  cardCSV: /^\d{3}$/
};
