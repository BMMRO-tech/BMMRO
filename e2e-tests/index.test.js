import * as webdriver from 'selenium-webdriver';
import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, deleteDoc } from 'firebase/firestore/lite';

let wd = webdriver.default;

const firebaseConfig = {
  projectId: process.env.PROJECT_ID,
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function startDriver() {
  let driver = await new wd.Builder().forBrowser('safari').build();
  return driver;
}

describe('create a new encounter user journey', () => {

  let driver;
  let encounterId;
  let habitatId;
  let pageTimeout = 5000;
  let testTimeout = 20000;

  beforeAll(async () => {
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

    await driver.wait(wd.until.elementLocated(wd.By.css('.css-iwuz5a-Encounters')), pageTimeout);

    let homeUrl = await driver.getCurrentUrl();

    expect(homeUrl).toBe(`${process.env.ENDPOINT}/encounters`);
  }, testTimeout)

  it('user creates a new encounter', async () => {

    await driver.findElement(wd.By.css('#newEncounter')).click();

    await driver.manage().setTimeouts({ implicit: pageTimeout });

    let newEncounterUrl = await driver.getCurrentUrl();

    expect(newEncounterUrl).toBe(`${process.env.ENDPOINT}/encounters/new`);
  }, testTimeout)

  it('user creates a new habitat', async () => {

    let seqNum = await driver.findElement(wd.By.name('sequenceNumber'));

    await seqNum.sendKeys("123");
    await driver.findElement(wd.By.css('select>option[value="EA"]')).click();

    await driver.findElement(wd.By.css('#newHabitat')).click();

    await driver.manage().setTimeouts({ implicit: pageTimeout });

    let newHabitatUrl = await driver.getCurrentUrl();

    await driver.findElement(wd.By.css('#saveHabitat')).click();

    expect(newHabitatUrl).toContain("/habitat-uses/new");
  }, testTimeout)

  it('stores encounter and habitat ID', async () => {

    await driver.manage().setTimeouts({ implicit: pageTimeout });

    let newHabitatUrl = await driver.findElement(wd.By.css('#habitatUse')).getAttribute("href");

    encounterId = newHabitatUrl.split('/')[4];
    habitatId = newHabitatUrl.split('/')[6];

  }, testTimeout)

  it('user edits encounter', async () => {

    await driver.findElement(wd.By.css('#encounterDataSheet')).click();

    await driver.manage().setTimeouts({ implicit: pageTimeout });

    let editEncouterUrl = await driver.getCurrentUrl();

    expect(editEncouterUrl).toContain("/edit");
  }, testTimeout)

  it('user ends encounter', async () => {

    await driver.findElement(wd.By.css('#species>option[value="Atlantic spotted dolphin"]')).click();

    await driver.findElement(wd.By.css('#saveEndEncounter')).click();

    await driver.wait(wd.until.elementLocated(wd.By.css('.css-iwuz5a-Encounters')), 10000);

    let homeUrl = await driver.getCurrentUrl();

    expect(homeUrl).toBe(`${process.env.ENDPOINT}/encounters`);
  }, testTimeout)

  it('checks database for new encounter', async () => {

    const docRefEncounter = doc(db, "encounter", encounterId);
    const docSnapEncounter = await getDoc(docRefEncounter);

    expect(docSnapEncounter.exists()).toBeTruthy()
  }, testTimeout)

  it('checks database for new habitat', async () => {

    const docRefHabitat = doc(db, "encounter", encounterId, "habitatUse", habitatId);
    const docSnapHabitat = await getDoc(docRefHabitat);

    expect(docSnapHabitat.exists()).toBeTruthy()
  }, testTimeout)

  it('deletes habitat and encounter from database', async () => {

    await deleteDoc(doc(db, "encounter", encounterId, "habitatUse", habitatId));
    await deleteDoc(doc(db, "encounter", encounterId));

    const docRefEncounter = doc(db, "encounter", encounterId);

    const deletedEncounter = await getDoc(docRefEncounter);

    expect(deletedEncounter.exists()).toBeFalsy()
  }, testTimeout)

  afterAll(async () => {
    await driver.quit();
  }, testTimeout)

})
