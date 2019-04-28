# Test Data Generator
This will be the program used to generate test data for the system
Reminder: Requirements list a minimum of 100 customers, 100 roadside assistance professionals, and 1,000 service requests

## Datasets

Different datasets have been separated into different files, as they are of reasonable size

### names.json
firstNames[]: An array of random firstnames
lastNames[]: An array of random lastnames

### descriptions.json
descriptions[]: An array of random descriptions in lorem ipsum (random latin text)

### authentication.json
emails[]: An array of random emails (may include duplicates)
passwords[]: An array of random passwords (simulated hashes, but probably just random strings)

### cars.json
An array of car objects. Each car is meant to be used as a whole. May include duplicate number plates.
car object:
  make: make of car
  model: model of car
  year: model year of car
  plate: random 6 character alphanumeric string
  vin: car vin (May include duplication, also unsure if we'll need this)

datasets generated with mockaroo
