import { Injectable } from '@angular/core';
import * as katex from 'katex';

@Injectable()
export class ModelsProvider {

  defDap = 30;
  defHt = 25;
  step: number = 0.25;
  active: number = -1;
  plantioChanged = false;
  
  dwL: number = 25;
  dwK: number = 3.2;
  hwL: number = 21;
  hwK: number = 2.7;
  maxD = {K: 5, L: 50};
  maxH = {K: 5, L: 35};

  plantio = {
		spx: 150,
		spy: 150,
		nx: 4,
    ny: 4,
    falha: 0.05,
    dClasses: [10, 20, 30],
    singleTree: false,
		max(x: boolean){
			return ( x ? (this.spx * this.nx) : (this.spy * this.ny) ); 
    },
    area(){
      return (this.spx * this.spy / 10000 ) * (this.nx * this.ny);
    }
	}

  setDH(d, h){
    this.defDap = d;
    this.defHt = h;
  };

  dWeibull(x, k, l){
    let den = (k/l) * Math.pow(x/l, k-1) * Math.exp(-Math.pow(x/l, k));
    return den < 0 ? 0 : den;
  }

  modelsList: Array<Object> = [
    {
      author: 'Hojer',
      year: 1903,
      model: katex.renderToString("\\frac{ d_i }{ DAP } = \\beta_0 \\ln{ (\\frac{ \\beta_1 + \\frac{ Ht - h_i }{ Ht - 1.3 } }{ \\beta_2 } ) }"),
      coef: [
        {beta: katex.renderToString("\\beta_0 ="), val: 11.555168},
        {beta: katex.renderToString("\\beta_1 ="), val: 12.195512},
        {beta: katex.renderToString("\\beta_2 ="), val: 12.292301}
      ],
      parent: this,
      function(){
        let b0 = this.coef[0].val;
        let b1 = this.coef[1].val;
        let b2 = this.coef[2].val;

        let di: Array<Object> = [];
        for(let i = 0.01; i <= this.parent.defHt; i += this.parent.step){
          let z = (this.parent.defHt - i) / (this.parent.defHt - 1.3);
          let y = b0 * Math.log((b1 + z) / b2);
          let dt = y * this.parent.defDap;
          dt = (dt > 0 ? dt : 0);

          let volume = this.parent.step * Math.PI * Math.pow(dt/200 ,2);
          di.push({x: dt, y: i, vol: volume});
        }

        return di;
      }
    },
    {
      author: 'Schoepfer',
      year: 1966,
      model: katex.renderToString("\\frac{d_i}{DAP} = \\beta_0 + \\beta_1(\\frac{h_i}{Ht}) + \\beta_2(\\frac{h_i}{Ht})^2 + \\beta_3(\\frac{h_i}{Ht})^3 + \\beta_4(\\frac{h_i}{Ht})^4 + \\beta_5(\\frac{h_i}{Ht})^5"),
      coef: [
        {beta: katex.renderToString("\\beta_0 ="), val: 1.265997},
        {beta: katex.renderToString("\\beta_1 ="), val: -4.599033},
        {beta: katex.renderToString("\\beta_2 ="), val: 21.213937},
        {beta: katex.renderToString("\\beta_3 ="), val: -48.957316},
        {beta: katex.renderToString("\\beta_4 ="), val: 49.477496},
        {beta: katex.renderToString("\\beta_5 ="), val: -18.402643}
      ],
      parent: this,
      function(){
        let b0 = this.coef[0].val;
        let b1 = this.coef[1].val;
        let b2 = this.coef[2].val;
        let b3 = this.coef[3].val;
        let b4 = this.coef[4].val;
        let b5 = this.coef[5].val;

        let di: Array<Object> = [];
        for(let i = 0.01; i <= this.parent.defHt; i += this.parent.step){
          let ysq = b0 + b1*(i/this.parent.defHt) + b2*Math.pow(i/this.parent.defHt,2) + b3*Math.pow(i/this.parent.defHt,3) + b4*Math.pow(i/this.parent.defHt,4) + b5*Math.pow(i/this.parent.defHt,5);
          let dt = ysq * this.parent.defDap;
          dt = (dt > 0 ? dt : 0);

          let volume = this.parent.step * Math.PI * Math.pow(dt/200 ,2);
          di.push({x: dt, y: i, vol: volume});
        }

        return di;
        
      }
    },
    {
      author: 'Kozac et al.',
      year: 1969,
      model: katex.renderToString("(\\frac{d_i}{DAP})^2 = \\beta_0 + \\beta_1(\\frac{h_i}{Ht}) + \\beta_2(\\frac{h_i}{Ht})^2"),
      coef: [
        {beta: katex.renderToString("\\beta_0 ="), val: 1.389554},
        {beta: katex.renderToString("\\beta_1 ="), val: -2.660052},
        {beta: katex.renderToString("\\beta_2 ="), val: 1.308719}
      ],
      parent: this,
      function(){
        let b0 = this.coef[0].val;
        let b1 = this.coef[1].val;
        let b2 = this.coef[2].val;

        let di: Array<Object> = [];
        for(let i = 0.01; i <= this.parent.defHt; i += this.parent.step){
          let ysq = b0 + b1*(i/this.parent.defHt) + b2*Math.pow(i/this.parent.defHt,2);
          let dt = Math.sqrt(ysq) * this.parent.defDap;
          dt = (dt > 0 ? dt : 0);

          let volume = this.parent.step * Math.PI * Math.pow(dt/200 ,2);
          di.push({x: dt, y: i, vol: volume});
        }

        return di;
        
      }
    },
    {
      author: 'Demaerschalk',
      year: 1973,
      model: katex.renderToString("(\\frac{d_i}{DAP})^2 = 10^{2\\beta_0} DAP^{(2\\beta_1 - 2)} Ht^{2\\beta_2} (Ht - h_i)^{2\\beta_3}"),
      coef: [
        {beta: katex.renderToString("\\beta_0 ="), val: 0.131059},
        {beta: katex.renderToString("\\beta_1 ="), val: 0.892549},
        {beta: katex.renderToString("\\beta_2 ="), val: -0.700326},
        {beta: katex.renderToString("\\beta_3 ="), val: 0.749065}
      ],
      parent: this,
      function(){
        let b0 = this.coef[0].val;
        let b1 = this.coef[1].val;
        let b2 = this.coef[2].val;
        let b3 = this.coef[3].val;

        let di: Array<Object> = [];
        for(let i = 0.01; i <= this.parent.defHt; i += this.parent.step){
          let ysq = Math.pow(10, 2*b0) * Math.pow(this.parent.defDap / 100, 2*b1 - 2) * Math.pow(this.parent.defHt, 2*b2) * Math.pow(this.parent.defHt - i, 2*b3) ;
          let dt = Math.sqrt(ysq) * (this.parent.defDap / 100);
          dt *= 100;
          dt = (dt > 0 ? dt : 0);

          let volume = this.parent.step * Math.PI * Math.pow(dt/200 ,2);
          di.push({x: dt, y: i, vol: volume});
        }

        return di;
        
      }
    },
    {
      author: 'Ormerod',
      year: 1973,
      model: katex.renderToString("(\\frac{d_i}{DAP})^2 = (\\frac{Ht - h_i}{Ht - 1.3})^{2\\beta_1}"),
      coef: [
        {beta: katex.renderToString("\\beta_1 ="), val: 0.746463},
      ],
      parent: this,
      function(){
        let b1 = this.coef[0].val;

        let di: Array<Object> = [];
        for(let i = 0.01; i <= this.parent.defHt; i += this.parent.step){
          let ysq = Math.pow((this.parent.defHt - i) / (this.parent.defHt - 1.3), 2*b1);
          let dt = Math.sqrt(ysq) * this.parent.defDap;
          dt = (dt > 0 ? dt : 0);

          let volume = this.parent.step * Math.PI * Math.pow(dt/200 ,2);
          di.push({x: dt, y: i, vol: volume});
        }

        return di;
        
      }
    },
    {
      author: 'Biging',
      year: 1984,
      model: katex.renderToString("\\frac{d_i}{DAP} = \\beta_0 + \\beta_1 \\ln{ (1 - ( \\frac{h_i}{Ht} )^{ \\frac{1}{3} } (1 - e^{ \\frac{-\\beta_0}{\\beta_1} }))}"),
      coef: [
        {beta: katex.renderToString("\\beta_0 ="), val: 0.92081},
        {beta: katex.renderToString("\\beta_1 ="), val: 0.26296}
      ],
      parent: this,
      function(){
        let b0 = this.coef[0].val;
        let b1 = this.coef[1].val;
        
        let di: Array<Object> = [];
        for(let i = 0.01; i <= this.parent.defHt; i += this.parent.step){
          let ysq = b0 + b1 * Math.log(1 - Math.pow(i / this.parent.defHt, 1/3) * (1 - Math.exp(-b0/b1) ) );
          let dt = ysq * this.parent.defDap;
          dt = (dt > 0 ? dt : 0);

          let volume = this.parent.step * Math.PI * Math.pow(dt/200 ,2);
          di.push({x: dt, y: i, vol: volume});
        }

        return di;
        
      }
    },
    {
      author: 'Baldwin Jr & Feduccia',
      year: 1991,
      model: katex.renderToString("\\frac{d_i}{DAP} = \\beta_0 + \\beta_1 \\ln{(1 - (1 - e^{-\\beta_0\\beta_1^{-1}}))} (\\frac{h_i}{Ht})^{(\\frac{1}{3})}"),
      coef: [
        {beta: katex.renderToString("\\beta_0 ="), val: 1.289897},
        {beta: katex.renderToString("\\beta_1 ="), val: 0.472066}
      ],
      parent: this,
      function(){
        let b0 = this.coef[0].val;
        let b1 = this.coef[1].val;

        let di: Array<Object> = [];
        for(let i = 0.01; i <= this.parent.defHt; i += this.parent.step){
          let ysq = b0 + b1 * (Math.log( 1 - (1 - Math.exp(-b0*(1/b1)))) * Math.pow(i / this.parent.defHt, 1/3));
          let dt = ysq * this.parent.defDap;
          dt = (dt > 0 ? dt : 0);

          let volume = this.parent.step * Math.PI * Math.pow(dt/200 ,2);
          di.push({x: dt, y: i, vol: volume});
        }

        return di;
        
      }
    },
    {
      author: 'Thomas & Parresol',
      year: 1991,
      model: katex.renderToString("(\\frac{d_i}{DAP})^2 = \\beta_1 ( \\frac{h_i}{Ht} - 1 ) + \\beta_2 \\sin{( \\gamma \\pi \\frac{h_i}{Ht} )} + \\beta_3 \\cotg{( \\pi \\frac{h_i}{2Ht} )}"),
      coef: [
        {beta: katex.renderToString("\\beta_1 ="), val: -0.662},
        {beta: katex.renderToString("\\beta_2 ="), val: 0.0278},
        {beta: katex.renderToString("\\beta_3 ="), val: 0.004},
        {beta: katex.renderToString("\\gamma ="), val: 1.5}
      ],
      parent: this,
      function(){
        let b1 = this.coef[0].val;
        let b2 = this.coef[1].val;
        let b3 = this.coef[2].val;
        let g  = this.coef[3].val;

        let di: Array<Object> = [];
        for(let i = 0.01; i <= this.parent.defHt; i += this.parent.step){
          let ysq = b1 * ( (i / this.parent.defHt)  -1 ) + b2*Math.sin( g * Math.PI * (i / this.parent.defHt))  + b3 / Math.tan( Math.PI * (i / (this.parent.defHt * 2)));
          let dt = Math.sqrt(ysq) * this.parent.defDap;
          dt = (dt > 0 ? dt : 0);

          let volume = this.parent.step * Math.PI * Math.pow(dt/200 ,2);
          di.push({x: dt, y: i, vol: volume});
        }

        return di;
        
      }
    },
    {
      author: 'Garcia et al.',
      year: 1993,
      model: katex.renderToString("(\\frac{d_i}{DAP})^2 = \\beta_0 + \\beta_1 \\sqrt{\\frac{h_i}{Ht}} + \\beta_2 (\\frac{h_i}{Ht})"),
      coef: [
        {beta: katex.renderToString("\\beta_0 ="), val: 1.652641},
        {beta: katex.renderToString("\\beta_1 ="), val: -2.093439},
        {beta: katex.renderToString("\\beta_2 ="), val: 0.449146}
      ],
      parent: this,
      function(){
        let b0 = this.coef[0].val;
        let b1 = this.coef[1].val;
        let b2 = this.coef[2].val;

        let di: Array<Object> = [];
        for(let i = 0.01; i <= this.parent.defHt; i += this.parent.step){
          let ysq = b0 + b1 * Math.sqrt(i / this.parent.defHt) + b2*(i / this.parent.defHt);
          let dt = Math.sqrt(ysq) * this.parent.defDap;
          dt = (dt > 0 ? dt : 0);

          let volume = this.parent.step * Math.PI * Math.pow(dt/200 ,2);
          di.push({x: dt, y: i, vol: volume});
        }

        return di;
        
      }
    },
    {
      author: 'Leite & Garcia',
      year: 2001,
      model: katex.renderToString("(\\frac{d_i}{DAP})^2 = 10^{2\\beta_0} DAP^{(2\\beta_1 - 2)} Ht^{2\\beta_2} (Ht - h_i)^{2\\beta_3} e^{\\beta_4 (\\frac{1}{DAP})}"),
      coef: [
        {beta: katex.renderToString("\\beta_0 ="), val: 0.128170},
        {beta: katex.renderToString("\\beta_1 ="), val: 0.894138},
        {beta: katex.renderToString("\\beta_2 ="), val: -0.700252},
        {beta: katex.renderToString("\\beta_3 ="), val: 0.749065},
        {beta: katex.renderToString("\\beta_4 ="), val: 0.132498}
      ],
      parent: this,
      function(){
        let b0 = this.coef[0].val;
        let b1 = this.coef[1].val;
        let b2 = this.coef[2].val;
        let b3 = this.coef[3].val;
        let b4 = this.coef[4].val;

        let di: Array<Object> = [];
        for(let i = 0.01; i <= this.parent.defHt; i += this.parent.step){
          let ysq = Math.pow(10, 2*b0) * Math.pow( this.parent.defDap / 100, 2*b1 - 2) * Math.pow(this.parent.defHt, 2*b2) * Math.pow(this.parent.defHt - i, 2*b3) * Math.exp(b4 * (1/this.parent.defDap / 100));
          let dt = Math.sqrt(ysq) * (this.parent.defDap / 100);
          dt *= 100;
          dt = (dt > 0 ? dt : 0);

          let volume = this.parent.step * Math.PI * Math.pow(dt/200 ,2);
          di.push({x: dt, y: i, vol: volume});
        }

        return di;
        
      }
    }
  ];

  dRange;
  hRange;
  fillSorted(){
    this.dRange = [];
    this.hRange = []; 
    for(let i = 0, j = 0; i < 80; i++, j++){
      let dd = this.dWeibull(i, this.dwK, this.dwL);
      let hd = this.dWeibull(j, this.hwK, this.hwL);

      this.dRange.push({ den: dd, qtl: i });
      this.hRange.push({ den: hd, qtl: j });
    }
  }

  constructor() {}

}
