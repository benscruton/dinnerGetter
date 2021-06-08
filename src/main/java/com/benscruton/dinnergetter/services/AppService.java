package com.benscruton.dinnergetter.services;

import java.util.ArrayList;
import java.util.List;

import com.benscruton.dinnergetter.models.Ingredient;
import com.benscruton.dinnergetter.models.Recipe;
import com.benscruton.dinnergetter.models.SubList;
import com.benscruton.dinnergetter.models.User;
import com.benscruton.dinnergetter.repositories.IngredientRepository;
import com.benscruton.dinnergetter.repositories.RecipeRepository;
import com.benscruton.dinnergetter.repositories.SubListRepository;
import com.benscruton.dinnergetter.repositories.UserRepository;

import org.springframework.stereotype.Service;

@Service
public class AppService {
    private final UserRepository uRepo;
    private final IngredientRepository iRepo;
    private final RecipeRepository rRepo;
    private final SubListRepository sRepo;

    public AppService(UserRepository ur, IngredientRepository ir, RecipeRepository rr, SubListRepository sr){
        this.uRepo = ur;
        this.iRepo = ir;
        this.rRepo = rr;
        this.sRepo = sr;
    }

    //======================================================================
	// RECIPE STUFF
	//======================================================================
    

    //======================================================================
    // creaet a recipe
    //======================================================================
    public Recipe createRecipe(Recipe r){
        return this.rRepo.save(r);
    }

    //======================================================================
    // get all recipes
    //======================================================================
    public List<Recipe> findAllRecipes(){
        return this.rRepo.findAll();
    }

    //======================================================================
    // find recipe by id
    //======================================================================
    public Recipe findRecipeById(Long id){
        return this.rRepo.findById(id).orElse(null);
    }

    //======================================================================
    // find a recipe by name
    //======================================================================
    public List<Recipe> findRecipeByName(String name){
        return this.rRepo.findByNameContaining(name);
    }


    //$$$$$$$$$$$$$$$$$$$$$$
	// INGREDIENT STUFF
	//$$$$$$$$$$$$$$$$$$$$$$
    
    //======================================================================
    // find an ingredient by id
    //======================================================================
    public Ingredient createIngredient(Ingredient ingredient){
        Ingredient i = (Ingredient) this.findIngredientByName(ingredient.getName());
        if(i != null){
            return i;
        }
        return this.iRepo.save(ingredient);

    }
    //======================================================================
    // find an ingredient by id
    //======================================================================
    public List<Ingredient> findAllIngredients(){
        return this.iRepo.findAll();
    }
    //======================================================================
    // find an ingredient by id
    //======================================================================
    public Ingredient findIngredientByName(String name){
        return this.iRepo.findIngredientByName(name).orElse(null);
    }

    
    //======================================================================
    // find an ingredient by id
    //======================================================================
    public Ingredient findIngredientById(Long id) {
        return this.iRepo.findById(id).orElse(null);
    }
    
    
    
    //$$$$$$$$$$$$$$$$$$$$$$$$$$
	// USER STUFF  
	//$$$$$$$$$$$$$$$$$$$$$$$$$$

    //==================================================
    // find all users
    //==================================================
    public List<User> findAllUsers(){
        return this.uRepo.findAll();
    }

    //==================================================
    // find a user by email address
    //==================================================
    public User findUserByEmail(String email){
        return (User) this.uRepo.findUserByEmail(email).orElse(null);
    }
    
    //==================================================
    // find a user by id
    //==================================================
    public User findUserById(Long id){
        return this.uRepo.findById(id).orElse(null);
    }

    //==================================================
    // creates a user
    //==================================================
    public User createUser(User u){
        return this.uRepo.save(u);
    }



    //$$$$$$$$$$$$$$$$$$$$$$$$$$
	// SUBLIST STUFF  
	//$$$$$$$$$$$$$$$$$$$$$$$$$$
    public SubList createSubList(String uEmail, SubList sl){
        User u = this.findUserByEmail(uEmail);
        sl.setOwner(u);
        List<Ingredient> ingredients = new ArrayList<Ingredient>();
        sl.setIngredients(ingredients);
        return this.sRepo.save(sl);
    }
    public SubList findSubListById(Long sId){
        return this.sRepo.findById(sId).orElse(null);
    }

    public void deleteSubList(Long sId){
        this.sRepo.deleteById(sId);
    }

    public void updateSubListName(String[] idAndName){
        SubList sl = this.findSubListById(Long.parseLong(idAndName[0]));
        sl.setCategory(idAndName[1]);
        this.sRepo.save(sl);
    }


    //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	// RELATIONSHIP STUFF  
	//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    //==================================================
    // add ingredent to a recipe
    //==================================================
    public Recipe addIngredientToRecipe(Long rId, Long iId){
        Recipe r = this.findRecipeById(rId);
        Ingredient i = this.findIngredientById(iId); 
        if(r != null) {
            r.getIngredients().add(i);
        }
        return this.rRepo.save(r);
    }

    //==================================================
    // add an ingredient to a users pantry
    //==================================================
    public boolean addIngredientToPantry(User u, Ingredient i){
        if(!u.getPantry().contains(i)){
            u.getPantry().add(i);
            this.uRepo.save(u);
            return true;
        }
        return false;
    }

    //==================================================
    // remove an ingredient from a users pantry
    //==================================================
    public void removeIngredientFromPantry(User u, Ingredient i){
        u.getPantry().remove(i);
        this.uRepo.save(u);
    }

    //==================================================
    // add ingredient to a users shopping list
    //==================================================
    // public boolean addIngredientToShoppingList(User u, Ingredient i){
    //     if(!u.getShoppingList().contains(i)){
    //         u.getShoppingList().add(i);
    //         this.uRepo.save(u);
    //         return true;
    //     }
    //     return false;
    // }

    //==================================================
    // adds an author to a recipe thats added to the database
    //==================================================
    public void addAuthorToRecipe(String email, Long rId){
        User u = this.findUserByEmail(email);
        Recipe r = this.findRecipeById(rId);
        r.setAuthor(u);
        this.rRepo.save(r);
    }

    //==================================================
    // saves a recipeto the users saved recipes
    //==================================================
    public void mySavedRecipe(String email, Long rId){
        User u = this.findUserByEmail(email);
        Recipe r = this.findRecipeById(rId);
        u.getSavedRecipes().add(r);
        this.uRepo.save(u);
    }

    //==================================================
    // removes an ingredient from a users shopping list
    //==================================================
    // public int removeIngredientFromShoppingList(User u, Ingredient i){
    //     if(!u.getShoppingList().contains(i)){
    //         return -1;
    //     }
    //     int idx = u.getShoppingList().indexOf(i);
    //     u.getShoppingList().remove(i);
    //     this.uRepo.save(u);
    //     return idx;
    // }

    //==================================================
    // update the order of user's list in database
    //==================================================
    public void saveListOrder(String uEmail, String[][] sublists){
        // User u = this.findUserByEmail(uEmail);
        // List<Ingredient> ordered = new ArrayList<Ingredient>();
        // for(String i : ingredients){
        //     Ingredient nextIngredient = this.findIngredientByName(i);
        //     ordered.add(nextIngredient);
        // }
        // u.setShoppingList(ordered);
        // this.uRepo.save(u);


        // User u = this.findUserByEmail(uEmail);
        for(String[] array : sublists){
            Long sId = Long.parseLong(array[0]);
            SubList sl = this.findSubListById(sId);

            List<Ingredient> ingredients = new ArrayList<Ingredient>();
            for(int i=1; i<array.length; i++){
                Ingredient ing = this.findIngredientByName(array[i]);
                ingredients.add(ing);
            }

            sl.setIngredients(ingredients);
            this.sRepo.save(sl);
        }
    }

    //==================================================
    // Add ingredient to sublist
    //==================================================
    public boolean addIngredientToSubList(Long sId, Ingredient ingredient){
        Ingredient i = this.createIngredient(ingredient);
        SubList sl = this.findSubListById(sId);
        boolean alreadyInList = this.checkListForIngredient(sl.getOwner().getId(), i);
        if(!alreadyInList){
            sl.getIngredients().add(i);
            this.sRepo.save(sl);
        }
        return !alreadyInList;

    }
    public boolean checkListForIngredient(Long uId, Ingredient i){
        User u = this.findUserById(uId);
        for(SubList sl : u.getCategorizedShoppingList()){
            if(sl.getIngredients().contains(i)) return true;
        }
        return false;
    }


    //==================================================
    // Remove ingredient from sublist
    //==================================================
    public int[] removeIngredientFromList(Long sId, String iName){
        int[] notFound = new int[]{-1, -1};
        SubList sl = this.findSubListById(sId);
        if(sl == null){
            return notFound;
        }
        
        Ingredient i = this.findIngredientByName(iName);
        User u = sl.getOwner();

        int[] output = new int[2];
        output[0] = u.getCategorizedShoppingList().indexOf(sl);
        if(output[0] == -1){
            return notFound;
        }
        output[1] = sl.getIngredients().indexOf(i);

        sl.getIngredients().remove(i);
        this.sRepo.save(sl);

        return output;
    }

}
