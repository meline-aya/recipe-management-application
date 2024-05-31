const host = '0.0.0.0';
const port = 3000;

const list_recipes = document.getElementById('recipes');
const cr = document.getElementById('create');
const up = document.getElementById('update');

const na = document.getElementById('name');
const de = document.getElementById('description');
const ingr = document.getElementById('ingredients');
const inst = document.getElementById('instructions');

let id_glob = -1;

/*
** Fetch all recipes and display them.
*/
async function displayRecipes() {
    const response = await fetch(`http://${host}:${port}/api/recipes`, {
      method: "GET",
    });
    let resp = await response.json();
    list_recipes.innerHTML = '';

    for (let recipe of resp)
    {
      createItem(recipe);
    }
}

/*
** Create an item with the recipe to add to the list of recipes.
** Also create a delete button and an update button.
*/
function createItem(recipe) {
  let item = document.createElement('li');
  let text = document.createElement('span');
  
  let recip = '\n' + recipe['name'] + '\nDescription: ' + recipe['description'] 
    + '\nIngredients: ' + recipe['ingredients'] + '\nInstructions: ' 
    + recipe['instructions'] + '\nCreated at: ' + recipe['createdAt'] 
    + '\nUpdated at: ' + recipe['updatedAt'] + '\n';
  
  text.innerText = recip;
  item.appendChild(text);

  let del = document.createElement('button');
  del.textContent = 'Delete';
  del.classList.add('delete')
  item.appendChild(del);
  
  let update = document.createElement('button');
  update.textContent = 'Update';
  update.classList.add('update')
  item.appendChild(update);
  
  list_recipes.appendChild(item);

  let id = recipe['id'];
  del.addEventListener('click', () => deleteRecipe(id, del));
  update.addEventListener('click', () => updateRecipe(id, update));
}


/*
** First part to update a recipe when update button of recipe clicked.
** Send a request to retrieve the recipe.
** Then put the recipe to the form.
*/
async function updateRecipe(id, update){

  cr.style.display = 'none';
  up.style.display = 'block';

  const response = await fetch(`http://${host}:${port}/api/recipes/${id}`, {
    method: "GET",
  });

  let resp = await response.json();

  na.innerHTML = resp.name;
  de.innerHTML = resp.description;
  inst.innerHTML = resp.instructions;
  ingr.innerHTML = resp.instructions;

  id_glob = id;
}

/*
** Second part to update a recipe, when update recipe button of form clicked.
** Retrieve the info of the form.
** Send a request to update the info of the recipe.
** Display all the recipes.
*/
async function updateRecipe2(){
  const response1 = await fetch(`http://${host}:${port}/api/recipes/${id_glob}`, {
    method: "GET",
  });

  let resp = await response1.json();
  
  const formData = new FormData(form);
  const formObject = Object.fromEntries(formData);
  
  let object = {};
  formData.forEach(function(value, key){
    object[key] = value;
  });
  const timestamp = Date(Date.now());
  let time = timestamp.toString();
  object['createdAt'] = resp['createdAt'];
  object['updatedAt'] = time;
     
  let json = JSON.stringify(object);

  const response = await fetch(`http://${host}:${port}/api/recipes/${id_glob}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: json,
  });

  let re = await response.json();

  cr.style.display = 'block';
  up.style.display = 'none';

  displayRecipes();
}

/*
** Delete the recipe with a request and then dislay the others recipes.
*/
async function deleteRecipe(id, del){
  del.parentNode.remove();
  const response = await fetch(`http://${host}:${port}/api/recipes/${id}`, {
    method: "DELETE",
  });
        
  displayRecipes();
}

/*
** Retrieve the data send by the user from the form.
** Send a request to add the recipe.
** Display all the recipes.
*/
async function createRecipe() {
    
  const formData = new FormData(form);
  const formObject = Object.fromEntries(formData);
  
  let object = {};
  formData.forEach(function(value, key){
    object[key] = value;
  });

  if (object.name === '' || object.description === '' || object.ingredients === '' || object.instructions === '')
    return;
  
  const timestamp = Date(Date.now());
  let time = timestamp.toString();
  object['createdAt'] = time;
  object['updatedAt'] = time;
     
  let json = JSON.stringify(object);
                
  const response = await fetch(`http://${host}:${port}/api/recipes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: json,
  });
        
  displayRecipes();
}

/*
** Initial fetch to display recipes.
*/
displayRecipes();

