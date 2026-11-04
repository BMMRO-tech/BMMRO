import * as webdriver from "selenium-webdriver";
import { Options as ChromeOptions } from "selenium-webdriver/chrome.js";
import "dotenv/config";
import { initializeApp } from "firebase/app";
import { deleteDoc, doc, getDoc, getFirestore } from "firebase/firestore/lite";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

let wd = webdriver.default;

const pageTimeout = 10000;

const firebaseConfig = {
  projectId: process.env.PROJECT_ID,
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

async function startDriver() {
  console.log("process.env.DRIVER: ", process.env.DRIVER);
  const options = new ChromeOptions();
  // Prevent password leak detection from producing a popup
  options.setUserPreferences({
    "profile.password_manager_leak_detection": false,
  });
  let driver;
  if (process.env.DRIVER === "chrome") {
    driver = await new wd.Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
  } else if (process.env.DRIVER === "safari") {
    driver = await new wd.Builder().forBrowser("safari").build();
  } else {
    throw new Error("process.env.DRIVER must be one of 'chrome' or 'safari'.");
  }
  return driver;
}

const waitForStableElement = async (driver, locator) => {
  await driver.wait(wd.until.elementLocated(locator), pageTimeout);
  const element = await driver.findElement(locator);
  await driver.wait(wd.until.elementIsVisible(element), pageTimeout);
  await driver.wait(wd.until.elementIsEnabled(element), pageTimeout);
  return element;
};

const clickOption = async (driver, locator) => {
  await driver.wait(wd.until.elementLocated(locator), pageTimeout);
  await driver.findElement(locator).click();
};

const clearInput = async (driver, locator) => {
  const element = await waitForStableElement(driver, locator);
  await driver.executeScript("arguments[0].select()", element);
  await element.sendKeys(wd.Key.DELETE);
};

describe("create a new encounter user journey", () => {
  let driver;
  let encounterId;
  let tripId;
  let logbookId;
  let habitatId;
  let biopsyId;
  let testTimeout = 50000;

  beforeAll(async () => {
    signInWithEmailAndPassword(auth, process.env.EMAIL, process.env.PASSWORD)
      .then(() => {
        console.log("firebase authentication success");
      })
      .catch((error) => {
        console.log("firebase authentication error: ", error);
      });
    driver = await startDriver();
    await driver.manage().setTimeouts({ implicit: 0 });
  }, testTimeout);

  it(
    "user successfully logs in",
    async () => {
      driver.manage().window().maximize();

      await driver.get(process.env.ENDPOINT);

      const email = await waitForStableElement(driver, wd.By.name("email"));
      await email.sendKeys(process.env.EMAIL);

      const password = await waitForStableElement(
        driver,
        wd.By.name("password"),
      );
      await password.sendKeys(process.env.PASSWORD);

      const loginButton = await waitForStableElement(
        driver,
        wd.By.css("button"),
      );
      await loginButton.click();

      const tripsTab = await waitForStableElement(
        driver,
        wd.By.css("#tripsTab"),
      );
      let title = await tripsTab.getText();

      let expectedTitle = "TRIPS";
      expect(title).toBe(expectedTitle);

      let homeUrl = await driver.getCurrentUrl();

      expect(homeUrl).toBe(`${process.env.ENDPOINT}/trips`);
    },
    testTimeout,
  );

  it(
    "user navigates to create a new trip",
    async () => {
      const newTripButton = await waitForStableElement(
        driver,
        wd.By.css("#new-trips-button"),
      );
      await newTripButton.click();

      await driver.wait(
        wd.until.elementLocated(wd.By.name("tripNumber")),
        pageTimeout,
      );

      let newTripUrl = await driver.getCurrentUrl();

      expect(newTripUrl).toBe(`${process.env.ENDPOINT}/trips/new`);
    },
    testTimeout,
  );

  it(
    "user creates a new trip",
    async () => {
      const tripNumber = await waitForStableElement(
        driver,
        wd.By.name("tripNumber"),
      );
      await tripNumber.sendKeys("123");

      //area
      await clickOption(driver, wd.By.css('select>option[value="EA"]'));
      //vessel
      await clickOption(driver, wd.By.css('select>option[value="Chimo"]'));

      const newLogBook = await waitForStableElement(
        driver,
        wd.By.css("#newLogBook"),
      );
      await newLogBook.click();

      let newTripUrl = await driver.getCurrentUrl();

      expect(newTripUrl).toContain(`/logbook-entry/new`);
    },
    testTimeout,
  );

  it(
    "stores trip ID",
    async () => {
      let newTripUrl = await driver.getCurrentUrl();

      tripId = newTripUrl.split("/")[4];
    },
    testTimeout,
  );

  it(
    "user creates a new logbook entry",
    async () => {
      const timeInput = await waitForStableElement(driver, wd.By.name("time"));
      await timeInput.clear();
      await timeInput.sendKeys("100000");

      const saveLogBook = await waitForStableElement(
        driver,
        wd.By.css("#saveLogBook"),
      );
      await saveLogBook.click();

      await driver.wait(
        wd.until.elementLocated(wd.By.css("#saveEndTrip")),
        pageTimeout,
      );

      let newTripUrl = await driver.getCurrentUrl();
      expect(newTripUrl).toBe(`${process.env.ENDPOINT}/trips/${tripId}/view`);

      const logbookList = await waitForStableElement(
        driver,
        wd.By.id("logbook"),
      );
      const logbook = await logbookList.getText();

      let expectedText = "Logbook entry 1";
      expect(logbook).toContain(expectedText);
    },

    testTimeout,
  );
  it(
    "user ends a trip",
    async () => {
      const saveEndTrip = await waitForStableElement(
        driver,
        wd.By.css("#saveEndTrip"),
      );
      await saveEndTrip.click();

      const confirmEndButton = await waitForStableElement(
        driver,
        wd.By.css("#confirmEndButton"),
      );
      await confirmEndButton.click();

      await driver.wait(
        wd.until.elementLocated(wd.By.css("#editTripInformation")),
        pageTimeout,
      );

      let newTripUrl = await driver.getCurrentUrl();
      expect(newTripUrl).toBe(`${process.env.ENDPOINT}/trips/${tripId}/view`);
    },

    testTimeout,
  );

  it(
    "user navigates to edit trip",
    async () => {
      const editTripInformation = await waitForStableElement(
        driver,
        wd.By.css("#editTripInformation"),
      );
      await editTripInformation.click();

      await driver.wait(
        wd.until.elementLocated(wd.By.css("#saveTrip")),
        pageTimeout,
      );

      let editTripUrl = await driver.getCurrentUrl();

      expect(editTripUrl).toContain("/edit");
    },
    testTimeout,
  );

  it(
    "user edits trip",
    async () => {
      const observers = await waitForStableElement(
        driver,
        wd.By.name("observers"),
      );
      await observers.sendKeys("e2e");

      const saveTrip = await waitForStableElement(
        driver,
        wd.By.css("#saveTrip"),
      );
      await saveTrip.click();

      await driver.wait(
        wd.until.elementLocated(wd.By.css("#editTripInformation")),
        pageTimeout,
      );

      let homeUrl = await driver.getCurrentUrl();

      expect(homeUrl).toBe(`${process.env.ENDPOINT}/trips/${tripId}/view`);
    },
    testTimeout,
  );

  it(
    "user navigate to trip logbook",
    async () => {
      const logbookItem = await waitForStableElement(
        driver,
        wd.By.css("#logbook-item"),
      );
      await logbookItem.click();

      await driver.wait(
        wd.until.elementLocated(wd.By.name("hydrophoneComments")),
        pageTimeout,
      );

      let editLogbookUrl = await driver.getCurrentUrl();

      logbookId = editLogbookUrl.split("/")[6];

      expect(editLogbookUrl).toContain(
        `/trips/${tripId}/logbook-entry/${logbookId}`,
      );
    },
    testTimeout,
  );

  it(
    "user ends editing logbook",
    async () => {
      const hydrophoneComment = await waitForStableElement(
        driver,
        wd.By.name("hydrophoneComments"),
      );
      await hydrophoneComment.sendKeys("e2e: hydrophone comment");

      const logbookComment = await waitForStableElement(
        driver,
        wd.By.name("logbookComments"),
      );
      await logbookComment.sendKeys("e2e: logbook comment");

      const saveLogBook = await waitForStableElement(
        driver,
        wd.By.css("#saveLogBook"),
      );
      await saveLogBook.click();

      await driver.wait(wd.until.elementLocated(wd.By.css("nav")), pageTimeout);

      let url = await driver.getCurrentUrl();

      expect(url).toBe(`${process.env.ENDPOINT}/trips/${tripId}/view`);
    },
    testTimeout,
  );

  it(
    "navigate to encounters overview",
    async () => {
      const encountersTab = await waitForStableElement(
        driver,
        wd.By.css("#encountersTab"),
      );
      await encountersTab.click();

      await driver.wait(
        wd.until.elementLocated(wd.By.css("#new-encounters-button")),
        pageTimeout,
      );

      let newUrl = await driver.getCurrentUrl();

      expect(newUrl).toBe(`${process.env.ENDPOINT}/encounters`);
    },
    testTimeout,
  );

  it(
    "user navigates to create a new encounter",
    async () => {
      const newEncountersButton = await waitForStableElement(
        driver,
        wd.By.css("#new-encounters-button"),
      );
      await newEncountersButton.click();

      await driver.wait(
        wd.until.elementLocated(wd.By.name("sequenceNumber")),
        pageTimeout,
      );

      let newEncounterUrl = await driver.getCurrentUrl();

      expect(newEncounterUrl).toBe(`${process.env.ENDPOINT}/encounters/new`);
    },
    testTimeout,
  );

  it(
    "user creates a new habitat",
    async () => {
      const seqNum = await waitForStableElement(
        driver,
        wd.By.name("sequenceNumber"),
      );
      await seqNum.sendKeys("123");

      await clickOption(driver, wd.By.css('select>option[value="EA"]'));

      const newHabitat = await waitForStableElement(
        driver,
        wd.By.css("#newHabitat"),
      );
      await newHabitat.click();

      await driver.wait(
        wd.until.elementLocated(wd.By.css("#saveHabitat")),
        pageTimeout,
      );

      let newEncounterUrl = await driver.getCurrentUrl();

      expect(newEncounterUrl).toContain(`/habitat-uses/new`);
    },
    testTimeout,
  );

  it(
    "stores encounter ID",
    async () => {
      let newEncounterUrl = await driver.getCurrentUrl();

      encounterId = newEncounterUrl.split("/")[4];
    },
    testTimeout,
  );

  it(
    "user fills out and ends habitat",
    async () => {
      await clearInput(driver, wd.By.name("longitude"));
      await clearInput(driver, wd.By.name("latitude"));

      const saveHabitat = await waitForStableElement(
        driver,
        wd.By.css("#saveHabitat"),
      );
      await saveHabitat.click();

      const saveAnyway = await waitForStableElement(
        driver,
        wd.By.css("#saveAnyway"),
      );
      await saveAnyway.click();

      let newHabitatUrl = await driver.getCurrentUrl();

      expect(newHabitatUrl).toBe(
        `${process.env.ENDPOINT}/encounters/${encounterId}/habitat-uses`,
      );
    },
    testTimeout,
  );

  it(
    "stores habitat ID",
    async () => {
      const habitatUse = await waitForStableElement(
        driver,
        wd.By.css("#habitatUse"),
      );
      let newHabitatUrl = await habitatUse.getAttribute("href");

      habitatId = newHabitatUrl.split("/")[6];
    },
    testTimeout,
  );

  it(
    "user creates a new biopsy",
    async () => {
      const newBiopsy = await waitForStableElement(
        driver,
        wd.By.css("#newBiopsy"),
      );
      await newBiopsy.click();

      let newBiopsyUrl = await driver.getCurrentUrl();

      expect(newBiopsyUrl).toContain(`/biopsies/new`);

      // Clear latitude and longitude in case it is autofilled by browser
      await clearInput(driver, wd.By.name("longitude"));
      await clearInput(driver, wd.By.name("latitude"));

      await clickOption(
        driver,
        wd.By.css('select>option[value="Atlantic spotted dolphin"]'),
      );

      const saveBiopsy = await waitForStableElement(
        driver,
        wd.By.css("#saveBiopsy"),
      );
      await saveBiopsy.click();

      const saveAnyway = await waitForStableElement(
        driver,
        wd.By.css("#saveAnyway"),
      );
      await saveAnyway.click();

      let currentUrl = await driver.getCurrentUrl();

      expect(currentUrl).toBe(
        `${process.env.ENDPOINT}/encounters/${encounterId}/habitat-uses`,
      );
    },
    testTimeout,
  );

  it(
    "stores biopsy ID",
    async () => {
      const biopsy = await waitForStableElement(driver, wd.By.css("#biopsy"));
      let newBiopsyUrl = await biopsy.getAttribute("href");

      biopsyId = newBiopsyUrl.split("/")[6];
    },
    testTimeout,
  );

  it(
    "user edits encounter",
    async () => {
      const encounterDataSheet = await waitForStableElement(
        driver,
        wd.By.css("#encounterDataSheet"),
      );
      await encounterDataSheet.click();

      let editEncouterUrl = await driver.getCurrentUrl();

      expect(editEncouterUrl).toContain("/edit");
    },
    testTimeout,
  );

  it(
    "user ends encounter",
    async () => {
      await clickOption(
        driver,
        wd.By.css('#species>option[value="Atlantic spotted dolphin"]'),
      );

      const saveEndEncounter = await waitForStableElement(
        driver,
        wd.By.css("#saveEndEncounter"),
      );
      await saveEndEncounter.click();

      await driver.wait(wd.until.elementLocated(wd.By.css("nav")), pageTimeout);

      let homeUrl = await driver.getCurrentUrl();

      expect(homeUrl).toBe(`${process.env.ENDPOINT}/encounters`);
    },
    testTimeout,
  );

  it(
    "checks database for new encounter",
    async () => {
      const docRefEncounter = doc(db, "encounter", encounterId);
      const docSnapEncounter = await getDoc(docRefEncounter);

      expect(docSnapEncounter.exists()).toBeTruthy();
    },
    testTimeout,
  );

  it(
    "checks database for new trip",
    async () => {
      const docRefTrip = doc(db, "trip", tripId);
      const docSnapTrip = await getDoc(docRefTrip);

      expect(docSnapTrip.exists()).toBeTruthy();
    },
    testTimeout,
  );

  it(
    "checks database for new logbook entry",
    async () => {
      const docRefLogbook = doc(db, "trip", tripId, "logbookEntry", logbookId);
      const docSnapLogbook = await getDoc(docRefLogbook);

      expect(docSnapLogbook.exists()).toBeTruthy();
    },
    testTimeout,
  );

  it(
    "checks database for new habitat",
    async () => {
      const docRefHabitat = doc(
        db,
        "encounter",
        encounterId,
        "habitatUse",
        habitatId,
      );
      const docSnapHabitat = await getDoc(docRefHabitat);

      expect(docSnapHabitat.exists()).toBeTruthy();
    },
    testTimeout,
  );

  it(
    "checks database for new biopsy",
    async () => {
      const docRefHabitat = doc(
        db,
        "encounter",
        encounterId,
        "biopsy",
        biopsyId,
      );
      const docSnapHabitat = await getDoc(docRefHabitat);

      expect(docSnapHabitat.exists()).toBeTruthy();
    },
    testTimeout,
  );

  it(
    "deletes biopsy, habitat and encounter from database",
    async () => {
      if (biopsyId) {
        await deleteDoc(doc(db, "encounter", encounterId, "biopsy", biopsyId));
      }

      if (habitatId) {
        await deleteDoc(
          doc(db, "encounter", encounterId, "habitatUse", habitatId),
        );
      }

      if (encounterId) {
        await deleteDoc(doc(db, "encounter", encounterId));
      }

      const docRefEncounter = doc(db, "encounter", encounterId);

      const deletedEncounter = await getDoc(docRefEncounter);

      expect(deletedEncounter.exists()).toBeFalsy();
    },
    testTimeout,
  );

  afterAll(async () => {
    await driver.quit();

    signOut(auth)
      .then(() => {
        console.log("firebase sign out success");
      })
      .catch((error) => {
        console.log("firebase sign out error: ", error);
      });
  }, testTimeout);
});
