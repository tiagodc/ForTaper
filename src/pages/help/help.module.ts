import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { modelsHelp, distributionHelp, simulatorHelp } from './help';

@NgModule({
  declarations: [
    modelsHelp,
    distributionHelp,
    simulatorHelp
  ],
  imports: [
    IonicPageModule.forChild(modelsHelp),
  ],
})
export class HelpPageModule {}
