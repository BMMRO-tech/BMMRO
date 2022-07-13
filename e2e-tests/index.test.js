import * as webdriver from 'selenium-webdriver';
import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, deleteDoc } from 'firebase/firestore/lite';
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";


let wd = webdriver.default;

const biopsyBannerFeatureToggle = (process.env.REACT_APP_BIOPSY_FORM_FEATURE_TOGGLE === "TRUE");

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

describe('create a new encounter user journey', () => {

  let driver;
  let encounterId;
  let habitatId;
  let biopsyId;
  let pageTimeout = 5000;
  let testTimeout = 20000;

  beforeAll(async () => {
    signInWithEmailAndPassword(auth, process.env.EMAIL, process.env.PASSWORD)
    .then(() => {
      console.log("firebase authentication success")
    })
    .catch((error) => {
      console.log("firebase authentication error: ", error)
    });
    driver = await startDriver();
  }, testTimeout)

  it('user successfully logs in', async () => {

    driver.manage().window().maximize();

    await driver.get(process.env.ENDPOINT);

    await driver.manage().setTimeouts({ implicit: pageTimeout });

    let email = driver.findElement(wd.By.name('email'));
    await email.sendKeys(process.env.EMAIL);
  
    let password = driver.findElement(wd.By.name('password'));
    await password.sendKeys(process.env.PASSWORD);

    await driver.findElement(wd.By.css('button')).click();

    await driver.wait(wd.until.elementLocated(wd.By.css('h1')), pageTimeout);
    let title = await driver.findElement(wd.By.css('h1')).getText();
    let expectedTitle = "ENCOUNTERS";
    expect(title).toBe(expectedTitle);

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

    let newEncounterUrl = await driver.getCurrentUrl();

    expect(newEncounterUrl).toContain(`/habitat-uses/new`);
  }, testTimeout)

  it('stores encounter ID', async () => {

    let newEncounterUrl = await driver.getCurrentUrl();

    encounterId = newEncounterUrl.split('/')[4];

  }, testTimeout)

  it('user fills out and end habitat', async () => {

    await driver.findElement(wd.By.css('#saveHabitat')).click();

    await driver.wait(wd.until.elementLocated(wd.By.css('#saveAnyway')), pageTimeout);

    await driver.findElement(wd.By.css('#saveAnyway')).click();

    await driver.manage().setTimeouts({ implicit: pageTimeout });

    let newHabitatUrl = await driver.getCurrentUrl();

    expect(newHabitatUrl).toBe(`${process.env.ENDPOINT}/encounters/${encounterId}/habitat-uses`);
  }, testTimeout)

  it('stores habitat ID', async () => {

    let newHabitatUrl = await driver.findElement(wd.By.css('#habitatUse')).getAttribute("href");

    habitatId = newHabitatUrl.split('/')[6];

  }, testTimeout)

  {biopsyBannerFeatureToggle &&
  it('user creates a new biopsy', async () => {
    
    await driver.findElement(wd.By.css('#newBiopsy')).click();

    let newBiopsyUrl = await driver.getCurrentUrl();
    
    expect(newBiopsyUrl).toContain(`/biopsies/new`);

    await driver.findElement(wd.By.css('select>option[value="Atlantic spotted dolphin"]')).click();

    await driver.wait(wd.until.elementLocated(wd.By.css('#saveBiopsy')), pageTimeout);

    await driver.findElement(wd.By.css('#saveBiopsy')).click();

    await driver.manage().setTimeouts({ implicit: pageTimeout });

    let newHabitatUrl = await driver.getCurrentUrl();

    expect(newHabitatUrl).toBe(`${process.env.ENDPOINT}/encounters/${encounterId}/habitat-uses`);

  }, testTimeout) 

  it('stores biopsy ID', async () => {

    let newBiopsyUrl = await driver.findElement(wd.By.css('#biopsy')).getAttribute("href");

    biopsyId = newBiopsyUrl.split('/')[6];

  }, testTimeout)
}

  it('user edits encounter', async () => {

    await driver.findElement(wd.By.css('#encounterDataSheet')).click();

    await driver.manage().setTimeouts({ implicit: pageTimeout });

    let editEncouterUrl = await driver.getCurrentUrl();

    expect(editEncouterUrl).toContain("/edit");
  }, testTimeout)

  it('user ends encounter', async () => {

    await driver.findElement(wd.By.css('#species>option[value="Atlantic spotted dolphin"]')).click();

    await driver.findElement(wd.By.css('#saveEndEncounter')).click();
    
    await driver.wait(wd.until.elementLocated(wd.By.css('h1')), pageTimeout);

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

  {biopsyBannerFeatureToggle && 
    it('checks database for new biopsy', async () => {
    
      const docRefHabitat = doc(db, "encounter", encounterId, "biopsy", biopsyId);
      const docSnapHabitat = await getDoc(docRefHabitat);
    
      expect(docSnapHabitat.exists()).toBeTruthy()
    }, testTimeout) 
  }


  it('deletes biopsy, habitat and encounter from database', async () => {

    if(biopsyBannerFeatureToggle && biopsyId){
      await deleteDoc(doc(db, "encounter", encounterId, "biopsy", biopsyId));
    }

    if(habitatId){
      await deleteDoc(doc(db, "encounter", encounterId, "habitatUse", habitatId));
    }

    if(encounterId){
      await deleteDoc(doc(db, "encounter", encounterId));
    }

    const docRefEncounter = doc(db, "encounter", encounterId);

    const deletedEncounter = await getDoc(docRefEncounter);

    expect(deletedEncounter.exists()).toBeFalsy()
  }, testTimeout)

  afterAll(async () => {
    await driver.quit();

    signOut(auth).then(() => {
      console.log("firebase sign out success")
    }).catch((error) => {
      console.log("firebase sign out error: ", error)
    });
  }, testTimeout)

})
