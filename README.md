# CSIT314-Group-Project

## Compilation instructions

### Setup
1. Install node.js version 10 or higher
2. clone/Download repo if not done already
3. Run command `npm install` in project root directory
4. Run `npm install -g expo-cli` to install expo-cli tool globally

### Running app through expo cli for testing
1. run `expo`
2. Improve these instructions

### Packaging app for deployment
1. run `expo build:android` or `expo build:ios`
2. Improve these instructions

## Project structure

```
CSIT314-Group-Project/
├── src/
│   ├── components/
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── templates/
│   │   └── screens/
│   ├── constants/
│   ├── lib/
│   │   ├── context/
│   │   └── services/
│   ├── navigation/
│   └── App.js
├── assets/
│   ├── data/
│   ├── fonts/
│   └── images/
├── __tests__/
│
└── dataGenerator/
```

### src
Project's main source code goes here\
It is recommended that components follow the atomic design methodology in order to fully take advantage of code re-use, as well as assisting with organization and maintainability. See [Atomic Design Methodology](http://atomicdesign.bradfrost.com/chapter-2/) by Brad Frost for an in-depth explanation

- components: UI components (see react definition of component)
  - atoms: Smallest elements of a page such as buttons, text areas, title fields etc... Irreducible in size
  - molecules: Larger components made up of one or more atom components, but still only representing small sections of a page
  - templates: Components defining a page layout, but not including the actual functional components. Essentially a reusable scaffold.
  - screens: Top-level components responsible for bringing together multiple components in order to create a complete view of the application.
- constants: Sets of constant values that do not change
- lib: Utility and backend code to be used throughout the app
  - context: multilevel state management for react tree (see react context documentation)
  - services: services
- navigation: Definitions of navigation stuff for react-navigation

### assets
Static assets for the project such as images, fonts and datasets go here

- data: test data loaded by the application
- fonts: font files to be used in the application
- images: image files used in the application

### \_\_tests__
Unit testing stuff goes here

### dataGenerator
This is the program which generates the large test datasets used to test the program. More info in folder's readme
