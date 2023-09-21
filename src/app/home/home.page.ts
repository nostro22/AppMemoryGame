import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { FirebaseService } from '../firebase.service';
import { observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule],
  providers: [SweetAlert2Module]
})
export class HomePage implements OnInit {
  constructor(private aut: FirebaseService, private router: Router, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
  }
  user?: any;
  nombre?: string = "";
  public dificultad: number = 1;
  cartasSelecionadas: any;
  canFlip: number = 0;
  isPortrait?: boolean;
  masos: any;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.cardStyles;
  }
  get cardStyles() {
    if (this.isPortrait) {

      if (this.dificultad == 1) {
        return {
          height: '40vw',
          width: '40vw',
          margin: ' 0 0 10vh  0'
        };
      } else if (this.dificultad == 2) {
        return {
          height: '30vw',
          width: '30vw',
        };
      } else {
        return {
          height: '25vw',
          width: '25vw'
        };
      }
    } else {
      if (this.dificultad == 1) {
        return {
          height: '33vh',
          width: '33vh',
          margin: '2vh 6vh'

        };
      } else if (this.dificultad == 2) {
        return {
          height: '30vh',
          width: '30vh'
        };
      } else {
        return {
          height: '20vh',
          width: '20vh',

        };
      }
    }
  }

  public cards1 = [
    { value: '../../assets/leon.png', show: false, use: true },
    { value: '../../assets/leon.png', show: false, use: true },
    { value: '../../assets/cebra.png', show: false, use: true },
    { value: '../../assets/cebra.png', show: false, use: true },
    { value: '../../assets/coco.png', show: false, use: true },
    { value: '../../assets/coco.png', show: false, use: true },

  ];
  public cards2 = [
    { value: '../../assets/leon.png', show: false, use: true },
    { value: '../../assets/leon.png', show: false, use: true },
    { value: '../../assets/cebra.png', show: false, use: true },
    { value: '../../assets/cebra.png', show: false, use: true },
    { value: '../../assets/coco.png', show: false, use: true },
    { value: '../../assets/coco.png', show: false, use: true },
    { value: '../../assets/pig.png', show: false, use: true },
    { value: '../../assets/pig.png', show: false, use: true },
    { value: '../../assets/bear.png', show: false, use: true },
    { value: '../../assets/bear.png', show: false, use: true },

  ];
  public cards3 = [
    { value: '../../assets/leon.png', show: false, use: true },
    { value: '../../assets/leon.png', show: false, use: true },
    { value: '../../assets/cebra.png', show: false, use: true },
    { value: '../../assets/cebra.png', show: false, use: true },
    { value: '../../assets/coco.png', show: false, use: true },
    { value: '../../assets/coco.png', show: false, use: true },
    { value: '../../assets/bunny.png', show: false, use: true },
    { value: '../../assets/bunny.png', show: false, use: true },
    { value: '../../assets/elephant.png', show: false, use: true },
    { value: '../../assets/elephant.png', show: false, use: true },
    { value: '../../assets/pig.png', show: false, use: true },
    { value: '../../assets/pig.png', show: false, use: true },
    { value: '../../assets/rino.png', show: false, use: true },
    { value: '../../assets/rino.png', show: false, use: true },
    { value: '../../assets/fox.png', show: false, use: true },
    { value: '../../assets/fox.png', show: false, use: true },

  ];

  shuffleCards() {
    for (let i = this.cartasSelecionadas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cartasSelecionadas[i], this.cartasSelecionadas[j]] = [this.cartasSelecionadas[j], this.cartasSelecionadas[i]];
    }
  }
  async flipCard(card: any) {
    if (card.show == false && this.canFlip < 2 && card.use) { // check if the card can be flipped
      card.show = true;
      this.canFlip++;
      const flippedCards = this.cartasSelecionadas.filter((card: { value: string, show: boolean, use: boolean }) => card.show && card.use);

      if (flippedCards.length === 2) {
        if (flippedCards[0].value === flippedCards[1].value) {
          flippedCards[0].show = true;
          flippedCards[1].show = true;
          flippedCards[0].use = false;
          flippedCards[1].use = false;
          this.canFlip = 0; // reset the cooldown flag to true

        } else {
          new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
            flippedCards[0].show = false;
            flippedCards[1].show = false;
          }).then(() => {
            this.canFlip = 0; // reset the cooldown flag to true
          });
        }
      }
    }
    if (this.areAllCardsShown(this.cartasSelecionadas)) {
      //victoria

      const timemposMenores: any[] = await this.aut.getLowestTiempos();

      setTimeout(() => {
        {
          this.pantallaVictoria('${this.user}', timemposMenores);
        }
      }, 1000);
    }
  }


  ionViewDidEnter() {
    this.startTimer();
    window.screen.orientation.unlock();
    this.ngOnInit();

  }

  ngOnInit() {

    this.dificultad = this.aut.dificultad;


    firebase.auth().onAuthStateChanged(user => {
      this.user = firebase.auth().currentUser;
    });
    this.masos = [this.cards1, this.cards2, this.cards3];
    this.cartasSelecionadas = this.masos[this.dificultad - 1];
    this.shuffleCards();
    this.isPortrait = this.isInPortrait();
    this.aut.dismissLoading();
    this.elapsedTime = 0;
    this.startTimer();
    this.cards1 = this.cards1.map(card => ({ ...card, show: false, use: true }));
    this.cards2 = this.cards2.map(card => ({ ...card, show: false, use: true }));
    this.cards3 = this.cards3.map(card => ({ ...card, show: false, use: true }));


    screen.orientation.onchange = () => {
      this.isPortrait = this.isInPortrait();
    };
  }
  isInPortrait() {
    return this.isPortrait = screen.orientation.type.includes("portrait");
  }
  getEmailPrefix(email: string): string {
    const parts = email.split("@");
    return parts[0];
  }

  async logout() {
    await this.aut.showLoading("Cerrando...").then(() => firebase.auth().signOut().then(() => {
      this.router.navigate(['/log']);
    }));
  }


  public startTime!: number;
  public timerId!: any;
  public elapsedTime = 0;
  public playing = true;

  startTimer() {
    this.playing = true;
    this.elapsedTime = 0;
    this.startTime = Date.now();
    this.timerId = setInterval(() => {
      this.elapsedTime = Date.now() - this.startTime;
    }, 10);
  }

  stopTimer(): number {
    clearInterval(this.timerId);
    let elapsedSeconds = (this.elapsedTime / 1000);
    this.playing = false;
    return elapsedSeconds;
  }

  showScore() {
    let elapsedSeconds = this.stopTimer();
    let elapsedSecondsFormatted = elapsedSeconds.toFixed(2);
    this.aut.uploadScore(elapsedSecondsFormatted, this.user.email);
  }
  areAllCardsShown(cards: any[]): boolean {
    for (let i = 0; i < cards.length; i++) {
      if (!cards[i].show) {
        return false;
      }
    }
    return true;
  }

  async pantallaVictoria(message: string, items: any[]) {
    // Display items in a table
    this.showScore();
    console.log(this.aut.usuarioAutenticado.email);
    let dificultad: any
    const tableRows = items
      .map(
        (item) => `
            <tr>
              <td>${item.nombre}</td>
              <td>${item.tiempo}</td>
            </tr>
          `
      )
      .join('');

    const table = `
      <h1>${(this.aut.usuarioAutenticado.email.split("@"))[0]} felicitaciones lo completaste en ${(this.elapsedTime / 1000).toFixed(2)} segundos </h1>
      <br>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tiempo seg</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        `;
    const { value: $event } = await Swal.fire({
      html: table,
      input: 'radio',

      inputOptions: {
        easy: '<span style="color: blue;">Fácil</span>',
        medium: '<span style="color: green;">Intermedio</span>',
        hard: '<span style="color: red;">Difícil</span>',
      },

      inputPlaceholder: 'Seleccione la dificultad',
      showCancelButton: true,
      cancelButtonText: 'Salir',
      confirmButtonText: 'Volver a jugar',
      showLoaderOnConfirm: true,
      heightAuto: false,
      allowOutsideClick: false,

      background: 'rgba(242, 142, 142, 1)',
      preConfirm: (selectedOption) => {
        console.log('Dificultad seleccionada:', selectedOption);
        dificultad = selectedOption;
      },
    });

    if ($event) {
      if (dificultad === 'easy') {
        await this.aut.setDificultad(1).then(() => {
          this.ngOnInit();
        });
      } else if (dificultad === 'medium') {
        await this.aut.setDificultad(2).then(() => {
          this.ngOnInit();
        });
      } else if (dificultad === 'hard') {
        await this.aut.setDificultad(3).then(() => {
          this.ngOnInit();
        });
      }
    } else {
      this.logout();
      console.log('El usuario canceló la operación');
    }
  }

  formatTime(time: number): string {
    let minutes = Math.floor(time / 60000);
    let seconds = Math.floor((time % 60000) / 1000);
    let milliseconds = Math.floor((time % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  }


}


