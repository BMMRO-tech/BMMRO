<img src="./logo_v2.png" width="100" style=" display: block;margin-left: auto;margin-right: auto;" alt="BMMRO logo">

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-12-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

# Bahamas Marine Mammal Research Organization (BMMRO)

## Overview

Bahamas Marine Mammal Research Organization (BMMRO) is not just a mouthfull, but is also a non-profit scientific research organisation run by world renowned scientists finding marine mammals in and around Abaco Island, Bahamas, understanding their primary areas of habitation and using what they learn to make a difference. This page is here because we believe technology can help them better than it currently is. Join us.

## About them

- Website: http://www.bahamaswhales.org/home.aspx
- Our Story: https://www.youtube.com/watch?v=D6KgNQpWynY
- Facebook: www.facebook.com/BMMRO
- Instagram: [@BMMRO](https://www.instagram.com/bmmro/)
- Twitter: [@BMMRO](https://twitter.com/BMMRO)
- [Publications](https://bit.ly/35cssEW)

## About us

We are passionate about technology. We understand that the system that protects us, doesnt protect all. We are a subsystem within a system that reaches out to correct the problems caused by the system, which we are part of. Its complicated.

## Mission

- Amplify BMMRO's positive impact by applying our technical skills

## Philosophy

- Thin vertical slices of work
- Automated all the things, if it builds we ship it
- Pave the way for new contribution with beautiful code and documentation

## Onboarding Pathway

- [Intro Video](https://drive.google.com/drive/u/1/folders/19epArmIPsgr5Tb2omchZ1ttjHHbw5AQo)
- [Our Story](https://www.youtube.com/watch?v=D6KgNQpWynY)
- [Current “As Is” infographic](As%20Is%20InfoGraphic.png)
- [Habitiat Use Data Sheet, example of the most frequently used form on boat excurtions](HabitatUseDataSheet.JPG)
- [Encounter Sighting Data Sheet](EncounterSightingDataSheet.JPG)
- [Kanban board](https://github.com/BMMRO-tech/BMMRO/projects/1)
- [Contributing guidelines](https://github.com/BMMRO-tech/BMMRO/blob/master/CONTRIBUTING.md)
- [Google drive](https://drive.google.com/drive/folders/158V1HhQiZe8HlKXTzOMhXw2lyf51NNlc?usp=sharing)
- [System Diagram](https://drive.google.com/file/d/1c9fiaSNFbRRh9hRaMdJCQphT4Tn4NWJk/view?usp=sharing)
- [Release Process Diagram](https://drive.google.com/file/d/1sW1jIa8dd5GhMacBuVxv30MQUpsB1-SO/view)

## Milestones

### Stage 1 ✅

#### APP FUNCTIONALITY

- Basic Encounter form structure (key fields) with create full Habitat use form and view list of created Habitat use for for an encounter
- Export Encounter and Habitat use forms
- Individual user accounts

#### PRODUCTION READINESS / CFRs

- User and DB authentication
- Back-up strategy (Export to csv)
- Production and test environments

### Stage 2 ✅

#### APP FUNCTIONALITY

- View list of habitat forms within an encounter 
- Edit habitat use forms (prior to export) 
- Edit encounter forms (prior to export) 
- View habitat use forms (post export) 
- View encounter forms (post export) 
- Mark exported records as non-editable 
- Add version numbers to app 
- Create trips and corresponding logbook entries
- Edit trips and logbook entries (prior to export)
- End trips so that they contain all data for export
- View trips and logbook entries (post export)
- Export logbook entries
- Edit projects dropdown in Firebase


### Stage 3 🔄

#### APP IMPROVEMENT

- Improve usability for the webapp
- Post-user testing changes to form fields
- User friendly exporting
- Upgrade react-script from v3.4 to v5.0 (or even better: replace it with another dependency that still gets updates)
- Add more tests (e2e-tests: delete trips and logbook entries at the end, extend firestore.test.js with trip/ logbook data, add more tests for logbook entries)
- Update dependencies in general (there used to be pull requests made by dependabot)
- Create the effort form
- Delete records from the app
- Allow BMMRO to self-manage lists and dropdowns (just like projects dropdown in Firebase, the rest can only be [edited via PR](https://docs.google.com/document/d/1zFzHcWEdO8jby3W6a9eV5IuKUfDRd62f9-HU9lqdm5Q/edit?tab=t.0#heading=h.3ebuohi1b084))

#### POSSIBLE BUGS TO CHECK

- GPS is not working properly
- cloud symbol might not show the current status when syncing trips
- are tests flakey in the pipeline even though they work locally?

## Future ideas

- 🚦**Data Migration Tool**
  This will provide a tool to migrate data from their current MS Access database to the new data store. It should be idempotent to allow for multiple migrations without data corruption or duplication and thus allowing old and new world to co-exist
- 🚦**Media Link**
  Research, incept and build on the existing system to allow their extensive collection of media (images, video, audio) data can be linked, in a meaningful way, to an encounter. Look for opportunities to improve the gathering of this data along the way. Evolving into managing these forms (edit & view) within the webapp.
- 🚦**TBC**
  Potential future work could be further app improvements, more accessible or sophisticated data analysis, website improvements, integrating data into their website.

# Repository maintenance

**Maintenance level:** highly supported

This project has dedicated maintainers to keep this project running smoothly. We will do our best to review and merge PRs quickly, and respond to issues within 5 days, barring unforeseen circumstances.

**Maintainers:**

- [James Brown](https://github.com/JBJamesBrownJB)
- [Oktawia Kata](https://github.com/aiwatko)

# Inspiration

- https://www.flukebook.org/
- https://patternradio.withgoogle.com/

## Primary Contacts:

- James Brown, Technical Lead (TW): @JBJamesBrownJB | jameskinnahbrown@gmail.com
- Charlotte Dunn, PhD (BMMRO): cdunn@bahamaswhales.org
- Thomas Brown, client Product Owner (BMMRO): motnworb@hotmail.com
- Oktawia Kata, Technical Lead (TW): @aiwatko
- Team: bahamas-marine-mammal-research-organization@thoughtworks.com

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://www.bogwell.co.uk"><img src="https://avatars0.githubusercontent.com/u/1058300?v=4" width="100px;" alt=""/><br /><sub><b>James Brown</b></sub></a><br /><a href="https://github.com/BMMRO-tech/BMMRO/commits?author=JBJamesBrownJB" title="Code">💻</a> <a href="#projectManagement-JBJamesBrownJB" title="Project Management">📆</a></td>
    <td align="center"><a href="https://github.com/gazeddyw"><img src="https://avatars3.githubusercontent.com/u/6126744?v=4" width="100px;" alt=""/><br /><sub><b>Gareth Williams</b></sub></a><br /><a href="https://github.com/BMMRO-tech/BMMRO/commits?author=gazeddyw" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/dsobkow"><img src="https://avatars1.githubusercontent.com/u/38005641?v=4" width="100px;" alt=""/><br /><sub><b>Dorota Sobkow</b></sub></a><br /><a href="https://github.com/BMMRO-tech/BMMRO/commits?author=dsobkow" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/jfgreen"><img src="https://avatars0.githubusercontent.com/u/1288679?v=4" width="100px;" alt=""/><br /><sub><b>James Green</b></sub></a><br /><a href="https://github.com/BMMRO-tech/BMMRO/commits?author=jfgreen" title="Code">💻</a> <a href="#infra-jfgreen" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="http://oktawiakata.com"><img src="https://avatars0.githubusercontent.com/u/18549395?v=4" width="100px;" alt=""/><br /><sub><b>Oktawia Kata</b></sub></a><br /><a href="https://github.com/BMMRO-tech/BMMRO/commits?author=aiwatko" title="Code">💻</a> <a href="#projectManagement-aiwatko" title="Project Management">📆</a></td>
    <td align="center"><a href="https://github.com/peersmg"><img src="https://avatars3.githubusercontent.com/u/10050347?v=4" width="100px;" alt=""/><br /><sub><b>Matthew Peers</b></sub></a><br /><a href="https://github.com/BMMRO-tech/BMMRO/commits?author=peersmg" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/sivsubra-tw"><img src="https://avatars3.githubusercontent.com/u/55848659?v=4" width="100px;" alt=""/><br /><sub><b>Siva Subramanian</b></sub></a><br /><a href="https://github.com/BMMRO-tech/BMMRO/commits?author=sivsubra-tw" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/flaviarodriguesf"><img src="https://avatars1.githubusercontent.com/u/9823979?v=4" width="100px;" alt=""/><br /><sub><b>Flávia Falé</b></sub></a><br /><a href="https://github.com/BMMRO-tech/BMMRO/commits?author=flaviarodriguesf" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/rahul-rakshit"><img src="https://avatars1.githubusercontent.com/u/36737963?v=4" width="100px;" alt=""/><br /><sub><b>Rahul Rakshit</b></sub></a><br /><a href="https://github.com/BMMRO-tech/BMMRO/commits?author=rahul-rakshit" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/lroyTW"><img src="https://avatars2.githubusercontent.com/u/4237356?v=4" width="100px;" alt=""/><br /><sub><b>lroyTW</b></sub></a><br /><a href="#business-lroyTW" title="Business development">💼</a></td>
    <td align="center"><a href="https://github.com/jhughes-tw"><img src="https://avatars3.githubusercontent.com/u/28755518?v=4" width="100px;" alt=""/><br /><sub><b>jhughes-tw</b></sub></a><br /><a href="#design-jhughes-tw" title="Design">🎨</a></td>
    <td align="center"><a href="http://helenzhou.co.uk"><img src="https://avatars1.githubusercontent.com/u/25727036?v=4" width="100px;" alt=""/><br /><sub><b>Helen Zhou</b></sub></a><br /><a href="https://github.com/BMMRO-tech/BMMRO/commits?author=helenzhou6" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/nenyiTW"><img src="https://avatars.githubusercontent.com/u/60198996?v=4" width="100px;" alt=""/><br /><sub><b>Nenyi Arkaah</b></sub></a><br /><a href="https://github.com/BMMRO-tech/BMMRO/commits?author=nenyiTW" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/mayawrightthoughtworks"><img src="https://avatars.githubusercontent.com/u/100127177?v=4" width="100px;" alt=""/><br /><sub><b>Maya Wright</b></sub></a><br /><a href="https://github.com/BMMRO-tech/BMMRO/commits?author=mayawrightthoughtworks" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/acavbmmro"><img src="https://avatars.githubusercontent.com/u/100130427?v=4" width="100px;" alt=""/><br /><sub><b>Annie Cavalla</b></sub></a><br /><a href="https://github.com/BMMRO-tech/BMMRO/commits?author=acavalla" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Strawb99"><img src="https://avatars.githubusercontent.com/u/96117207?v=4" width="100px;" alt=""/><br /><sub><b>Sophie Strawbridge</b></sub></a><br /><a href="https://github.com/BMMRO-tech/BMMRO/commits?author=Strawb99" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/romanecastera"><img src="https://avatars.githubusercontent.com/u/100352571?v=4" width="100px;" alt=""/><br /><sub><b>Romane Castera</b></sub></a><br /><a href="https://github.com/BMMRO-tech/BMMRO/commits?author=romanecastera" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/josh-simpson-TW"><img src="https://avatars.githubusercontent.com/u/100127157?s=400&u=781b8a2304b960140267ac4d21836826ad85452a&v=4" width="100px;" alt=""/><br /><sub><b>Josh Simpson</b></sub></a><br /><a href="https://github.com/BMMRO-tech/BMMRO/commits?author=josh-simpson-TW" title="Business Development">💼</a></td>
     <td align="center"><a href="https://github.com/JamesGoodThoughtworks"><img src="https://avatars.githubusercontent.com/u/101573096?s=400&v=4" width="100px;" alt=""/><br /><sub><b>James Goodman</b></sub></a><br /><a href="https://github.com/BMMRO-tech/BMMRO/commits?author=JamesGoodThoughtworks" title="Code">💻</a></td>
     <td align="center"><a href="https://github.com/njktw"><img src="https://avatars.githubusercontent.com/u/100933291?v=4" width="100px;" alt=""/><br /><sub><b>Nick Kelly</b></sub></a><br /><a href="#" title="Business development">💼</a</td>
     <td align="center"><a href="https://github.com/ksidhuTWs"><img src="https://avatars.githubusercontent.com/u/107918764?v=4" width="100px;" alt=""/><br /><sub><b>Karan Sidhu</b></sub></a><br /><a href="https://github.com/BMMRO-tech/BMMRO/commits?author=ksidhuTWs" title="Code">💻</a></td>
  </tr>
  <tr>
   <td align="center"><a href="https://github.com/zeingowie"><img src="https://avatars.githubusercontent.com/u/82781176?v=4" width="100px;" alt=""/><br /><sub><b>Zein Gowie</b></sub></a><br /><a href="https://github.com/BMMRO-tech/BMMRO/commits?author=zeingowie" title="Code">💻</a></td>
     <td align="center"><a href="https://github.com/FallRi"><img src="https://avatars.githubusercontent.com/u/104824292?v=4" width="100px;" alt=""/><br /><sub><b>Fallon RiShiva</b></sub></a><br /><a href="https://github.com/BMMRO-tech/BMMRO/commits?author=FallRi" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!!!
