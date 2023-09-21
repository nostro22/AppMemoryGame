import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonAccordionGroup, IonicModule, Platform, ToastController } from '@ionic/angular';
import { FirebaseService } from '../firebase.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CommonModule } from '@angular/common';
import { HomePage } from '../home/home.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule],
  providers: [SweetAlert2Module]

})
export class LoginComponent {
  constructor(private platform: Platform, private auth: FirebaseService, private router: Router, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private fb: FormBuilder) {
    //this.shuffleCards();
    this.platform.backButton.subscribeWithPriority(1, () => {
      this.isModalOpen = false;
    });
  }
  accounts = [{ id: '1', label: 'Cuenta 1', foto: '../../assets/coco.png' }, { id: '2', label: 'Cuenta 2', foto: '../../assets/leon.png' }, { id: '3', label: 'Cuenta 3', foto: '../../assets/cebra.png' }];
  emailValue: string = "";
  passwordValue: string = "";
  Swal = require('sweetalert2');
  isModalOpen = false;
  canFlip: number = 0; // initialize the cooldown flag to true

  get email() {
    return this.formUser.get('email') as FormControl;
  }
  get password() {
    return this.formUser.get('password') as FormControl;
  }
  get dificultad() {
    return this.formUser.get('dificultad') as FormControl;
  }

  formUser = this.fb.group({
    'email':
      ["",
        [
          Validators.required,
          Validators.email,
          Validators.pattern('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')
        ]
      ],
    'password':
      ["",
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(12)
        ]
      ],
    'dificultad':
      ["",
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1)
        ]
      ]
  })


  ionViewDidEnter(
  ) {
    window.screen.orientation.lock('portrait');
    this.auth.dismissLoading();

  }

  setOpen(isOpen: boolean) {
    setTimeout(() => {
      this.isModalOpen = isOpen;
    }, 400);
    setTimeout(() => {
      this.isModalOpen = false;
    }, 200);
  }

  @ViewChild('accordionGroup') set accordionGroup(value: IonAccordionGroup) {
    if (value) {
      this.accordionGroup = value;
      // Access the accordionGroup here
    }
  }

  setDificultad(dificultad: number) {
    this.auth.setDificultad(dificultad);
  }
  
  async login() {
     this.auth.login(this.email.value,this.password.value,this.dificultad.value);
    this.isModalOpen = false;
   }
 
  
  async signup() {
    this.toastNotification("Llene ambos campos correo electronico y clave");
  }
  async toastNotification(mensaje: any) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position: 'middle',
      icon: 'alert-outline',
      color: 'danger'
    });
    (await toast).present();
  }
  clear() {
    this.formUser.reset();
  }
  async llenarUsuario(usuario: any) {
    switch (usuario) {
      case '1':
        this.email.setValue("eduardo@gmail.com");
        this.password.setValue("123456");
        break;
      case '2':
        this.email.setValue("admin@gmail.com");
        this.password.setValue("123456");
        break;
      case '3':
        this.email.setValue("cliente@gmail.com");
        this.password.setValue("123456");
        break;
    }

  }

  public cards = [
    { value: '../../assets/leon.png', show: false, use: true },
    { value: '../../assets/leon.png', show: false, use: true },
    { value: '../../assets/cebra.png', show: false, use: true },
    { value: '../../assets/cebra.png', show: false, use: true },
    { value: '../../assets/coco.png', show: false, use: true },
    { value: '../../assets/coco.png', show: false, use: true },

  ];



  flipCard(card: any) {
    if (card.show == false && this.canFlip < 2 && card.use) { // check if the card can be flipped
      card.show = true;
      this.canFlip++;
      const flippedCards = this.cards.filter(card => card.show && card.use);
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
  }

  ngOnInit() {
    this.loginPlay();
    this.isModalOpen = false;
  }



  shuffleCards() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
  async loginPlay() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.cards[i].show = true;
      this.cards[i].use = true;
    }
  }


}
