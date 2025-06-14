import fs from "fs/promises";

let repositoryInfo = process.argv[2].split("/");

let missions = {};
await fs.readFile("sourceName").then((sourceName) => {
  missions["name"] = `${sourceName.toString()}@${repositoryInfo[0]}`;
});

missions["missions"] = [];

await fs
  .readdir("./contents")
  .then((files) => {
    let p = files
      .filter((file) => !file.includes(".json"))
      .map((file) =>
        fs.readdir(`./contents/${file}`).then((subFiles) => {
          subFiles.forEach((subFile) => {
            missions["missions"].push({
              name: subFile,
              author: file,
              detail_url: `https://${repositoryInfo[0].toLowerCase()}.github.io/${repositoryInfo[1]}/contents/${file}/${subFile}/mission.json`,
            });

            console.log(
              `Added mission: ${subFile} by ${file} to missions.json`
            );
          });
        })
      );
    return Promise.all(p);
  })
  .catch((err) => {
    console.error("Error reading contents directory:", err);
  });

fs.writeFile("./contents/missions.json", JSON.stringify(missions, null, 2))
  .then(() => console.log(missions))
  .catch((err) => {
    console.error("Error reading contents directory:", err);
  });
