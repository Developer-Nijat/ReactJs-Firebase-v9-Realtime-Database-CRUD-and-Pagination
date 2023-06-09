# ReactJs & Firebase v9 Realtime Database | CRUD and Pagination

## Project Configuration
1. Configure firebase and realtime database from firebase console.
2. Replace firebaseConfig data in `firebase.js` file with your firebaseConfig
3. Configure firebase realtime database rules from firebase console
4. Install npm modules and run commmand `npm start`

Firebase realtime database rules
```
{
  "rules": {
    "items": {
      ".indexOn": ["createdAt"],
      "$itemId": {
        ".read": true,
        ".write": true
      }
    },
    ".read": "now < 1682884800000",  // 2023-5-1
    ".write": "now < 1682884800000",  // 2023-5-1
  }
}
```

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

