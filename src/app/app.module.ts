import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ModalConfigPage } from '../pages/modal-config/modal-config';
import { modelsHelp, distributionHelp, simulatorHelp } from '../pages/help/help';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';

import { ModelsProvider } from '../providers/models/models';
import { PipesModule } from '../pipes/pipes.module';
import { WebsiteProvider } from '../providers/website/website';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    ModalConfigPage,
    modelsHelp,
    distributionHelp,
    simulatorHelp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    ModalConfigPage,
    modelsHelp,
    distributionHelp,
    simulatorHelp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    InAppBrowser,
    File,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ModelsProvider,
    WebsiteProvider
  ]
})
export class AppModule {}
