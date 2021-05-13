package com.benscruton.dinnergetter.repositories;

import java.util.List;

import com.benscruton.dinnergetter.models.SubList;
import com.benscruton.dinnergetter.models.User;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubListRepository extends CrudRepository<SubList, Long>{
    List<SubList> findByOwner(User owner);
}
