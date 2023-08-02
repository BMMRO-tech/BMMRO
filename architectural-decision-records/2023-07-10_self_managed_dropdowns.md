# Self Managed Dropdowns

**Status:** Accepted

## Context
- BMMRO want to get back some of the control they had over paperwork similar to when they were using paper forms for data capture. The perception is that they had more control and more flexibility over the data-entry forms.

- In the new, TW built app, a lack of facility to pick and choose the content of lists, menu choices and dropdowns is perceived as a major drawback.
BMMRO would like some flexibility and independence from tech (Thoughtworks) when determining the content of these lists and dropdowns. The lack of the ability to dynamically populate these is seen as a risk.

- TW is  tasked with analysing the task and proposing a solution to the issue, such that BMMRO will be less reliant on support (and somewhat awkward release cycle) from TW.
BMMRO should be able to populate the dropdowns dynamically, yet securely.

- We will only be looking at the Project dropdown list in the encounter datasheet page. (Further dropdowns will be addressed at a later date)


## Assumptions
- The client stakeholder will be the one accessing and updating the dropdown options.
- BMMRO will want to add, remove or provide a small subset of the options in the existing dropdowns.

## Options

These were the different options considered for the dropdown management implementation:

Prior to implementing the new solution,  the dropdown list for Projects (within the Encounter form) was populated from the static JavaScript file `project.js` (in `app/src/constants/formOptions` folder).
The client could not change the content of the dropdown when a project would expire or a new project was added. The process of changin the project list used to involve changes implemented by a Thoughtworks developer, and the whole cycle of development and deployment. Along with timezone difference of 5-6 hours, this meant a substantial delay between the time client would request change and the change taking place.



### Option 1 - Dropdown Feed  Managed in Firestore
This is the option that finally prevailed. With this option the client would login to Firebase console, access Firestore database, and add or remove projects so that the list reflects up-to-date status.
The dropdown was implemented in a way similar to *Previous Month Encounter* dropdown.

Pros:
- Available both online and offline when set up
- Easy to access with appropriate credentials
- Data is fetched dynamically, so any changes are reflected immediately.

Cons:
- Requires a certain amount of technical skill for the user. 
  - Deleting a project in live database requires a skill to navigate the Firebase console. 
  - Some understanding of Firestore database is needed.
  - Up-to-date credentials in order to access the DB content are required.


### Option 2 - Create Management Page
The client would log into an Admin page, where they would add or delete project names. 

Pros:
- Allows the greatest level of flexibility

Cons:
- Would take a long time to create
- May have security implications

### Option 3 - Options pulled from MS Access database
MS Access DB is only available while there is access to the local network. It was not possible to have the entries pulled while offline, and the nature of research is such that the BMMRO researchers spend a lot of time on the open seas.

Pros:
- MS access is the source of truth for projects in BMMRO

Cons:
- MS access is not available to the application, especially with the application needing offline capabilities



# Final Decision

We decided to go with Option 1, it struck a good balance of offline access and availability to the app with time taken to implement.
The list of projects will be stored in the firestore database. The values will be read from the Firestore database, and the projects will be added to and deleted from the database directly.

Pros:
- This is the quickest solution given the timelines.
- The querying of the database can be reused from the rest of the project and there is no need to reinvent the wheel.
- The data will be fetched dynamically, so any changes made to the database will reflect right away on the app.
- Flexibility to BMMRO to change the list whenever they want to.

Cons:
- The maintenance of the list is still a bit cumbersome and it is never recommended to make direct changes on the database.


# Implementation
- We created a new collection of projects (`project`) in the Firestore database, importing the existing data from the MS access database.
- We removed old hardcoded list of projects (`project.js`). We don't need a local copy of projects for offline use thanks to offline support detailed in [README.md](../app/README.md)
- We changed the code in `EncounterForm.jsx` to pull the project list data from Firestore. (This is detailed in the commits linked to Stories #454, #428 and #456)
