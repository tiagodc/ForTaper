import { Injectable } from '@angular/core';
import * as katex from 'katex';

@Injectable()
export class ModelsProvider {

  defDap = 30;
  defHt = 25;
  step: number = 0.5;
  active: number = -1;
  
  dwL: number = 30;
  dwK: number = 3.5;
  hwL: number = 22;
  hwK: number = 3;

  weibull(a,c){var b=1-Math.random();return a*Math.pow(-Math.log(b),1/c)};

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
      dap: this.defDap,
      h: this.defHt,
      step: this.step,
      function(){
        let b0 = this.coef[0].val;
        let b1 = this.coef[1].val;
        let b2 = this.coef[2].val;

        let di: Array<Object> = [];
        for(let i = 0.01; i <= this.h; i += this.step){
          let z = (this.h - i) / (this.h - 1.3);
          let y = b0 * Math.log((b1 + z) / b2);
          let dt = y * this.dap;
          dt = (dt > 0 ? dt : 0);
          di.push({x: dt, y: i});
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
      dap: this.defDap,
      h: this.defHt,
      step: this.step,
      function(){
        let b0 = this.coef[0].val;
        let b1 = this.coef[1].val;
        let b2 = this.coef[2].val;

        let di: Array<Object> = [];
        for(let i = 0.01; i <= this.h; i += this.step){
          let ysq = b0 + b1*(i/this.h) + b2*Math.pow(i/this.h,2);
          let dt = Math.sqrt(ysq) * this.dap;
          dt = (dt > 0 ? dt : 0); 
          di.push({x: dt, y: i});
        }

        return di;
        
      }
    }
  ];

  dRange;
  hRange;
  fillRandom(){
    let i = 0;     
    while(i < 500){
      this.dRange.push( this.weibull(this.dwL, this.dwK) );
      this.hRange.push( this.weibull(this.hwL, this.hwK) );
      i++;
    }
  };

  fillSorted(){
    this.dRange = [];
    this.hRange = []; 
    for(let i = 0, j = 0; i < 100; i++, j+=0.5){
      let dd = this.dWeibull(i, this.dwK, this.dwL);
      let hd = this.dWeibull(j, this.hwK, this.hwL);

      this.dRange.push({ den: dd, qtl: i });
      this.hRange.push({ den: hd, qtl: j });
    }
  }

  constructor() {}

}
