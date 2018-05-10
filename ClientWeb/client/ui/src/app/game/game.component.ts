import { MatSnackBar } from '@angular/material';
import { ConnexionService } from './../connexion.service';
import { Component, OnInit, Input } from '@angular/core';

interface GrilleCase {
  position: 'rotate0' | 'rotate90' | 'rotate180' | 'rotate270';
  lettre: string;
  selected: boolean;
  trajectoire: string;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  @Input() selfUsername: String;
  public grille: GrilleCase[][];
  public gLoaded = false;
  public selectedM = new Array<{lettre: string, trajectoire: string}>();
  constructor(public cs: ConnexionService, public snackBar: MatSnackBar) {
    this.grille = new Array(4);
    for (let i = 0; i < 4 ; i++) {
      this.grille[i] = new Array(4);
    }
    this.cs.onMessage()
      .subscribe((message: string) => {
        console.log(`Le dernier char ${message[message.length]}`);
        // this.openSnackBar(message);
        // const mws = message.trim().split('\n');
        // mws.map((m) => {
        const mt = message.trim().split('/');
          switch (mt[0].toLowerCase()) {
            case 'session':
              console.log('Début d\'une session');
              break;
            case 'tour':
              this.selectedM = new Array();
              if (this.gLoaded === false) {
                console.log('Il faut récupérer les lettres');
                const lettres = mt[1];
                console.log('Lettres : ' + lettres);
                for (let i = 0; i < 16; i++) {
                  const nbL = Math.floor(i / 4);
                  console.log(`Ligne ${nbL}`);
                  const nbC = i % 4;
                  console.log(`Colonne ${nbC}`);
                  console.log(`Lettre à mettre ${lettres[i]}`);
                  this.grille[nbL][nbC] = {
                    position: this.roll(),
                    lettre: lettres[i],
                    selected: false,
                    trajectoire: this.convertLettre(nbL) + '' + (nbC + 1)
                  };
                }
                this.gLoaded = true;
              }
              break;
            case 'minvalide':
              const mot = mt[1];
              const raison = mt[2].trim();
              switch (raison) {
                case 'MotInexistantDansLeDictio':
                  this.openSnackBar(`Le mot ${mot} n'existe pas dans la dictionnaire`);
                  break;
                case 'MauvaiseTrajectoire':
                  this.openSnackBar('Les cases doivent être voisin');
                  break;
                case 'TrajectoireNeCorrespondPasAuMot':
                  this.openSnackBar('La trajectoire ne correspond pas au mot');
                  break;
                case 'PRIMotDejaPropose':
                  this.openSnackBar(`Le mot ${mot} est déjà proposé`);
                  break;
                default:
                  this.openSnackBar('Le mot est invalide. Mais la raison est inconnue');
                  break;
              }
              break;
            case 'rfin':
              this.gLoaded = false;
              break;
            default:
              break;
          }
        // });
      });
  }

  private openSnackBar(message: string): void {
    this.snackBar.open(message, undefined, { duration: 2000 });
  }

  select(gcase: GrilleCase) {
    if (gcase.selected) {
      console.log('La case est déjà sélectionné');
      const trajectoires = this.selectedM.map(e => e.trajectoire);
      const index = trajectoires.indexOf(gcase.trajectoire);
      console.log('Index ' + index);
      this.selectedM.splice(index, 1);
    } else {
      console.log('La case n\'est pas encore sélectionné');
      this.selectedM.push({ lettre: gcase.lettre, trajectoire: gcase.trajectoire });
    }
    console.log(this.selectedM);
    gcase.selected = !gcase.selected;
  }

  ngOnInit() {
  }

  private convertLettre(i: number): string {
    return ['A', 'B', 'C', 'D'][i];
  }

  public roll(): 'rotate0' | 'rotate90' | 'rotate180' | 'rotate270' {
    const rnd = Math.random() * 4;
    if (rnd < 1 ) {
      return 'rotate0';
    }
    if (rnd < 2) {
      return 'rotate90';
    }
    if (rnd < 3) {
      return 'rotate180';
    }
    if (rnd < 4) {
      return 'rotate270';
    }
  }

  public returnMot(): string {
    return this.selectedM.map((a) => a.lettre).reduce((a, b) => a + b, '');
  }

  public returnTrajectoire(): string {
    return this.selectedM.map((a) => a.trajectoire).reduce((a, b) => a + b, '');
  }

  private releaseAllLetters() {
    for (let i = 0; i < this.grille.length; i++) {
      const m = this.grille[i].length;
      for (let j = 0; j < m; j++) {
        this.grille[i][j].selected = false;
      }
    }
  }

  public sendWord() {
    this.cs.send('TROUVE/' + this.returnMot() + '/' + this.returnTrajectoire());
    this.selectedM = new Array<{ lettre: string, trajectoire: string }>();
    this.releaseAllLetters();
  }
}
