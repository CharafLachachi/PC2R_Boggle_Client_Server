# Serveur du jeu Boggle en OCAML 

## Auteur 
[Charaf Lachachi](https://github.com/CharafLachachi)

## Prérequis 
Version 4.02.1 ou supèrieure de OCAML. Vous pouvez l'installer via ce lien https://ocaml.org/docs/install.fr.html

## Compilation
Executer la commande suivante dans la racine du projet 
```
 ocamlc -o serv.exe -thread -custom unix.cma threads.cma -cclib -lthreads -cclib -lunix str.cma server.ml
```

## Execution
Pour lancer le server veuillez executer dans la racine du projet : 
```
 ./serv.exe 
```
## Parametres
Pour parametrer le serveur vous avez les quatres arguments suivant à mettre après ./serv.exe .
```
       ip     : pour l'adresse d'ecoute du serveur par defaut 127.0.0.1
       port   : pour le port d'ecoute du serveur par defaut 2018
       dur    : pour la durée d'un tour de jeu en (s) par defaut 60s
       tours  : pour le nombre de tour par session de jeu par defaut 3
```
## Journalisation
```

Pour ce qui de la journalisation des scores de toutes les parties sur une page web, 
vous trouverez sur le dossier (Server) une page « Journal.html » à lancer sur un navigateur 
autre que « Google Chrome » qui interdit l’utilisation d’un fichier local 
qui n’est pas dans un server web.

```
