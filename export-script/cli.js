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
      "-a, --all",
      "export all entries, even those that have previously been exported",
      false
    )
    .action(action);

  await program.parseAsync(process.argv);
};

module.exports = run;
