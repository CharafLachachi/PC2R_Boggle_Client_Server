import { ConnexionService } from './../connexion.service';
import { Component, OnInit } from '@angular/core';

interface UsedWords {
  word: string;
  status: 'valide'|'invalide';
  raison?: string;
}

@Component({
  selector: 'app-session-information',
  templateUrl: './session-information.component.html',
  styleUrls: ['./session-information.component.css']
})
export class SessionInformationComponent implements OnInit {

  public wordList: UsedWords[];

  constructor(public cs: ConnexionService) {
    this.wordList = new Array<UsedWords>();
    cs.onMessage().subscribe((message: String) => {
      const mt = message.split('/');
      let mot: string;
      switch (mt[0].toLowerCase()) {
        case 'mvalide':
          mot = mt[1];
          this.wordList.push({word : mot, status: 'valide'});
          break;
        case 'minvalide':
          mot = mt[1];
          const raison = mt[2].trim();
          let rText: string;
          switch (raison) {
            case 'MotInexistantDansLeDictio':
              rText = `Le mot ${mot} n'existe pas dans la dictionnaire`;
              break;
            case 'MauvaiseTrajectoire':
              rText = 'Les cases doivent être voisin';
              break;
            case 'TrajectoireNeCorrespondPasAuMot':
              rText = 'La trajectoire ne correspond pas au mot';
              break;
            case 'PRIMotDejaPropose':
              rText = `Le mot ${mot} est déjà proposé`;
              break;
            default:
              rText = 'Le mot est invalide. Mais la raison est inconnue';
              break;
          }
          if (rText.indexOf('est déjà proposé') === -1) {
            this.wordList.push({ word: mot, status: 'invalide', raison: rText });
          }
          break;
        default:
          break;
      }
    })
   }

  ngOnInit() {
  }

}
