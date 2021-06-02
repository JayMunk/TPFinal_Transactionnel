package com.munger.permisCovid.repository;

import com.munger.permisCovid.model.Permis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PermisRepository extends JpaRepository<Permis, Integer> {
    Permis findPermisByIdCitoyen(int id);

    Permis findPermisByIdChild(int id);

    Permis findPermisByIdCitoyenAndIsTestedNegativeIsTrue(int idCitoyen);

    Permis findPermisByIdChildAndIsTestedNegativeIsTrue(int idChild);
}
