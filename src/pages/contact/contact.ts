import { Component } from '@angular/core';
import { LoadingController, NavController, AlertController, ModalController } from 'ionic-angular';
import { ModelsProvider } from "../../providers/models/models";
import { ModalConfigPage } from '../../pages/modal-config/modal-config';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { WebsiteProvider } from '../../providers/website/website'

import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';

import * as Plotly from '../../assets/plotly-latest.min.js';
import {jStat} from 'jStat';
import * as katex from 'katex';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(public navCtrl: NavController, public models: ModelsProvider, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl: ModalController, private screenOrientation: ScreenOrientation, public web: WebsiteProvider, private file: File, private social: SocialSharing) {

	this.screenOrientation.onChange().subscribe( () =>{
		setTimeout(() => {
			Plotly.Plots.resize('myDiv');
		}, 200)
	});

	setInterval(() => { this.monitorChanges() }, 500);

  } 
  
	openConfigModal() {
		let myModal = this.modalCtrl.create(ModalConfigPage);
		myModal.present();
	}

	loader: any;
	waitForPlot: boolean = true;
	load(start: boolean){
		
		if(start){
			this.waitForPlot = true;

			this.loader = this.loadingCtrl.create({
				content: 'Simulando parcela...'
			});

			this.loader.present();
		}else{
			this.loader.dismiss();
			this.loader = null;
		}
	}
  
	plotData = {
		x: [], y: [], z: [], 
		opacity: 1,
		type: 'scatter3d',
		mode: 'lines+markers',
		color:'Earth',
		lighting:{
			ambient: 1,
			diffuse: 1
		},
		marker: {
			size: 0.5,
			opacity: 1
		}
	};

	plotSet;

	layout = {
		scene:{
			aspectmode: "manual",
			aspectratio: { x: 1, y: 1, z: 1.2},
			xaxis: {range: [], autorange: true },
			yaxis: {range: [], autorange: true },
			zaxis: {range: [], autorange: true },
		},
		margin: { l: 0, r: 0, b: 25, t: 0 },
		showlegend: false
	};

	updateModel(randomize = false){

		if(randomize){
			let dWeib = jStat.weibull.sample(this.models.dwL, this.models.dwK);
			
			this.models.defDap = dWeib;

			let hDens = this.models.hRange.map(res => res.den);
			let hMaxIndex = hDens.indexOf(Math.max(...hDens));

			let iMin = (hMaxIndex - 10) < 0 ? 0 : (hMaxIndex - 10);
			let iMax = (hMaxIndex + 10) >= hDens.length ? hDens.length :  (hMaxIndex + 10);

			let hMin = this.models.hRange.map(q => q.qtl)[iMin];
			let hMax = this.models.hRange.map(q => q.qtl)[iMax];

			let hWeib;
			do{
				hWeib = jStat.weibull.sample(this.models.hwL, this.models.hwK);
			}while(hWeib < hMin || hWeib > hMax);

			this.models.defHt = hWeib;
		}else{
			let hDens = this.models.hRange.map(res => res.den);
			let hMaxIndex = hDens.indexOf(Math.max(...hDens));
			this.models.defHt = this.models.hRange.map(q => q.qtl)[hMaxIndex];

			let dDens = this.models.dRange.map(res => res.den);
			let dMaxIndex = dDens.indexOf(Math.max(...dDens));
			this.models.defDap = this.models.dRange.map(q => q.qtl)[dMaxIndex];
		}

		let data;
		data = this.models.modelsList[ this.models.active ];
		return data.function();
	}

	volumes: Array<Array<number>>;
	plot3d(single: boolean = false){

		this.plotSet = [];
		this.volumes = [];
		let classified = [0,0,0,0];

		// let zpan = this.models.hRange.map(x => x.den);
		// let zind = zpan.indexOf(Math.max(...zpan));
		// let zval = this.models.hRange.map(x => x.qtl)[zind];

		if(single){
			this.layout.scene.xaxis.range = [-100, 100];
			this.layout.scene.yaxis.range = [-100, 100];
			// this.layout.scene.zaxis.range = [0, zval];

			this.layout.scene.xaxis.autorange = false;
			this.layout.scene.yaxis.autorange = false;
			// this.layout.scene.zaxis.autorange = false;

		}else{
			// let xpan = this.models.plantio.max(true);
			// let ypan = this.models.plantio.max(false);

			delete this.layout.scene.xaxis.range;
			delete this.layout.scene.yaxis.range;
			// delete this.layout.scene.zaxis.range;

			this.layout.scene.xaxis.autorange = true;
			this.layout.scene.yaxis.autorange = true;
			// this.layout.scene.zaxis.autorange = true;
		}
	
		let nx = 0;
		outerLoop: while(nx < this.models.plantio.max(true)){
			let ny = 0;
			innerLoop: while(ny < this.models.plantio.max(false)){

				let toss = Math.random();
				if(!single && toss <= this.models.plantio.falha){
					ny += this.models.plantio.spy;
					continue innerLoop;
				}

				let data = this.updateModel(!this.models.plantio.singleTree);
				let x2d = data.map(xy => xy.x);
				let y2d = data.map(xy => xy.y);

				let volume = data.map(xy => xy.vol);
				this.volumes.push( volume );

				let classVols = this.classVolume(data);
				classVols.forEach( (val, i) => {
					classified[i] += val;
				});

				let x3d = [];
				let y3d = [];
				let z3d = [];
				// let intensity = [];
				// let tempInt = 0;

				for(let i = 0; i < x2d.length; ++i){
					let z = y2d[i];
					// tempInt = (y2d.length - i) / y2d.length;

					for(let j = 0; j < 360; j += 20){
						let y = x2d[i] * Math.sin( j * Math.PI / 180 );
						let x = x2d[i] * Math.cos( j * Math.PI / 180 );
						
						x3d.push(x + nx);
						y3d.push(y + ny);
						z3d.push(z);
						// intensity.push(tempInt);
					}
				}
				
				this.plotData.x = x3d;
				this.plotData.y = y3d;
				this.plotData.z = z3d;
				// this.plotData.intensity = intensity;

				this.plotSet.push( Object.assign({}, this.plotData) );

				if(single) break outerLoop;

				ny += this.models.plantio.spy;
			}
			nx += this.models.plantio.spx;
		}

		this.totalVolume(single);
		this.viewVolumes.sort = classified.map(
			x => (100 * x / Number(this.viewVolumes.total) ).toFixed(1)
		);

		Plotly.react('myDiv', this.plotSet, this.layout).then(
			x => {
				this.waitForPlot = false;
				setTimeout(()=>{
					Plotly.Plots.resize('myDiv').then(
						y => this.load(false)
					)
				}, 100);
			}
		);
	}

	viewVolumes = {total: null, ci: null, sort: []};
	totalVolume(single: boolean){
		let sum = (a, b) => (a + b);

		let treeWise = this.volumes.map( vol => vol.reduce(sum) );
		let plotWise = treeWise.reduce(sum);

		let ci = jStat.normalci(plotWise, 0.05, treeWise);
		let err = plotWise - ci[0];

		let volPerHa = plotWise * 10000 / this.models.plantio.area();
		let errPerHa = err * 10000 / this.models.plantio.area();

		if(single){
			this.viewVolumes.total = plotWise.toFixed(2);
		}else{
			this.viewVolumes.total = volPerHa.toFixed(2);
		}

		this.viewVolumes.ci = errPerHa.toFixed(2);

	}

	treeClassVolume(data, min, max){
		let filt = data.filter(xyv => (xyv.x >= min && xyv.x < max) );
		
		if(filt.length === 0) return 0;

		return filt.map(x => x.vol).reduce( (a, b) => a + b );
	}

	classVolume(data){

		let dLims = this.models.plantio.dClasses.slice();
		dLims.unshift(0);
		dLims.push(9999);

		let allVols = [];
		for(let i = 1; i < dLims.length; ++i){
			let d0 = dLims[i-1];
			let d1 = dLims[i];

			let tVol = this.treeClassVolume(data, d0, d1);
		 	if(!this.models.plantio.singleTree) tVol *= (10000 / this.models.plantio.area());
			allVols.push( tVol );
		}

		return allVols;
		
	}

	viewAssortments = [];
	viewVolume;
	writeAssortments(single: boolean){
			
		let c1 = 'V_{ol\\space d \\space \\lt \\space' + this.models.plantio.dClasses[0] + '\\space cm} = ' + this.viewVolumes.sort[0] + '\\%';

		c1 = katex.renderToString(c1);

		let c2 = 'V_{ol\\space '+ this.models.plantio.dClasses[0] +'\\space \\leq \\space d \\space \\lt \\space'+ this.models.plantio.dClasses[1] +'\\space cm} = ' + this.viewVolumes.sort[1] + '\\%';

		c2 = katex.renderToString(c2);

		let c3 = 'V_{ol\\space '+ this.models.plantio.dClasses[1] +'\\space \\leq \\space d \\space \\lt \\space'+ this.models.plantio.dClasses[2] +'\\space cm} = ' + this.viewVolumes.sort[2] + '\\%';

		c3 = katex.renderToString(c3);

		let c4 = 'V_{ol\\space d \\space \\geq \\space'+ this.models.plantio.dClasses[2] +'\\space cm} = ' + this.viewVolumes.sort[3] + '\\%';

		c4 = katex.renderToString(c4);
		
		this.viewAssortments = [c1, c2, c3, c4];

		let vol = 'V_{oltotal} = ' + this.viewVolumes.total;
		vol += single ? '\\space m^3' : ' ± ' + this.viewVolumes.ci + '\\space m^3/ha';

		vol = katex.renderToString(vol);

		this.viewVolume = vol;

	}

	monitorChanges(){
		let change = this.models.plantioChanged;
		console.log(change);
		if(change){
			this.renderPlot();
			this.models.plantioChanged = false;
		}
	}

	renderPlot(){
		this.models.fillSorted();
		this.load(true);

		setTimeout(() =>{
			this.plot3d(this.models.plantio.singleTree);
			this.writeAssortments(this.models.plantio.singleTree);
			console.log(this.plotSet);
		}, 200);
	}

	ionViewWillEnter(){

		if(this.models.active === -1){
			let alert = this.alertCtrl.create({
			  title: "Oops...",
			  message: 'Selecione um modelo de afilamento.',
			  buttons: [{
				  text: 'Ok',
				  handler: () => {
					this.navCtrl.parent.select(0);
				  }
				}]
			});
			
			alert.present();
			
			return;
		}

		this.renderPlot();
	}

	makeFile(){
	
	  let cloudString: string = '';
	  for(let i = 0; i < this.plotSet.length; ++i){
		  let temp = this.plotSet[i];
		  for(let j = 0; j < temp.x.length; ++j){
			cloudString += (temp.x[j]/100) + ' ' + (temp.y[j]/100) + ' ' + temp.z[j] + "\n";
		  }
	  }

	  this.file.writeFile(this.file.dataDirectory, 'pcd.xyz', cloudString, {replace:true}).then(x => {		
		this.social.share('nuvem de pontos', 'parcela.xyz', this.file.dataDirectory + 'pcd.xyz').then(x => console.log('cool')).catch(err => console.log('not cool...'))
	  })
	}


}
