```puml
stdinStdout -> main: args
main -> configCheck: config
configCheck -> main: ok / not ok
main -> validateDates: dates
validateDates -> main: ok / not ok
main -> exportDataToCsv: config, dates
exportDataToCsv -> initializeApp: config
exportDataToCsv -> auth: email, password
auth -> exportDataToCsv: ok / not ok
exportDataToCsv -> queryDataByTimeInterval: start, end, etc.
queryDataByTimeInterval -> exportDataToCsv: data / error
queryDataByTimeInterval -> transformDataToCsvFormat: json data
transformDataToCsvFormat -> queryDataByTimeInterval: csv data
exportDataToCsv -> writeDataToFile: csv Data
writeDataToFile -> FS: csv Data
exportDataToCsv -> main: ok / not ok
main -> stdinStdout: ok

```
