import * as webdriver from "selenium-webdriver";
import { Options as ChromeOptions } from "selenium-webdriver/chrome.js";
import "dotenv/config";
import { initializeApp } from "firebase/app";
import { deleteDoc, doc, getDoc, getFirestore } from "firebase/firestore/lite";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

let wd = webdriver.default;

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

// In CI, clicks and keyboard input must go through executeScript because
// Safari CI does not reliably handle WebDriver's native interaction commands
// on a Reach Router SPA backed by Firestore.
const click = async (element, driver) => {
  if (process.env.CI) {
    await driver.executeScript("arguments[0].click()", element);
  } else {
    await element.click();
  }
};

const clearInput = async (element, driver) => {
  if (process.env.CI) {
    await driver.executeScript(
      `var setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
       setter.call(arguments[0], '');
       arguments[0].dispatchEvent(new Event('input', { bubbles: true }));
       arguments[0].dispatchEvent(new Event('change', { bubbles: true }));`,
      element,
    );
  } else {
    await driver.executeScript("arguments[0].select()", element);
    await element.sendKeys(wd.Key.DELETE);
  }
};

const selectOption = async (selectElement, value, driver) => {
  if (process.env.CI) {
    await driver.executeScript(
      `arguments[0].value = arguments[1];
       arguments[0].dispatchEvent(new Event('change', { bubbles: true }));`,
      selectElement,
      value,
    );
  } else {
    await selectElement
      .findElement(wd.By.css(`option[value="${value}"]`))
      .click();
  }
};

const fillInput = async (element, value, driver) => {
  if (process.env.CI) {
    await driver.executeScript(
      `var proto = arguments[0].tagName === 'TEXTAREA'
         ? window.HTMLTextAreaElement.prototype
         : window.HTMLInputElement.prototype;
       var setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
       setter.call(arguments[0], arguments[1]);
       arguments[0].dispatchEvent(new Event('input', { bubbles: true }));
       arguments[0].dispatchEvent(new Event('change', { bubbles: true }));`,
      element,
      value,
    );
  } else {
    await element.sendKeys(value);
  }
};

describe("create a new encounter user journey", () => {
  let driver;
  let encounterId;
  let tripId;
  let logbookId;
  let habitatId;
  let biopsyId;
  let pageTimeout = 10000;
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
  }, testTimeout);

  it(
    "user successfully logs in",
    async () => {
      driver.manage().window().maximize();

      await driver.get(process.env.ENDPOINT);

      await driver.manage().setTimeouts({ implicit: pageTimeout });

      let email = driver.findElement(wd.By.name("email"));
      await email.sendKeys(process.env.EMAIL);

      let password = driver.findElement(wd.By.name("password"));
      await password.sendKeys(process.env.PASSWORD);

      await driver.findElement(wd.By.css("button")).click();

      await driver.wait(wd.until.elementLocated(wd.By.css("nav")), pageTimeout);

      let title = await driver.findElement(wd.By.css("#tripsTab")).getText();

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
      await driver.findElement(wd.By.css("#new-trips-button")).click();

      await driver.manage().setTimeouts({ implicit: pageTimeout });

      let newTripUrl = await driver.getCurrentUrl();

      expect(newTripUrl).toBe(`${process.env.ENDPOINT}/trips/new`);
    },
    testTimeout,
  );

  it(
    "user creates a new trip",
    async () => {
      let tripNumber = await driver.findElement(wd.By.name("tripNumber"));
      await tripNumber.sendKeys("123");

      //area
      await driver.findElement(wd.By.css('select>option[value="EA"]')).click();
      //vessel
      await driver
        .findElement(wd.By.css('select>option[value="Chimo"]'))
        .click();

      await driver.wait(
        wd.until.elementLocated(wd.By.css("#newLogBook")),
        pageTimeout,
      );

      await driver.findElement(wd.By.css("#newLogBook")).click();

      await driver.manage().setTimeouts({ implicit: pageTimeout });

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
      await driver.wait(
        wd.until.elementLocated(wd.By.css("#saveLogBook")),
        pageTimeout,
      );

      const saveLogBookButton = await driver.findElement(
        wd.By.css("#saveLogBook"),
      );
      await click(saveLogBookButton, driver);

      await driver.wait(
        wd.until.elementLocated(wd.By.css("#saveEndTrip")),
        pageTimeout,
      );

      let newTripUrl = await driver.getCurrentUrl();
      expect(newTripUrl).toBe(`${process.env.ENDPOINT}/trips/${tripId}/view`);

      const logbook = await driver.findElement(wd.By.id("logbook")).getText();

      let expectedText = "Logbook entry 1";
      expect(logbook).toContain(expectedText);
    },

    testTimeout,
  );
  it(
    "user ends a trip",
    async () => {
      await driver.wait(
        wd.until.elementLocated(wd.By.css("#saveEndTrip")),
        pageTimeout,
      );

      const saveEndTripButton = await driver.findElement(
        wd.By.css("#saveEndTrip"),
      );
      await click(saveEndTripButton, driver);

      await driver.wait(
        wd.until.elementLocated(wd.By.css("#confirmEndButton")),
        pageTimeout,
      );

      const confirmEndTripButton = await driver.findElement(
        wd.By.css("#confirmEndButton"),
      );
      await click(confirmEndTripButton, driver);

      let newTripUrl = await driver.getCurrentUrl();
      expect(newTripUrl).toBe(`${process.env.ENDPOINT}/trips/${tripId}/view`);
    },

    testTimeout,
  );

  it(
    "user navigates to edit trip",
    async () => {
      await driver.wait(
        wd.until.elementLocated(wd.By.css("#editTripInformation")),
        pageTimeout,
      );

      const editTripInformationButton = await driver.findElement(
        wd.By.css("#editTripInformation"),
      );
      await click(editTripInformationButton, driver);

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
      await driver.wait(
        wd.until.elementLocated(wd.By.name("observers")),
        pageTimeout,
      );
      const observers = await driver.findElement(wd.By.name("observers"));
      await fillInput(observers, "e2e", driver);
      const saveTripButton = await driver.findElement(wd.By.css("#saveTrip"));
      await click(saveTripButton, driver);
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
      const logbookItem = await driver.findElement(wd.By.css("#logbook-item"));
      await click(logbookItem, driver);

      await driver.manage().setTimeouts({ implicit: pageTimeout });

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
      let HydrophoneComment = await driver.findElement(
        wd.By.name("hydrophoneComments"),
      );
      let logbookComment = await driver.findElement(
        wd.By.name("logbookComments"),
      );

      await fillInput(HydrophoneComment, "e2e: hydrophone comment", driver);
      await fillInput(logbookComment, "e2e: logbook comment", driver);

      const saveLogBook = await driver.findElement(wd.By.css("#saveLogBook"));
      await click(saveLogBook, driver);

      await driver.wait(wd.until.elementLocated(wd.By.css("nav")), pageTimeout);

      let url = await driver.getCurrentUrl();

      expect(url).toBe(`${process.env.ENDPOINT}/trips/${tripId}/view`);
    },
    testTimeout,
  );

  it(
    "navigate to encounters overview",
    async () => {
      const encountersTab = await driver.findElement(
        wd.By.css("#encountersTab"),
      );
      await click(encountersTab, driver);

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
      const newEncountersButton = await driver.findElement(
        wd.By.css("#new-encounters-button"),
      );
      await click(newEncountersButton, driver);

      await driver.manage().setTimeouts({ implicit: pageTimeout });

      let newEncounterUrl = await driver.getCurrentUrl();

      expect(newEncounterUrl).toBe(`${process.env.ENDPOINT}/encounters/new`);
    },
    testTimeout,
  );

  it(
    "user creates a new habitat",
    async () => {
      let seqNum = await driver.findElement(wd.By.name("sequenceNumber"));

      await fillInput(seqNum, "123", driver);
      await driver.findElement(wd.By.css('select>option[value="EA"]')).click();

      await driver.wait(
        wd.until.elementLocated(wd.By.css("#newHabitat")),
        pageTimeout,
      );
      const newHabitat = await driver.findElement(wd.By.css("#newHabitat"));
      await click(newHabitat, driver);

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
      // Clear latitude and longitude in case it is autofilled by browser
      const longitude = await driver.findElement(wd.By.name("longitude"));
      await clearInput(longitude, driver);

      const latitude = await driver.findElement(wd.By.name("latitude"));
      await clearInput(latitude, driver);

      const saveHabitat = await driver.findElement(wd.By.css("#saveHabitat"));
      await click(saveHabitat, driver);

      await driver.wait(
        wd.until.elementLocated(wd.By.css("#saveAnyway")),
        pageTimeout,
      );

      const saveAnyway = await driver.findElement(wd.By.css("#saveAnyway"));
      await click(saveAnyway, driver);

      await driver.manage().setTimeouts({ implicit: pageTimeout });

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
      await driver.wait(
        wd.until.elementLocated(wd.By.css("#habitatUse")),
        pageTimeout,
      );
      let newHabitatUrl = await driver
        .findElement(wd.By.css("#habitatUse"))
        .getAttribute("href");

      habitatId = newHabitatUrl.split("/")[6];
    },
    testTimeout,
  );

  it(
    "user creates a new biopsy",
    async () => {
      const newBiopsy = await driver.findElement(wd.By.css("#newBiopsy"));
      await click(newBiopsy, driver);

      let newBiopsyUrl = await driver.getCurrentUrl();

      expect(newBiopsyUrl).toContain(`/biopsies/new`);

      // Clear latitude and longitude in case it is autofilled by browser
      const longitude = await driver.findElement(wd.By.name("longitude"));
      await clearInput(longitude, driver);

      const latitude = await driver.findElement(wd.By.name("latitude"));
      await clearInput(latitude, driver);

      const speciesSelect = await driver.findElement(wd.By.name("species"));
      await selectOption(speciesSelect, "Atlantic spotted dolphin", driver);

      await driver.wait(
        wd.until.elementLocated(wd.By.css("#saveBiopsy")),
        pageTimeout,
      );

      const saveBiopsy = await driver.findElement(wd.By.css("#saveBiopsy"));
      await click(saveBiopsy, driver);

      await driver.wait(
        wd.until.elementLocated(wd.By.css("#saveAnyway")),
        pageTimeout,
      );

      const saveAnyway = await driver.findElement(wd.By.css("#saveAnyway"));
      await click(saveAnyway, driver);

      await driver.manage().setTimeouts({ implicit: pageTimeout });

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
      await driver.wait(
        wd.until.elementLocated(wd.By.css("#biopsy")),
        pageTimeout,
      );
      let newBiopsyUrl = await driver
        .findElement(wd.By.css("#biopsy"))
        .getAttribute("href");

      biopsyId = newBiopsyUrl.split("/")[6];
    },
    testTimeout,
  );

  it(
    "user edits encounter",
    async () => {
      const encounterDataSheet = await driver.findElement(
        wd.By.css("#encounterDataSheet"),
      );
      await click(encounterDataSheet, driver);

      await driver.manage().setTimeouts({ implicit: pageTimeout });

      let editEncounterUrl = await driver.getCurrentUrl();

      expect(editEncounterUrl).toContain("/edit");
    },
    testTimeout,
  );

  it(
    "user ends encounter",
    async () => {
      await driver
        .findElement(
          wd.By.css('#species>option[value="Atlantic spotted dolphin"]'),
        )
        .click();

      const saveEndEncounter = await driver.findElement(
        wd.By.css("#saveEndEncounter"),
      );
      await click(saveEndEncounter, driver);

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
