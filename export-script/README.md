## Data export script

This script exports data from the Firebase Firestore to a csv file.

## Running the script

In the `scripts` directory:

1. Create `.env` file.
2. Add the following properties to `.env` file and set them to values that can be found in project settings inside firebaseConfig object in Firebase console:

- set `PROJECT_ID` to `projectId`
- set `API_KEY` to `apiKey`
- set `AUTH_DOMAIN` to `authDomain`
- set `EMAIL` and `PASSWORD` to your email address and password that you use to log in to the app

3. Install all dependencies:

```
npm install
```

4. Run the command below to start the script. You will need to specify a date range to export the data entries from. First argument passed to the command is a start date (entries from this date will be included) and second argument is an end date (entries from this date will be excluded). Dates need to be in `dd/mm/yyyy` format, for example:

```
npm start -- "01/06/2020" "01/07/2020"
```

The csv file will be saved in `exported` folder.

## Running tests

Run the following command to run script tests:

```
npm test
```

## Importing a csv file to Microsoft Access database

1. Open a database file.
2. Go to `External Data`.
3. Click on `New Data Source` -> `From File` -> `Text File`.
4. Specify the csv file as the source of your data.
5. Select `Append a copy of the records to the table` and choose the table you want to import data to from a dropdown menu.
6. Select import in a delimited format.
7. Click on `Advanced…` and make sure that:

- Date Order is set to `MDY`
- Date Delimiter is set to `/`
- Time Delimiter is set to `:`
- Four Digit Years checkbox is selected
- Leading Zeros in Dates field is not selected

8.  On the next page, select comma delimited and click the `First Row Contains Field Names` checkbox.
