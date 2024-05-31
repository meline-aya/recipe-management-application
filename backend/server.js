const http = require('http');
const cors = require('cors');
const express = require('express');

const host = 'localhost';
const port = 3000;
const filename = 'recipes_file.json';

const {
  readRecipesFromJSONFile, 
  writeRecipesToJSONFile
} = require("./utils.js");

// List of all recipes.
let recipes = readRecipesFromJSONFile(filename);
  
function RecipeServer(){
  const app = express();  
  app.use(cors());
  app.options('*', cors());

  app.use(express.json());

  // Id of previous recipe.
  let id = -1;
  let len = recipes.length;
  if (len !== 0)
  {
    for (let i = 0; i < len; i++)
    {
      if (Number(recipes[i]["id"]) > id)
      {
         id = Number(recipes[i]["id"]);
      }
    }
  }

  // -------------------------------------------------------------------------
  /*
  ** REQUESTS
  */
  
  // GET request: get all recipes.
  app.get('/api/recipes', (req, res) => {
    res.send(recipes);
    res.status(200);
  });  
  
  // POST request: create a new recipe.
  app.post('/api/recipes', (req, res) => {
    let recipe = req.body;
    id++;
    len++;
    recipe["id"] = id;
    recipes.push(recipe);
    writeRecipesToJSONFile(filename, recipes);
    res.status(201).send(recipe);
  });
  
  // GET request: retrieve a specific recipe by id.
  app.get('/api/recipes/:id', (req, res) => {
    let id_r = req.params["id"];
   
    let found = false;
    let recipe = null;

    let i = 0
    while (i < len && !found)
    {
      if (Number(recipes[i]["id"]) === Number(id_r))
      {
        found = true;
        recipe = recipes[i];
      }
      i++;
    }
    
    if (!found)
      res.status(404).send({ message : `No recipe with id: ${id_r} found`});
    
    else
      res.status(200).send(recipe);
  });

  // PUT request: update a specific recipe by id.
  app.put('/api/recipes/:id', (req, res) => {
    let id_r = req.params["id"];
    
    let found = false;
    let index = -1;

    let j = 0;
    while (j < len && !found)
    {
      if (recipes[j]["id"] === id_r)
      {
        found = true;
        index = j;
      }
      j++;
    }
    
    if (!found)
      res.status(404).send({ message : `No recipe with id: ${id_r} found`});
    
    else 
    {
      // replace the old recipe by the new one.
      recipes[index] = req.body; 
      // add the old id to the new recipe.
      recipes[index]["id"] = Number(id_r); 
      
      writeRecipesToJSONFile(filename, recipes);
      
      let recipe = recipes[index];
      res.status(201).send(recipe);
    }
  });
  
  
  // DELETE request: delete a specific recipe by id.
  app.delete('/api/recipes/:id', (req, res) => {
    let id_r = req.params["id"];
    console.log('aaaaa');
    let found = false;
    let index = -1;

    let k = 0;
    while (k < len && !found)
    {
      if (recipes[k]["id"] == id_r)
      {
        found = true;
        index = k;
      }
      k++;
    }
    
    
    if (!found)
      res.status(404).send({ message : `No recipe with id: ${id_r} found`});
    
    else
    {
      // retrieve recipe with index.
      let recipe = recipes[index]; 
      // delete the recipe from the list of recipes.    
      recipes.splice(index, 1);
      len--;

      // update the max id.
      let max = -1;
      for (let m = 0; m < len; m++)
      {
        if (Number(recipes[m]["id"]) > max)
        {
          max = Number(recipes[m]["id"]);
        }
      }
      id = max;
     
      writeRecipesToJSONFile(filename, recipes);
      res.status(200).send(recipe);
     }
   });
  
  // If it is another request.
  app.get('*', (req, res) => {
    res.status(404).send({ message : 'Not found'});
  });  
  
  // ---------------------------------------------------------------------
  
  app.listen(port, () => {
    console.log(`Server running at http://${host}:${port}/`);
  });
  
  return app;
}

RecipeServer();
