import { Component } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';
import { ModelsProvider } from "../../providers/models/models";
import { WebsiteProvider } from '../../providers/website/website';
import { modelsHelp } from '../../pages/help/help';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public models: ModelsProvider, public web: WebsiteProvider, public popOver: PopoverController) {
  }

  showHelp(ev: UIEvent) {
    let popover = this.popOver.create(modelsHelp);

    popover.present({
      ev: ev
    });
  }

  tapCard(ind){
    this.models.active = (ind === this.models.active) ? -1 : ind;
  }

  classCard(ind){
    return (ind === this.models.active) ? "cardBorder" : "";
  }

}
