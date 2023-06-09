# Database Backup Strategy

**Status:** Accepted

## Context

We need to configure backup of firebase database.

## Communication with the client are as follows:

The response received from the client on the questions asked are as follows:

How many users of the application do we expect to have?  (Will it be 1-2, a dozen or more?)
— less than 6


What volume of data is processed/stored in the cloud? If you don’t know storage size (in megabytes or kilobytes), can you give us the idea of number of forms submitted per trip, number of trips/encounters per day/week/month?
— about 100 forms a year


What frequency of backups do we want to accommodate?
There is a workflow solution allowing for hourly backups, but it can also be configured to a less granular schedule, e.g. once a week, one a month etc.
— daily works


How long do you think we should enable the backup files to be kept? (Firebase has a cost-free option for keeping files for up to 30 days, then they purge them automatically; Do we need to keep the data for longer than 30 days?)
— 30 days is good

Hence, according to the inputs we have decided, to go for free plan i.e. is for 30 days automatically

## Some of our assumptions we did as per the above communication are as follows:

1  We are assuming by entering long comments, quotes, etc.that single record (forms) will not exceed 3.5 KB in size approx according to the client 100 forms a year means the total size needed to store the form data will not exceed 0.4MB (3.5 *100) a year plus the admin overhead (security etc). Since the data is exported and compressed for backup, daily storage requirements will not exceed 0.2MB a day or 6 MB a month. After 30 days backup files will be deleted automatically as per GCP’s policy on cost-free option.

2  Video recordings and audio recordings kept in the site(links) but not in cloud storage.

3  We are not concerned with storing the videos, audios and images as they are stored in dropbox, the db will contain only the references which are urls.

## Decision

We decided to use export function from firestore and then use GitHub Actions to automate backup of firebase database.

These were the different options considered for the database backup strategy:

### Approach 1 - Off-the-shelf Firestore Exports/Imports

In this approach we found was to use the Cloud Firestore managed export and import service to recover from accidental deletion of data for offline processing.
Description of the first approach is found in this [link](https://firebase.google.com/docs/firestore/manage-data/export-import#:~:text=Go%20to%20the%20Cloud%20Firestore,the%20Google%20Cloud%20Platform%20Console.&text=Click%20Export)

Pros with approach 1:

- Minimal dev work
- Ready available
- Manual

Cons with approach 1:

- Requires manual input
- Complex to implement
- Time-consuming 
- Hard to follow along in the document

### Approach 2 - Workflow automation

In this approach we found was to use the export function from fire store and then use GitHub Actions to automate backup for fire store by adding a job to the backup.yaml file
Description of the second approach is found in this [link](https://fireship.io/snippets/firestore-automated-backups/)

Pros with approach 2:

- Provides automated exports/imports
- Great configuration flexibility
- Uses the configuration of a Cron job (utility program for scheduling tasks repeatedly at a specific time) which will automate the backup recovery in sec/min/hours/day/week
- Supports exports via gcloud CLI
- Facilitates various levels of granularity
- fast, easy to follow and implement

Cons with approach 2:

- Requires some coding
- 
### Approach 3 - Automated Firebase backup

This approach is about automated backup setup using blaze plan which is the restoring from backups using import and scheduling.
Description of the third approach is found in this [link](https://firebase.google.com/docs/database/backups)

Problems with approach 3:

- This approach refers to Firebase Realtime Database for automatic backups but this project is using Firestore database.

Pros with approach 3:

- Automated

Cons with approach 3:

- Only  applicable to RealTime Base (old, json-tree based database in Firebase platform)
- NOT available for Firestore (which BMMRO use)

# Conclusion of the Spike

The first approach we mentioned is complex and time-consuming, we have found that the third approach uses the Realtime 
database, but we are not using a Realtime Database in BMMRO, we are using a Firestore database.
The projects tech Stack is given in the [link](https://github.com/BMMRO-tech/BMMRO/blob/master/app/README.md)
Hence we recommend that the second approach is the closest to what we need and is easiest to implement.
