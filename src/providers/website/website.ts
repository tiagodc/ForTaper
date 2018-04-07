import { Injectable } from '@angular/core';
import { InAppBrowser , InAppBrowserOptions } from '@ionic-native/in-app-browser';

@Injectable()
export class WebsiteProvider {

  constructor(private iab: InAppBrowser) {
  }

  options : InAppBrowserOptions = {
    location : 'yes',//Or 'no' 
    hidden : 'no', //Or  'yes'
    clearcache : 'yes',
    clearsessioncache : 'yes',
    zoom : 'yes',//Android only ,shows browser zoom controls 
    hardwareback : 'yes',
    mediaPlaybackRequiresUserAction : 'no',
    shouldPauseOnSuspend : 'no', //Android only 
    closebuttoncaption : 'Close', //iOS only
    disallowoverscroll : 'no', //iOS only 
    toolbar : 'yes', //iOS only 
    enableViewportScale : 'no', //iOS only 
    allowInlineMediaPlayback : 'no',//iOS only 
    presentationstyle : 'pagesheet',//iOS only 
    fullscreen : 'yes',//Windows only    
  };

  navigate(){
    let target = "_system";
    let url = "https://www.forlidar.com.br/";
    this.iab.create(url,target, this.options);
  }
}
