const host = '0.0.0.0';
const port = 3000;

const list_recipes = document.getElementById('recipes');
const cr = document.getElementById('create');
const up = document.getElementById('update');

const na = document.getElementById('name');
const de = document.getElementById('description');
const ingr = document.getElementById('ingredients');
const inst = document.getElementById('instructions');

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
  
  // let update = document.createElement('button');
  // update.texttContent = 'Update';
  // update.classList.add('update')
  // item.appendChild(update);
  
  list_recipes.appendChild(item);

  let id = recipe['id'];
  del.addEventListener('click', () => deleteRecipe(id, del));
  // update.addEventListener('click', () => updateRecipe(id, update));
}

// async function updateRecipe(id, update){
//   cr.hidden = false;
//   up.hidden = true;

//   const response1 = await fetch(`http://${host}:${port}/api/recipes/${id}`, {
//     method: "GET",
//   });

//   let resp = response1.json();

//   na.innerHTML = resp.name;
//   de.innerHTML = resp.description;
//   ins.innerHTML = resp.instructions;
//   ing.innerHTML = resp.instructions;
  
//   let data = ;
//   const response2 = await fetch(`http://${host}:${port}/api/recipes/${id}`, {
//     method: "PUT",
//     body: data;
//   });
        
//   displayRecipes();
// }

async function deleteRecipe(id, del){
  del.parentNode.remove();
  const response = await fetch(`http://${host}:${port}/api/recipes/${id}`, {
    method: "DELETE",
  });
        
  displayRecipes();
}


/*
** Wait for user to create recipe, then send it to the server
** and then reload the list of recipes displayed.
*/
document.addEventListener('DOMContentLoaded', (event) => {
    const form = document.getElementById('form');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const formObject = Object.fromEntries(formData);

        let object = {};
        formData.forEach(function(value, key){
          object[key] = value;
        });

        const timestamp = Date(Date.now());
        let time = timestamp.toString();
        object['createdAt'] = time;
        object['updatedAt'] = time;
      
        let json = JSON.stringify(object);
        
        console.log(json);
        
        const response = await fetch(`http://${host}:${port}/api/recipes`, {
           method: "POST",
           headers: {
              "Content-Type": "application/json",
            },
           body: json,
        });
        
        displayRecipes();
    });
});

/*
** Initial fetch to display recipes.
*/
displayRecipes();

