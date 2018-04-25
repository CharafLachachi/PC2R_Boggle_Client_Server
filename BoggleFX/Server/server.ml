
(*ocamlc -o serv.exe -thread -custom unix.cma threads.cma -cclib -lthreads -cclib -lunix str.cma server.ml*)
(*Variable Globales*)
let tr = ref "";;
let tirage_matrix = ref (Array.make_matrix 4 4 "") ;;
let dictionnaire = ref [] ;;
let tourN = ref 2;;
  
type cell = {
  id : string;
  n : string;
  e : string;
  s : string;
  o : string;
  ne : string;
  se : string;
  so : string;
  nou : string
  
}
let creer_cell id no es su we ne se so nou =
  {
    id = id;
    n = no;
    e = es;
    s = su;
    o = we;
    ne = ne;
    se = se;
    so = so;
    nou = nou  
  }
let cell_list:cell list ref = ref [] and
    mutex_cellL = Mutex.create () 
				  
let fill_cell () =
  cell_list := !cell_list@[creer_cell "A1" "" "A2" "B1" "" "" "B2" "" ""];
  cell_list := !cell_list@[creer_cell "A2" "" "A3" "B2" "A1" "" "B3" "B1" ""];
  cell_list := !cell_list@[creer_cell "A3" "" "A4" "B3" "A2" "" "B4" "B2" ""];
  cell_list := !cell_list@[creer_cell "A4" "" "" "B4" "A3" "" "" "B3" ""];
  
  cell_list := !cell_list@[creer_cell "B1" "A1" "B2" "C1" "" "A2" "C2" "" ""];
  cell_list := !cell_list@[creer_cell "B2" "A2" "B3" "C2" "B1" "A3" "C3" "C1" "A1"];
  cell_list := !cell_list@[creer_cell "B3" "A3" "B4" "C3" "B2" "A4" "C4" "C2" "A2"];
  cell_list := !cell_list@[creer_cell "B4" "A4" "" "C4" "B3" "" "" "C3" "A3"];
  
  cell_list := !cell_list@[creer_cell "C1" "B1" "C2" "D1" "" "B2" "D2" "" ""];
  cell_list := !cell_list@[creer_cell "C2" "B2" "C3" "D2" "C1" "B3" "D3" "D1" "B1"];
  cell_list := !cell_list@[creer_cell "C3" "B3" "C4" "D2" "C2" "B4" "D4" "D2" "B2"];
  cell_list := !cell_list@[creer_cell "C4" "B4" "" "D4" "C3" "" "" "D3" "B3"];

  cell_list := !cell_list@[creer_cell "D1" "C1" "D2" "" "" "C2" "" "" ""];
  cell_list := !cell_list@[creer_cell "D2" "C2" "D3" "" "D1" "C3" "" "" "C1"];
  cell_list := !cell_list@[creer_cell "D3" "C3" "D4" "" "D2" "C4" "" "" "C2"];
  cell_list := !cell_list@[creer_cell "D4" "C4" "" "" "D3" "" "" "" "C3"];
  print_endline (string_of_int (List.length !cell_list))

(*Type contenant les informations d'un joueur*)
type joueur = {
  nom: string;
  id : int;
  socket: Unix.file_descr;
  mutable score: int;
  inchan: in_channel;
  outchan: out_channel;
  mutable playing :bool;
  mutable  reponses : string list


}
(*Compteur des joueurs connectes*)
let cpt_id = ref 0
		 
(*Initialisation d'un nouveau joueur*)
let creer_joueur user sock inc out=
  incr cpt_id;
  {
    nom = user;
    id = !cpt_id;
    score = 0;
    socket = sock;
    inchan = inc;
    outchan = out;
    playing = false;
    reponses =  [] 
  }
    				    
(*Liste des joueurs connecte a la session*)
let joueur_liste:joueur list ref = ref [] 
and nbJoueur = ref 0 and 
(*Mutex pour gerer l'acces a la liste partagee des joueurs*)
mutex_joueurL = Mutex.create ()

let phase =ref 0 (*0: hors session, 1: recherche, 2: verification, 3: resultat *)
and tourNum = ref 0
and mutex_phase = Mutex.create ()

(*DICTIONNAIRE*)
			       
let read_file filename = 
  let lines = ref [] in
  let chan = open_in filename in
  try
    while true; do
      lines := input_line chan :: !lines
    done; !lines
  with End_of_file ->
    close_in chan;
    List.rev !lines
	     
let read_diction filename = 
  let chan = open_in filename in
  try
    while true; do
      dictionnaire := input_line chan :: !dictionnaire
    done; !dictionnaire
  with End_of_file ->
    print_endline "LECTURE DU DICTIONNAIRE TERMINE";
    close_in chan;
    List.rev !dictionnaire
(*DES*)

let des () = 
  let matrice = Array.make_matrix 4 4 "" and
  list_des = read_file "dice.dat" and index = ref 0 in
  for i = 0 to (Array.length matrice) - 1 do
    for j = 0 to (Array.length matrice.(i)) - 1 do
        let rand = Random.int 6 and
            case = List.nth list_des !index;
            in 
              matrice.(i).(j) <- (String.make 1 case.[rand]);
              index := !index + 1   
      done
  done;
  matrice

  (*transformer la matrice en  string pour l'envoyer*)
  let array_to_string tab = 
    let tab_string = ref "" in 
     for i = 0 to ((Array.length tab) -1)  do
      for j = 0 to ((Array.length tab.(i)) -1)  do
      tab_string := !tab_string ^ tab.(i).(j);
      done
     done;
     tab_string := !tab_string ^ "\n";
     !tab_string
  

(*VERIFIER SI LE MOT EST PRESENT DANS LE DICT*)	     
let find_diction word =
  print_endline ( string_of_int (List.length !dictionnaire));
  print_endline word ;
  let res = ref false  in
  List.iter (fun s -> if ((String.compare s word) = 0) then begin print_endline s; res := true end ) !dictionnaire;
  print_endline "FIN RECHERCHE DICT";
  res

let find_in_enchere ((pla:joueur),word) =
  let res = ref true in 
  List.iter (
      fun s ->  begin
	      List.iter(
		  fun w -> if ((String.compare w word) = 0) then begin
								print_endline( w^" "^"MOT DEJA EXISTANT"); res := false
							      end
		) s.reponses		    
	    end
    ) !joueur_liste;
  if(!res = true) then
    begin
      print_endline ("N'EXISTE PAS "^string_of_bool !res);
      List.iter (
	  fun s -> if ((String.compare s.nom pla.nom) = 0)
		   then
		     begin
		       print_endline "CHANGEMENT DE TAILLE DES REPONSES";
		       s.reponses  <- s.reponses@[word];
		       print_endline (string_of_int (List.length s.reponses)^s.nom)
		     end
	) !joueur_liste      
    end ;
  print_endline "je suis a la fin";
  res
    
(*VERIFIER LA TRAJECTOIRE DU MOT*)
let verify_trajectoire word =
  print_endline ("trajectoire "^word^"DE TAILLE "^(string_of_int (String.length word)));
  let res = ref true in
  let i = ref 2 in
  while  !i < (String.length word) do
    begin
      let pre_cell = ref (String.sub word ((!i)-2) 2) in
      let curr_cell = ref  (String.sub word !i 2) in
      print_endline("CURRENT "^(!curr_cell));
      Mutex.lock mutex_cellL;
      List.iter(
	  fun (c:cell) -> begin
			 (* print_endline c.id;*)
			 if (String.trim c.id = String.trim (!curr_cell)) then
			   begin
			       print_endline("je compare "^(!pre_cell)^" avec "^c.n^c.e^c.s^c.o^c.ne^c.se^c.so^c.nou );
			     if(
			       (String.compare c.n !pre_cell) <> 0 &&
				 (String.compare c.e !pre_cell) <> 0 &&
				   (String.compare c.s !pre_cell) <> 0 &&
				     (String.compare c.o !pre_cell) <> 0 &&
				       (String.compare c.ne !pre_cell) <> 0 &&
					 (String.compare c.se !pre_cell) <> 0 &&
					   (String.compare c.so !pre_cell) <> 0 &&
					     (String.compare c.nou !pre_cell) <> 0 
			     ) then
			       begin
			       print_endline "les cases ne sont pas voisines";
			       res := false
			       end
				      
			   end
		       end
	)!cell_list;
       Mutex.unlock mutex_cellL;
      i := !i +2 ;
    end
  done;
  res
  
 (*trouvé une lettre selon une case dans une matrice *)
let word_in_case case tab = 
  let lettre =  match case.[0] with
    'A' -> tab.(0).((int_of_string (String.make 1 case.[1])) - 1)
    | 'B' -> tab.(1).((int_of_string (String.make 1 case.[1])) - 1)
    | 'C' -> tab.(2).((int_of_string (String.make 1 case.[1])) - 1)
    | 'D' -> tab.(3).((int_of_string (String.make 1 case.[1])) - 1)
    in
		
  lettre;;


(*pour trouver un mot selon sa trajctoire*)
let find_word_of_trajectoire (traj,tab) = 
  let i = ref 0 and mot = ref "" in
  if (String.length traj) mod 2 = 0 then  
  begin
     while (!i+2) <= String.length traj do
        mot := !mot ^ (word_in_case (String.sub traj !i 2) tab);
        i := !i + 2
      done
  end;
    !mot;;
		




let update_score (word,player) = 
  if(String.length word) >= 8
    then player.score <- player.score + 11
  else if (String.length word) >= 3 then
  match (String.length word) with 
  3 -> player.score <- player.score + 1;
  |4 -> player.score <- player.score + 1;
  |5 -> player.score <- player.score + 2;
  |6 -> player.score <- player.score + 3;
  |7 -> player.score <- player.score + 5 ;
  else ()

    
(*DISPATCH POUR LES REQUETTES RECU DES CLIENTS*)
    
let received_request req =
  let splited = Str.split (Str.regexp "/") req in
  if (List.length splited) > 0 then
    let intitule = List.hd splited
    and args = List.tl splited in
    print_endline intitule;
    match intitule with
      "CONNEXION" -> (1, args)
    | "SORT" -> (2, args)
    | "ENVOI" -> (5,args)
    | "PENVOI" -> (6,args)
    | "TROUVE" ->(3,args)
    | _ -> (-1, args)
  else
    (-1, [])


(*Reponse de connexion d'un client*)
let bienvenue user =
  print_endline "bien";
  "BIENVENUE/" ^ user^"\n"
(*Signalement de la connexion de user aux autres clients*)
let connecte user =
  "CONNECTE/"^user^"\n"
(*Signalement de la deconnexion de user aux autres clients*)
let deconnexion user = 
  "DECONNEXION/" ^user^"\n"
let message args =
  "RECEPTION/"^(List.nth args 0)^"\n"
let pmessage (args,user) =
  "PRECEPTION/"^(List.nth args 1)^"/"^(String.trim user)^"\n"
let session ()= 
  "SESSION/\n"
let tour t =
  "TOUR/"^t^"\n"
let valide word =
  "MVALIDE/"^word^"\n"
let invalide (word,raison) =
  "MINVALIDE/"^word^"/"^raison^"\n"
let finreflexion () =
  "RFIN/\n"
    
let vainqueur t =
   let rec score l=
    match l with
      [] -> ""
    | h::t -> (String.trim h.nom)^"*"^(string_of_int h.score)^"*"^(score t)
  in
  let x = score !joueur_liste in
  "VAINQUEUR/"^(String.sub x 0 (String.length x -1))^"\n"
						         
let bilantour () = 
  let rec create l=
    match l with
      [] -> ""
    | h::t -> (String.trim h.nom)^":"^(String.concat "," h.reponses)^";"^(create t)
  in
  let x = create !joueur_liste in
   let rec score l=
    match l with
      [] -> ""
    | h::t -> (String.trim h.nom)^"*"^(string_of_int h.score)^"*"^(score t)
  in
  let y = score !joueur_liste in
  
  print_endline x;
  "BILANMOTS/"^(String.sub x 0 (String.length x -1))^"/"^(string_of_int !tourNum)^"*"^(String.sub y 0 (String.length y -1))^"\n"

let rec fin_session () =
   ignore(Unix.setitimer Unix.ITIMER_REAL {it_interval =0.0; it_value =0.0});
  ignore(Sys.signal Sys.sigalrm Sys.Signal_default);
  if !phase = 0 then
    ()
  else begin
      phase := 0;
      tourNum := 0
    end;
  let ite (playeur:joueur) = output_string playeur.outchan (vainqueur !tourNum); flush playeur.outchan in
  List.iter ite !joueur_liste;
  if !nbJoueur > 1 then
    debut_session ()
  else
    ()



(* Fonction appelle lors d'un timeout de la phase de resolution du joueur actif *)

and timeout_reflexion _ =
  Mutex.lock mutex_joueurL;
  Mutex.lock mutex_phase;
  print_endline "TIMEOUT REFLEXION";
  if !phase = 1 then begin
        let timeout (play:joueur) = 
          output_string play.outchan (finreflexion ()); 
          flush play.outchan;
          let x = bilantour () in 
          print_endline x;
          output_string play.outchan (x); 
          flush play.outchan in
	List.iter timeout !joueur_liste;
	if !tourNum <= !tourN then
	  (*TODO generer la grille*)
	  begin
	  ignore(Sys.signal Sys.sigalrm (Sys.Signal_handle lock_reflexion));
	  ignore(Unix.setitimer Unix.ITIMER_REAL {it_interval = 0.0; it_value = 2.0 })
	  end
	else
	  begin
	    fin_session ();
	  end
		  end
  else ();
  Mutex.unlock mutex_phase;
  Mutex.unlock mutex_joueurL

and begin_reflexion () = 
  incr tourNum;
  print_endline "BEGIN REFLEXION";
	tirage_matrix := des () ;
  tr := array_to_string (!tirage_matrix);
  envoie_tirage !tr;

  
  ignore(Sys.signal Sys.sigalrm (Sys.Signal_handle timeout_reflexion));
  (*REFLEXION 120 S*)
  ignore(Unix.setitimer Unix.ITIMER_REAL {it_interval = 0.0; it_value = 300.0});

and lock_reflexion _ = 
  Mutex.lock mutex_joueurL;
  Mutex.lock mutex_phase;
  begin_reflexion ();
  Mutex.unlock mutex_phase;
  Mutex.unlock mutex_joueurL

(*Debut de session*)
and debut_session () =
  let func (play:joueur) = output_string play.outchan (session()); flush play.outchan in
  List.iter func !joueur_liste;
  phase := 1;
  print_endline "DEBUT DE SESSION";
  (*envoie_tirage "ENTDOSSPULTEAIMS";*)
  ignore(Sys.signal Sys.sigalrm (Sys.Signal_handle lock_reflexion));
  ignore(Unix.setitimer Unix.ITIMER_REAL {it_interval = 0.0; it_value = 5.0 })
	
and envoie_tirage tirage =
  print_endline tirage;
  let func (play:joueur) = output_string play.outchan (tour tirage); flush play.outchan;
  print_endline play.nom in
  List.iter func !joueur_liste;;



(*Traitement de la phase de connexion d'un nouveau joueur*)
let traitement_connecte (player:joueur) =
  Mutex.lock mutex_joueurL;
  incr nbJoueur;
  let rec hello (l:joueur list) =
    match l with
      h :: t ->begin output_string h.outchan (connecte player.nom);
      		     flush h.outchan;
      		     h::(hello t)
      	       end
    | [] -> begin output_string player.outchan (bienvenue player.nom);
		  flush player.outchan;
 		  print_endline ("connected " ^(String.trim player.nom) ^ " / "^(string_of_int player.id));
    		 
    		  player::[]
    	    end
  in joueur_liste := hello !joueur_liste;
     Mutex.lock mutex_phase;
     if !nbJoueur > 0 && !phase = 0 then
       begin
	 debut_session()
       end
     else if !phase != 0 then begin
			     print_endline "phase en cours";
			     player.playing <- true;
  			     output_string player.outchan (tour !tr );
  			     flush player.outchan
  			   end else ();
     Mutex.unlock mutex_phase;
     Mutex.unlock mutex_joueurL;;

(* Fonction de traitement de la requete de deconnexion *)
let traitement_sortie (player:joueur)= 
print_endline "sortie";
  Mutex.lock mutex_joueurL;
  nbJoueur := !nbJoueur -1;
  let rec remove_and_warn (li:joueur list) =
    match li with
      h::t -> if (h.id = player.id) then remove_and_warn t
              else
                begin
                  output_string h.outchan (deconnexion player.nom);
                  flush h.outchan;
                  h::(remove_and_warn t)
                end
    | [] -> []
  in joueur_liste := remove_and_warn !joueur_liste;
     Mutex.unlock mutex_joueurL;;

(*Fonction de traitement de la requetes message pour le chat*)
let traitement_message (player:joueur) args =
  let sendMessage (pla:joueur) =
    if pla.id = player.id then 
      ()
    else begin
	output_string pla.outchan (message args);
	flush pla.outchan;
	print_endline (pla.nom)
      end in
  Mutex.lock mutex_joueurL;
  List.iter sendMessage !joueur_liste;
  Mutex.unlock mutex_joueurL;;

(*Fonction de traitement de la requetes message pour le chat*)
let traitement_messagei (player:joueur) args =
	print_endline ("prive"^(List.nth args 0));
  let sendMessage (pla:joueur) =
	print_endline ("prive boucle"^pla.nom);
    if  (String.compare pla.nom (String.trim (List.nth args 0))) = 0 then 
      begin
	print_endline "message prive";
	output_string pla.outchan (pmessage (args,player.nom));
	flush pla.outchan
      end in
  Mutex.lock mutex_joueurL;
  List.iter sendMessage !joueur_liste;
  Mutex.unlock mutex_joueurL;;


(*-----------------------------------*)
(*--------Serveurs Et Threads--------*)
(*-----------------------------------*)

let creer_serveur max_co = 
  let sock = Unix.socket Unix.PF_INET Unix.SOCK_STREAM 0
  and addr = Unix.inet_addr_of_string "127.0.0.1"
  in
  Unix.setsockopt sock Unix.SO_REUSEADDR true;
  Unix.bind sock(Unix.ADDR_INET(addr,2019));
  Unix.listen sock max_co;
  sock;;

let serveur_process sock service=
  ignore(Sys.signal Sys.sigalrm Sys.Signal_ignore);
  while true do
    try
      let(s, caller) = Unix.accept sock
      in
      ignore(Thread.create service s)
    with _ ->()
  done;;

let boucle_joueur player =
  try
    while true do
      try
	let line = input_line player.inchan in
	let (num_req, args) = received_request line in
	match num_req with
	 2 -> traitement_sortie player; raise Exit;
	| 3 -> 
	   (*find_diction (String.trim (String.lowercase (List.nth args 0)))*)
	   let b = find_diction (String.trim (String.lowercase (List.nth args 0))) in
	   if (!b) then
	     begin
		  	 let d = verify_trajectoire (String.trim (List.nth args 1)) in
	       if (!d) then
					 begin
							if(String.compare 
							(String.trim (List.nth args 0))
							(find_word_of_trajectoire 
											((String.trim (List.nth args 1)),!tirage_matrix)) = 0)  then
								begin
									let c = find_in_enchere (player,String.trim (String.lowercase (List.nth args 0))) in
									if (!c) then
       			  			begin
					           update_score ((String.trim (List.nth args 0)),player);
							       output_string player.outchan (valide (List.nth args 0));
					           flush player.outchan;
					           print_endline ("score"^string_of_int player.score)
									  end
						 			else 
										begin
								       output_string player.outchan (invalide ((List.nth args 0),"PRIMotDejaPropose"));
								       flush player.outchan
								    end
								end
							else
								begin
							  output_string player.outchan (invalide ((List.nth args 0),"TrajectoireNeCorrespondPasAuMot"));
		   			    flush player.outchan
								end				
		   	  end
	       else begin
		   output_string player.outchan (invalide ((List.nth args 0),"MauvaiseTrajectoire"));
		   flush player.outchan
		 			end  
					end    
	   else begin
	       output_string player.outchan (invalide ((List.nth args 0),"MotInexistantDansLeDictio"));
	       flush player.outchan
	     end 
			
		  
		  
 	| 5 -> begin 
	       traitement_message player args;
	       flush player.outchan end
	| 6 -> begin 
	       traitement_messagei player args;
	       flush player.outchan end

	| _ ->
	   begin 
	     output_string player.outchan ("REQUETE INVALIDE : "^line^"\n");
	     flush player.outchan
	   end
      with End_of_file ->traitement_sortie player; raise Exit;
    done;
  with Exit-> ();;

let joueur_service sock=
  let inchan = Unix.in_channel_of_descr sock
  and outchan = Unix.out_channel_of_descr sock in
  let line = input_line inchan in
  let (num_req, args) = received_request line in
  if num_req = 1 then
    let player = (creer_joueur (List.nth args 0) sock inchan outchan) in
    traitement_connecte player;
    boucle_joueur player
  else
    begin 
      output_string outchan "REQUETE INVALIDE: attente d'une requete de la forme: CONNEXION/username\n"; 
      flush outchan;
      Unix.close sock
    end

let main ()=
  read_diction "dictionnaire.dat";
  fill_cell () ;
  serveur_process (creer_serveur 10) joueur_service
;;

  main ()
