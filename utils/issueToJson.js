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

import fs from "fs/promises";

const user = process.argv[2];
const issueMdArr = process.argv[3].split("\n");

(async function convertIssueToJson() {
  let missionName = issueMdArr[2];
  let missionVersion = issueMdArr[6];
  let missionGitUrl = issueMdArr[10];
  let missionArchiveUrl = issueMdArr[14];

  let missionInfoUrl = new URL(missionGitUrl);
  missionInfoUrl.hostname = "api.github.com";
  let pathName = `repos${missionInfoUrl.pathname}/contents`;
  if (missionInfoUrl.searchParams.get("path")) {
    pathName += `/${missionInfoUrl.searchParams.get("path")}`;
  }
  pathName += "/mission.json";
  missionInfoUrl.pathname = pathName;

  let info = await fetch(missionInfoUrl)
    .then((res) => res.json())
    .then((data) => JSON.parse(atob(data.content)))
    .catch((err) => {
      throw err;
    });

  missionName.replace(/ /g, "-");

  await fs
    .mkdir(`./contents/${user}/${missionName}`, { recursive: true })
    .then(() => {
      let missionJson = {
        name: missionName,
        author: user,
        version: missionVersion,
        gitUrl: missionGitUrl,
        archiveUrl: missionArchiveUrl,
        info: info,
      };

      return fs.writeFile(
        `./contents/${user}/${missionName}/${missionVersion}.json`,
        JSON.stringify(missionJson, null, 2)
      );
    })
    .catch((err) => {
      console.error("Error:", err);
    });

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
