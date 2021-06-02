package com.munger.permisCovid.model;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Entity
@Data
public class Child implements Serializable {
    @Id
    @GeneratedValue()
    private int idChild;

    @NotNull
    private String nom;

    @NotNull
    private String prenom;

    @NotNull
    private String numAssuranceSocial;

    @NotNull
    private String sexe;

    @NotNull
    private int age;

    @NotNull
    private String ville;

    @Column(nullable = true)
    private Integer idPermis;

    @NotNull
    private Integer idTuteur;

    public Child() {
    }

    public Child(String nom, String prenom, String numAssuranceSocial, String sexe, int age, String ville, Integer idTuteur) {
        this.nom = nom;
        this.prenom = prenom;
        this.numAssuranceSocial = numAssuranceSocial;
        this.sexe = sexe;
        this.age = age;
        this.ville = ville;
        this.idTuteur = idTuteur;
    }

    public void setPermis(int idPermis) {
        this.idPermis = idPermis;
    }
}
