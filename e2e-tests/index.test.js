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

      console.log("ON LOGBOOK ENTRY PAGE");

      // Wait until Formik's autofill useEffect has set a non-empty, non-placeholder time
      await driver.wait(
        async () => {
          const val = await driver
            .findElement(wd.By.name("time"))
            .getAttribute("value");
          return val && !val.includes("_") && val !== "";
        },
        pageTimeout,
        "Time field autofill never completed",
      );

      console.log("CLICKING SAVE");

      await driver.findElement(wd.By.css("#saveLogBook")).click();

      console.log("CLICKED SAVE");

      console.log("SETTING TIMEOUTS");

      await driver.manage().setTimeouts({ implicit: pageTimeout });

      console.log("SET TIMEOUTS");

      await driver.sleep(3000);
      console.log("URL 3s after save click:", await driver.getCurrentUrl());

      console.log("WAITING FOR SAVE TRIP BUTTON");

      await driver.wait(
        wd.until.elementLocated(wd.By.css("#saveEndTrip")),
        pageTimeout,
      );

      console.log("SAVE TRIP BUTTON PRESENT");

      let newTripUrl = await driver.getCurrentUrl();

      console.log("newTripUrl: ", `--${newTripUrl}--`);

      console.log(
        "expected URL: ",
        `--${process.env.ENDPOINT}/trips/${tripId}/view--`,
      );

      console.log("RUNNING URL EQUALITY ASSERTION");

      expect(newTripUrl).toBe(`${process.env.ENDPOINT}/trips/${tripId}/view`);

      console.log("URL EQUALITY ASSERTION PASSED");

      console.log("GETTING LOGBOOK TEXT");

      const logbook = await driver.findElement(wd.By.id("logbook")).getText();

      console.log("GOT LOGBOOK TEXT: ", logbook);

      let expectedText = "Logbook entry 1";

      console.log("EXPECTED LOGBOOK TEXT: ", expectedText);

      console.log("RUNNING LOGBOOK TEXT EQUALITY ASSERTION");

      expect(logbook).toContain(expectedText);

      console.log("LOGBOOK TEXT EQUALITY ASSERTION PASSED");
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

      await driver.findElement(wd.By.css("#saveEndTrip")).click();

      await driver.manage().setTimeouts({ implicit: pageTimeout });
      await driver.wait(
        wd.until.elementLocated(wd.By.css("#confirmEndButton")),
        pageTimeout,
      );

      await driver.findElement(wd.By.css("#confirmEndButton")).click();

      await driver.manage().setTimeouts({ implicit: pageTimeout });

      let newTripUrl = await driver.getCurrentUrl();
      expect(newTripUrl).toBe(`${process.env.ENDPOINT}/trips/${tripId}/view`);
    },

    testTimeout,
  );

  it(
    "user navigate to edits trip",
    async () => {
      await driver.findElement(wd.By.css("#editTripInformation")).click();

      await driver.manage().setTimeouts({ implicit: pageTimeout });

      let editTripUrl = await driver.getCurrentUrl();

      expect(editTripUrl).toContain("/edit");
    },
    testTimeout,
  );

  it(
    "user edit trip",
    async () => {
      let tripNumber = await driver.findElement(wd.By.name("observers"));
      await tripNumber.sendKeys("e2e");

      await driver.findElement(wd.By.css("#saveTrip")).click();

      await driver.wait(wd.until.elementLocated(wd.By.css("nav")), pageTimeout);

      let homeUrl = await driver.getCurrentUrl();

      expect(homeUrl).toBe(`${process.env.ENDPOINT}/trips/${tripId}/view`);
    },
    testTimeout,
  );

  it(
    "user navigate to trip logbook",
    async () => {
      await driver.findElement(wd.By.css("#logbook-item")).click();

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

      await HydrophoneComment.sendKeys("e2e: hydrophone comment");
      await logbookComment.sendKeys("e2e: logbook comment");

      await driver.findElement(wd.By.css("#saveLogBook")).click();

      await driver.wait(wd.until.elementLocated(wd.By.css("nav")), pageTimeout);

      let url = await driver.getCurrentUrl();

      expect(url).toBe(`${process.env.ENDPOINT}/trips/${tripId}/view`);
    },
    testTimeout,
  );

  it(
    "navigate to encounters overview",
    async () => {
      await driver.findElement(wd.By.css("#encountersTab")).click();
      let newUrl = await driver.getCurrentUrl();

      expect(newUrl).toBe(`${process.env.ENDPOINT}/encounters`);
    },
    testTimeout,
  );

  it(
    "user navigate to creates a new encounter",
    async () => {
      await driver.findElement(wd.By.css("#new-encounters-button")).click();

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

      await seqNum.sendKeys("123");
      await driver.findElement(wd.By.css('select>option[value="EA"]')).click();
      await driver.wait(
        wd.until.elementLocated(wd.By.css("#newHabitat")),
        pageTimeout,
      );
      await driver.findElement(wd.By.css("#newHabitat")).click();

      await driver.manage().setTimeouts({ implicit: pageTimeout });

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
    "user fills out and end habitat",
    async () => {
      // Clear latitude and longitude in case it is autofilled by browser
      const longitude = await driver.findElement(wd.By.name("longitude"));
      await driver.executeScript("arguments[0].select()", longitude);
      await longitude.sendKeys(wd.Key.DELETE);

      const latitude = await driver.findElement(wd.By.name("latitude"));
      await driver.executeScript("arguments[0].select()", latitude);
      await latitude.sendKeys(wd.Key.DELETE);

      await driver.findElement(wd.By.css("#saveHabitat")).click();

      await driver.wait(
        wd.until.elementLocated(wd.By.css("#saveAnyway")),
        pageTimeout,
      );

      await driver.findElement(wd.By.css("#saveAnyway")).click();

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
      await driver.findElement(wd.By.css("#newBiopsy")).click();

      let newBiopsyUrl = await driver.getCurrentUrl();

      expect(newBiopsyUrl).toContain(`/biopsies/new`);

      // Clear latitude and longitude in case it is autofilled by browser
      const longitude = await driver.findElement(wd.By.name("longitude"));
      await driver.executeScript("arguments[0].select()", longitude);
      await longitude.sendKeys(wd.Key.DELETE);

      const latitude = await driver.findElement(wd.By.name("latitude"));
      await driver.executeScript("arguments[0].select()", latitude);
      await latitude.sendKeys(wd.Key.DELETE);

      await driver
        .findElement(
          wd.By.css('select>option[value="Atlantic spotted dolphin"]'),
        )
        .click();

      await driver.wait(
        wd.until.elementLocated(wd.By.css("#saveBiopsy")),
        pageTimeout,
      );

      await driver.findElement(wd.By.css("#saveBiopsy")).click();

      await driver.wait(
        wd.until.elementLocated(wd.By.css("#saveAnyway")),
        pageTimeout,
      );

      await driver.findElement(wd.By.css("#saveAnyway")).click();

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
      await driver.findElement(wd.By.css("#encounterDataSheet")).click();

      await driver.manage().setTimeouts({ implicit: pageTimeout });

      let editEncouterUrl = await driver.getCurrentUrl();

      expect(editEncouterUrl).toContain("/edit");
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

      await driver.findElement(wd.By.css("#saveEndEncounter")).click();

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
