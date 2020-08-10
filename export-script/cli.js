const { program } = require("commander");

const run = async (action) => {
  program
    .name("bmmro-export")
    .version("0.1.0")
    .description(
      "🐳 Export data from the cloud firestore for MS Access imports. 🐬"
    )
    .usage("<startDate> <endDate> [options]")
    .passCommandToAction(false)
    .arguments("<startDate> <endDate>")
    .option(
      "--unexported-only",
      "export only entries that haven't previously been exported",
      true
    )
    .option(
      "--no-unexported-only",
      "export all entries, regardless of whether they've been previously exported"
    )
    .action(action);

  await program.parseAsync(process.argv);
};

module.exports = run;
