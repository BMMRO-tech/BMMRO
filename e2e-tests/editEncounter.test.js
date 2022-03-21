import * as webdriver from 'selenium-webdriver';
import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, Timestamp, deleteDoc } from 'firebase/firestore/lite';
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";


let wd = webdriver.default;

const firebaseConfig = {
  projectId: process.env.PROJECT_ID,
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();


async function startDriver() {
  let driver = await new wd.Builder().forBrowser('safari').build();
  return driver;
}

const getPreviousMonth = (currentDate) =>{
  currentDate.setDate(1);
  return new Date(currentDate.setMonth(currentDate.getMonth()-1));
};

describe('edit encounter user journey', () => {

    let driver;
    let pageTimeout = 5000;
    let testTimeout = 20000;
    const encounterData = {
        area: "EA",
        enteredBy: "Research Assistant",
        exported: false,
        startTime:"10:56",
        startTimestamp: Timestamp.fromDate(getPreviousMonth(new Date())),
        hasEnded: false,
        sequenceNumber: "111",
        comments: "this is an e2e test",
        highTide: "",
        tagSuccess: "not-noted",
        audioRec: "",
        encounterNumber: "",
        lowTide: "",
        numSubAdultMale: "",
        biopsySuccess: "not-noted",
        project: "",
        visualIdentifications: "",
        numYoungOfYear: "",
        logbookNumber: "",
        numSubAdult: "",
        species: "Bottlenose dolphin - oceanic",
        location: "",
        needsToBeChecked: true,
        numAdultFemale: "",
        elapsedTime: "",
        numSubAdultFemale: "",
        numberOfAnimalsLow: "",
        numberOfAnimalsBest: "",
        numberOfAnimalsHigh: "",
        transect: "Off",
        numJuvenileFemale: "",
        endTime: "",
        videoRec: "",
        numAdultMale: "",
        tagAttempt: "No",
        numNeonates: "",
        vessel: "",
        numUnknown: "",
        cue: "",
        reasonForLeaving: "",
        numJuvenileMale: "",
        observers: "",
        endOfSearchEffort: "",
        biopsyAttempt: "No",
        numAdultUnknown: "",
        photographerFrame: "",
        numJuvenileUnknown: "",
    };
    const habitatData = {
        aspect:"",
        bearing:"",
        beaufortSeaState:"",
        behaviour:"",
        bottomSubstrate:"",
        cloudCover:"",
        comments:"",
        directionOfTravel:"",
        distance:"",
        endTime:"16:12:44",
        exported: false,
        gpsMark:"",
        groupCohesion:"",
        groupComposition:"",
        hasEnded:true,
        latitude:"51.513290",
        longitude:"-0.133864",
        numberOfAnimals:1,
        numberOfBoats:1,
        numberOfCalves:"",
        startTime:"16:12:39",
        surfaceBout:0,
        swellWaveHeight:"",
        tideState:"",
        waterDepth:"",
        waterDepthBeyondSoundings:false,
        waterTemp:""
    };

    beforeAll(async () => {
      signInWithEmailAndPassword(auth, process.env.EMAIL, process.env.PASSWORD)
      .then(async() => {
        console.log("firebase authentication success")
        await setDoc(doc(db, "encounter", "e2etest"), encounterData);
        await setDoc(doc(db, "encounter", "e2etest", "habitatUse", "e2etesthabitat"), habitatData);
      })
      .catch((error) => {
        console.log("firebase authentication error: ", error)
      });
      
      driver = await startDriver();
    }, testTimeout)

    it('user successfully logs in', async () => {

        await driver.get(process.env.ENDPOINT);
    
        await driver.manage().setTimeouts({ implicit: pageTimeout });
    
        let email = driver.findElement(wd.By.name('email'));
        let password = driver.findElement(wd.By.name('password'));
    
        await email.sendKeys(process.env.EMAIL);
        await password.sendKeys(process.env.PASSWORD);
    
        await driver.findElement(wd.By.css('button')).click();
    
        await driver.wait(wd.until.elementLocated(wd.By.css('h1')), pageTimeout);
        let title = await driver.findElement(wd.By.css('h1')).getText();
        let expectedTitle = "ENCOUNTERS";
        expect(title).toBe(expectedTitle);
    
        let homeUrl = await driver.getCurrentUrl();
    
        expect(homeUrl).toBe(`${process.env.ENDPOINT}/encounters`);
      }, testTimeout)

      it('user loads previous months encounters', async () => {

        const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

        const today = new Date()
        const currentMonthYear = month[today.getMonth()] + " " + today.getFullYear();

        await driver.wait(wd.until.elementLocated(wd.By.xpath(`//*[text()='${currentMonthYear}']`)), pageTimeout);

        await driver.findElement(wd.By.css('#loadEncounter')).click();


        const e2etestListElement = wd.By.css('#e2etest');
        await driver.wait(wd.until.elementLocated(e2etestListElement),pageTimeout);
        await driver.findElement(e2etestListElement).click();

        let EncounterUrl = await driver.getCurrentUrl();
        expect(EncounterUrl).toBe(`${process.env.ENDPOINT}/encounters/e2etest/habitat-uses`);
      }, testTimeout)

      afterAll(async () => {
        await driver.quit();
    
        signOut(auth).then(() => {
          console.log("firebase sign out success")
        }).catch((error) => {
          console.log("firebase sign out error: ", error)
        });
      }, testTimeout)

});