const fs = require("fs");

function readRecipesFromJSONFile(JSON_filename) {
  /*
   ** Return the list of recipes stored in the JSON file.
   ** JSON_filename: path to the JSON file.
   */
  const content = fs.readFileSync(JSON_filename, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  return JSON.parse(content).recipes;
}

function writeRecipesToJSONFile(JSON_filename, recipes) {
  /*
   ** Overwrite the given JSON_filename with the given
   ** list of recipes.
   ** JSON_filename: path to the JSON file.
   ** recipes : list of recipes objects.
   */
  const recipesJSON = JSON.stringify({ recipes: recipes });
  fs.writeFileSync(JSON_filename, recipesJSON, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}

module.exports = {
  readRecipesFromJSONFile,
  writeRecipesToJSONFile
}
