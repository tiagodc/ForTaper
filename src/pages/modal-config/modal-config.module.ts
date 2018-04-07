import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalConfigPage } from './modal-config';

@NgModule({
  declarations: [
    ModalConfigPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalConfigPage),
  ],
})
export class ModalConfigPageModule {}
