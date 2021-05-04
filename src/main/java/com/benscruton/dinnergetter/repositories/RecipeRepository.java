package com.benscruton.dinnergetter.repositories;

import java.util.List;

import com.benscruton.dinnergetter.models.Recipe;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RecipeRepository extends CrudRepository<Recipe, Long> {

    List<Recipe> findAll();
    List<Recipe> findByNameContaining(String name);
}