const host = '0.0.0.0';
const port = 3000;

const list_recipes = document.getElementById('recipes');

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
  
  list_recipes.appendChild(item);

  let id = recipe['id'];
  // del.onclick = deleteRecipe(id, del);
  // del.addEventListener('click', deleteRecipe(id, del));
}

async function deleteRecipe(id, del){
  del.parentNode.remove();

  console.log(id);
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

