const {Builder, By, Key, until} = require('selenium-webdriver');
require('dotenv').config()

test('login', async() => {

    let driver = await new Builder().forBrowser('safari').build();
  
    try {

      await driver.get(process.env.ENDPOINT);
      await driver.manage().setTimeouts( { implicit: 10000 } );
      let email = driver.findElement(By.name('email'));
      await email.sendKeys(process.env.EMAIL);
      let password = driver.findElement(By.name('password'));
      await password.sendKeys(process.env.PASSWORD);
      await driver.findElement(By.css('button')).click();

      await driver.wait(until.elementLocated(By.css('.css-iwuz5a-Encounters')),10000);
      let homeUrl = await driver.getCurrentUrl();

      expect(homeUrl).toBe(`${process.env.ENDPOINT}/encounters`);

      await driver.findElement(By.css('#newEncounter')).click();

      await driver.wait(until.elementLocated(By.css('select')),10000);

      let newEncouterUrl = await driver.getCurrentUrl();
      expect(newEncouterUrl).toBe(`${process.env.ENDPOINT}/encounters/new`);

      let seqNum = await driver.findElement(By.name('sequenceNumber'));

      await seqNum.sendKeys("123");
      await driver.findElement(By.css('select>option[value="EA"]')).click();

      await driver.findElement(By.css('#newHabitat')).click();
      await driver.manage().setTimeouts( { implicit: 10000 } );
      let newHabitatUrl = await driver.getCurrentUrl();
      // await driver.wait(until.elementLocated(By.css('.css-ohzf39-HabitatUseForm')),10000);
      expect(newHabitatUrl).toContain("/habitat-uses/new");
    }
    finally {
      await driver.quit();
    }

},40000);
