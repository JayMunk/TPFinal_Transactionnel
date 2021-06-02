package com.munger.permisCovid.repository;

import com.munger.permisCovid.model.Child;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChildRepository extends JpaRepository<Child, Integer> {
    List<Child> findEnfantByIdTuteur(int idTuteur);

    Child findChildByIdChild(int idChild);

    Child findChildByNumAssuranceSocial(String nassm);
}
