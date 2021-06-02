package com.munger.permisCovid.repository;

import com.munger.permisCovid.model.Citoyen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CitoyenRepository extends JpaRepository<Citoyen, Integer> {
    Citoyen findCitoyenByEmailAndPassword(String email, String pwd);

    Citoyen findCitoyenByIdUser(int id);

    Citoyen findCitoyenByEmail(String email);

    Citoyen findCitoyenByNumAssuranceSocial(String nassm);
}
