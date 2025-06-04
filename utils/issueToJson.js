// ### Mission Name
//
// mission-name -> 2
//
// ### Version
//
// version -> 6
//
// ### git URL
//
// git-URL -> 10
//
// ### Mission Archive URL
//
// archive-URL -> 14
//
// ### Agreement
//
// - [x] Agree to the terms

var fs = require("fs");

const user = process.argv[2];
const issueMdArr = process.argv[3].split("\n");

(function convertIssueToJson() {
  let missionName = issueMdArr[2];
  let missionVersion = issueMdArr[6];
  let missionGitUrl = issueMdArr[10];
  let missionArchiveUrl = issueMdArr[14];

  missionName.replace(/ /g, "-");

  fs.mkdir(`./contents/${user}/${missionName}`, { recursive: true }, (err) => {
    if (err) throw err;

    missionJson = {
      name: missionName,
      author: user,
      version: missionVersion,
      gitUrl: missionGitUrl,
      archiveUrl: missionArchiveUrl,
    };
    fs.writeFile(
      `./contents/${user}/${missionName}/${missionVersion}.json`,
      JSON.stringify(missionJson, null, 2),
      (err) => {
        if (err) throw err;
      }
    );
  });

  // create metadata file for PR create
  // create metadata file for PR create
  fs.writeFile(
    "result-path",
    `./contents/${user}/${missionName}/${missionVersion}.json`,
    (err) => {
      if (err) throw err;
      console.log("Metadata file created successfully.");
    }
  );
})();
