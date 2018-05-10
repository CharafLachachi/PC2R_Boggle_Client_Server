# Client du jeu BOGGLE en Java

## Auteur 
[Charaf Lachachi](https://github.com/CharafLachachi)

## Prérequis 
Version 8 ou supèrieure de Java. 

## Execution
Pour lancer le client : 
```
 cd BoggleFX/build/dist
 java -jar PC2R_Boggle_Client_Server.jar
 
```

## Manuel de jeu

<details>
  <summary>
     <strong>Bon jeu </strong>:
  </summary>
  <ul>
		  <img src="https://user-images.githubusercontent.com/13594921/39891402-c478b9fa-549d-11e8-9b9b-cf5e9eb02b47.png"/>

	  
   <li>
    	ZONE 1 : lors de l’ouverture de l’application, la première chose à faire est d’introduire l’adresse IP du serveur et le port d’écoute, ces derniers par défaut sont à 127.0.0.1 :2018, et aussi le pseudo du joueur. Une fois le bouton « LogIn » appuyé l’application se connecte au serveur. Pour se déconnecter le bouton « LogOut » permet d’envoyer le message « SORT/user ».
   </li>
   <li>
	ZONE 2 : une fois le joueur connecté, le serveur envoie les 16 lettres du tirage qui sont affichées dans la grille. Le joueur peut choisir l’ensemble des lettres du mot souhaité en sélectionnant chaque lettre, le bouton « Submit word » permet d’envoyer la sélection au serveur pour vérification. Le joueur peut aussi décider un nouveau mot pendant la réflexion en cliquant sur le bouton « New Word » cela réinitialise les lettres sélectionnées. 
Une possibilité de triche a été introduite dans l’application, en cliquant sur le bouton « Proposition », le client reçoit des propositions de mots correcte selon le tirage et cela en se basant sur un dictionnaire et un algorithme de résolution de la grille.  
Cette zone contient aussi un « Timer » initialisé selon la durée d’un tour paramétrée dans le serveur. Vu que le protocole ne spécifié aucune commande pour le timer nous avons ajouté la commande « TIMER/durée ».
   </li>
   <li>
	ZONE 3 : Les joueurs connectés peuvent communiquer entre eux via le chat en mode privé ou public, Une liste dans la « zone 4 » permet de sélectionner « All » pour un message public ou le pseudo d’un joueur pour un message privé. Par défaut les messages sont en mode public.
   </li>
   <li>
	ZONE 4 : Contient la liste des joueurs connectés pendant la session, et sert aussi à la sélection d’un joueur ou All pour l’envoie des messages de chat. Pour connaitre les joueurs déjà connectés nous avons ajouté au protocole la commande « CONNEDTEDPLAYERS/user1/userN » qui est envoie au nouveau joueur juste après la connexion.
    </li>
   <li>
	 ZONE 5 : A la fin de chaque le score envoyé par le serveur est affiché dans cette liste.
   </li>
   <li>
	ZONE 6 : Après la vérification du mot proposé par le joueur, si le mot est validé par le serveur, ce dernier est ajouté à la liste « Valid words » 
   </li>
   <li>
	ZONE 7 : Cette zone à ajouté spécialement pour le debug afin de voir et comprendre les messages échangés entre le client et le serveur et vice versa.
   </li>
    
  </ul>
</details>
