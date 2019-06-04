# CSIT314-Group-Project

## Compilation instructions

### Setup
1. Install node.js version 10 or higher
2. clone/Download repo if not done already
3. Run command `npm install` in project root directory
4. Run `npm install -g expo-cli` to install expo-cli tool globally

### Running app through expo cli for testing
1. Open a terminal then navigate to the root directory of the project.
2. run `npm start`. This will open the expo DevTools.
3. It should open a new tab in your default web browser. If this didn't happen press d in terminal to open it manually.
4. Once fully loaded, you can:
  - Run it through the Expo app on your android phone:
    1. In the tab that was opened in your web browser, swap the connection to "Tunnel". This will be just above the QR code in the bottom left corner.
    2. Download Expo on the Google Play store.
    3. Select the Scan QR code option.
    4. Scan the QR code in your web browser and not the one in terminal. This will load the app.
    5. OPTIONAL: Tunnel is slower than using LAN connection mode, so if you wish to speed up the load times, you can use LAN. It may or not work right off the bat though, if it doesn't follow the instructions here: https://answers.microsoft.com/en-us/windows/forum/windows_10-networking/adapter-priority-setting-unavailable-in-windows-10/d2b63caa-e77c-4b46-88b5-eeeaee00c306?auth=1
  - Run it through the android studio emulator:
    1. Make sure LAN connection mode is selected (it's default) in the DevTools browser tab.
    2. Go to the Android Virtual Device Manager in Android Studio and create a new virtual device.
    3. Select any phone but it's optimal to use 4.5" screen phones or bigger since that's what we tested on.
    4. The minimum version allowed is Android 5. We tested on android 6 and above.
    5. Now go to the SDK Manager in Android Studio and copy the "Android SDK Location" to clipboard.
    6. Windows Button + S -> Search: "environment variables" -> Enter.
    7. Click "Environment Variables..." button.
    8. Under "User variables for 'your_username'", click Path, then "Edit...".
    9. Click "New", then paste the path you copied to your clipboard earlier.
    10. Click "Ok" on all three screens to close them.
    11. Close and re-open any terminals you have open now. In a new terminal verify that `adb` is recognised as a command.
    12. If it is, then with the terminal DevTools and your android emulator running, you should be able to type `a` in the terminal to download the expo app then run the project app in the emulator.

### Packaging app for deployment
1. Open a terminal then navigate to the root directory of the project
2. run `expo build:android`, this will take a few minutes.
3. After it has finished there will be a link where you can download the apk file.

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
