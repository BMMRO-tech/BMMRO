import * as webdriver from 'selenium-webdriver';
import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore/lite';
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import {encounterData} from "./__fixtures__/encounter";
import {habitatData} from "./__fixtures__/habitat";

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

describe('edit encounter user journey', () => {

    let driver;
    let pageTimeout = 5000;
    let testTimeout = 20000;

    beforeAll(async () => {
      signInWithEmailAndPassword(auth, process.env.EMAIL, process.env.PASSWORD)
      .then(async() => {
        console.log("firebase authentication success")
        await setDoc(doc(db, "encounter", "e2etest"), encounterData[0]);
        await setDoc(doc(db, "encounter", "e2etest", "habitatUse", "e2etesthabitat"), habitatData[0]);
        await setDoc(doc(db, "encounter", "e2etestExported"), encounterData[1]);
        await setDoc(doc(db, "encounter", "e2etestExported", "habitatUse", "e2etesthabitatExported"), habitatData[1]);
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

      // it('user checks an exported encounters', async () => {

      //   await driver.findElement(wd.By.css('#e2etestExported')).click();

      //   let EncounterUrl = await driver.getCurrentUrl();
      //   expect(EncounterUrl).toBe(`${process.env.ENDPOINT}/encounters/e2etestExported/habitat-uses`);

      //   await driver.findElement(wd.By.css('#e2etestExported')).click()

      //   await driver.manage().setTimeouts({ implicit: pageTimeout });

      //   let habitatUrl = await driver.getCurrentUrl();

      //   expect(habitatUrl).toBe(`${process.env.ENDPOINT}/encounters/e2etestExported/habitat-uses/e2etesthabitatExported/view`);

      // }, testTimeout)

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

      it('user edits habitat', async () => {

        await driver.findElement(wd.By.css('#e2etest')).click()

        await driver.manage().setTimeouts({ implicit: pageTimeout });

        let habitatUrl = await driver.getCurrentUrl();

        expect(habitatUrl).toBe(`${process.env.ENDPOINT}/encounters/e2etest/habitat-uses/e2etesthabitat/edit`);

        await driver.findElement(wd.By.css('#Refresh')).click()
    
        await driver.findElement(wd.By.name('comments')).sendKeys("test edit habitat");

        await driver.findElement(wd.By.css('#saveHabitat')).click();

        await driver.manage().setTimeouts({ implicit: pageTimeout });

        let EncounterUrl = await driver.getCurrentUrl();
        expect(EncounterUrl).toBe(`${process.env.ENDPOINT}/encounters/e2etest/habitat-uses`);

      }, testTimeout);

      it('user edits encounter', async () => {

        await driver.findElement(wd.By.css('#encounterDataSheet')).click()

        await driver.manage().setTimeouts({ implicit: pageTimeout });

        let habitatUrl = await driver.getCurrentUrl();

        expect(habitatUrl).toBe(`${process.env.ENDPOINT}/encounters/e2etest/edit`);
    
        await driver.findElement(wd.By.name('sequenceNumber')).sendKeys("abc");

        await driver.findElement(wd.By.css('#saveEncounter')).click();

        await driver.wait(wd.until.elementLocated(wd.By.css('#e2etest')),pageTimeout);
        
        let EncounterUrl = await driver.getCurrentUrl();
        expect(EncounterUrl).toBe(`${process.env.ENDPOINT}/encounters/e2etest/habitat-uses`);

      }, testTimeout);

      it('checks database for edited encounter', async () => {

        const docRefEncounter = doc(db, "encounter", "e2etest");
        const docSnapEncounter = await getDoc(docRefEncounter);
    
        expect(docSnapEncounter.data().sequenceNumber).toBe("111abc")
      }, testTimeout)
    
    
      it('checks database for edited habitat', async () => {
    
        const docRefHabitat = doc(db, "encounter", "e2etest", "habitatUse", "e2etesthabitat");
        const docSnapHabitat = await getDoc(docRefHabitat);
    
        expect(docSnapHabitat.data().comments).toBe("test edit habitat")
      }, testTimeout)

      it('deletes habitat and encounter from database', async () => {

        await deleteDoc(doc(db, "encounter", "e2etest", "habitatUse", "e2etesthabitat"));

        await deleteDoc(doc(db, "encounter", "e2etest"));

        const docRefEncounter = doc(db, "encounter", "e2etest");
    
        const deletedEncounter = await getDoc(docRefEncounter);

        await deleteDoc(doc(db, "encounter", "e2etestExported", "habitatUse", "e2etesthabitatExported"));

        await deleteDoc(doc(db, "encounter", "e2etestExported"));

        const docRefEncounterExported = doc(db, "encounter", "e2etestExported");
    
        const deletedEncounterExported = await getDoc(docRefEncounterExported);
    
        expect(deletedEncounter.exists()).toBeFalsy()
        expect(deletedEncounterExported.exists()).toBeFalsy()
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