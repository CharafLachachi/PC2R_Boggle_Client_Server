import { ConnexionService } from './../connexion.service';
import { Component, OnInit } from '@angular/core';

interface UsedWords {
  word: string;
  status: 'valide'|'invalide';
  raison?: string;
}

interface UserScore {
  username: string;
  score: number;
}

@Component({
  selector: 'app-session-information',
  templateUrl: './session-information.component.html',
  styleUrls: ['./session-information.component.css']
})
export class SessionInformationComponent implements OnInit {

  public wordList: UsedWords[];
  public scores: UserScore[];
  constructor(public cs: ConnexionService) {
    this.wordList = new Array<UsedWords>();
    this.scores = new Array<UserScore>();
    cs.onMessage().subscribe((message: String) => {
      const mt = message.split('/');
      let mot: string;
      switch (mt[0].toLowerCase()) {
        case 'bienvenue':
          mot = mt[1];
          const ts = { username: mot, score: 0 };
          this.addPlayerToScoreBoardIfNotExists([ts]);
          break;
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
          if (
               (rText.indexOf('est déjà proposé') === -1) &&
               (this.wordList.filter(
                                        (w) => w.word === mot
                                      ).length === 0)
              ) {
            this.wordList.push({ word: mot, status: 'invalide', raison: rText });
          }
          break;
        case 'gamestack':
          console.log('GAME STACK INFORMATION');
          const mots: UsedWords[] = JSON.parse(mt[2]);
          if (this.wordList.length === 0) {
            console.log('WORDLIST EST VIDE');
            this.wordList.push(...mots);
          } else {
            console.log('WORDLIST EST PAS VIDE');
            for (const wd of mots) {
              let e = false;
              for (const w of this.wordList) {
                if (
                    (w.word.toLowerCase() === wd.word.toLowerCase()) &&
                    (w.status.toLowerCase() === wd.status.toLowerCase()) &&
                    (w.raison === wd.raison)
                   ) {
                      console.log('WORD EXISTE DANS WORD LIST');
                       e = true;
                }
              }
              if (e === false) {
                console.log('WORD EXISTE PAS DANS WORD LIST'  );
                this.wordList.push(wd);
              }
            }
          }
          const scores = JSON.parse(mt[4]);
          this.addPlayerToScoreBoardIfNotExists(scores);
          break;
        case 'bilanmots':
          const tus = mt[2].split('\*');
          for (let i = 1; i < tus.length; i += 2) {
            const uname = tus[i];
            const uscore = +tus[i + 1];
            this.scores.filter((s) => s.username === uname)[0].score = uscore;
          }
          break;
        case 'deconnexion':
          const uname = mt[1];
          const fscore = this.scores.filter((s) => s.username.toLowerCase().trim() === uname.toLowerCase().trim())[0];
          console.log(`SCORE TO DELETE ${JSON.stringify(fscore)}`);
          var si = 0;
          for (si = 0; si < this.scores.length; si++) {
            if (this.scores[si].username.toLowerCase().trim() === fscore.username.toLowerCase().trim()) {
              break;
            }
          }
          console.log(`INDEX OF USER TO DELETE ${si}`);
          this.scores.splice(si, 1);
          break;
        default:
          break;
      }
    });
   }

   public updateScores() {
     this.scores.sort((a, b) => b.score - a.score);
   }

   private addPlayerToScoreBoardIfNotExists(scores: UserScore[]) {
     if (this.scores.length === 0) {
       console.log('SCORES EST VIDE');
       this.scores.push(...scores);
     } else {
       console.log('SCORES EST PAS VIDE');
       for (const ss of scores) {
         let e = false;
         for (const s of this.scores) {
           if
           (
             (s.username.toLowerCase() === ss.username.toLowerCase()) &&
             (s.score === ss.score)
           ) {
             console.log('SCORE EXISTE DANS WORD LIST');
             e = true;
           }
         }
         if (e === false) {
           console.log('SCORE EXISTE PAS DANS WORD LIST');
           this.scores.push(ss);
         }
       }
     }
     this.updateScores();
   }

  ngOnInit() {
  }

}
