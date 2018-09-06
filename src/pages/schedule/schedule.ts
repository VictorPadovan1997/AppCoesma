import { Component, ViewChild } from '@angular/core';

import { AlertController, App, FabContainer, ItemSliding, List, ModalController, NavController, ToastController, LoadingController, Refresher } from 'ionic-angular';


import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';

import { SessionDetailPage } from '../session-detail/session-detail';
import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';


@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html'
})
export class SchedulePage {
//exportar pagina dos POSTS 
// POST NOS ARQUIVOS JSON 
  @ViewChild('scheduleList', { read: List }) scheduleList: List;

  dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks: any = [];
  shownSessions: any = [];
  groups: any = [];
  confDate: string;

  constructor(
    public alertCtrl: AlertController,
    public app: App,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public confData: ConferenceData,
    public user: UserData,
  ) {}

  ionViewDidLoad() {
    this.app.setTitle('Schedule');
    this.updateSchedule();
  }

  updateSchedule() {
    //SLIDE
    this.scheduleList && this.scheduleList.closeSlidingItems();

    this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).subscribe((data: any) => {
      this.shownSessions = data.shownSessions;
      this.groups = data.groups;
    });
  }

  presentFilter() {
    let modal = this.modalCtrl.create(ScheduleFilterPage, this.excludeTracks);
    modal.present();

    modal.onWillDismiss((data: any[]) => {
      if (data) {
        this.excludeTracks = data;
        this.updateSchedule();
        // ANY COMO PAGINA ROOT
      }
    });

  }

  goToSessionDetail(sessionData: any) {
 //ENTRAR NA PAGINA 

    this.navCtrl.push(SessionDetailPage, { sessionId: sessionData.id, name: sessionData.name });
  }

  addFavorite(slidingItem: ItemSliding, sessionData: any) {

    if (this.user.hasFavorite(sessionData.name)) {
     //ADICIONANDO A LISTA FAVORITOS 
      this.removeFavorite(slidingItem, sessionData, 'Favorite already added');
    } else {
      // RELEMBRAR SEÇÃO SUARIO FAVORITOS 
      this.user.addFavorite(sessionData.name);

      // CRIANDO NOVO ALERTA
      let alert = this.alertCtrl.create({
        title: 'Enquadramento Adicionado a Lista Favoritos',
        buttons: [{
          text: 'OK',
          handler: () => {
            // Sair do SLIDE DO ITEM 
            slidingItem.close();
          }
        }]
      });
      // Novo content
      alert.present();
    }

  }

  removeFavorite(slidingItem: ItemSliding, sessionData: any, title: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: 'Deseja remover da sua Lista ? ',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            //clicar botão cancelar 
            //Sair ITEM BOTÃO
            slidingItem.close();
          }
        },
        {
          text: 'Remover',
          handler: () => {
           // função para remover dos favoritos 
            this.user.removeFavorite(sessionData.name);
            this.updateSchedule();

            //sAIR DO BOTÃO
            slidingItem.close();
          }
        }
      ]
    });
    //Novo ALERTA
    alert.present();
  }

  openSocial(network: string, fab: FabContainer) {
    let loading = this.loadingCtrl.create({
      content: `Posting to ${network}`,
      duration: (Math.random() * 1000) + 500
    });
    loading.onWillDismiss(() => {
      fab.close();
    });
    loading.present();
  }

  doRefresh(refresher: Refresher) {
    this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).subscribe((data: any) => {
      this.shownSessions = data.shownSessions;
      this.groups = data.groups;

      //PLUGIN JSON
      setTimeout(() => {
        refresher.complete();

        const toast = this.toastCtrl.create({
          message: 'As sessões foram atualizadas.',
          duration: 3000
        });
        toast.present();
      }, 1000);
    });
  }
}
