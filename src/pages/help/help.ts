import { Component } from '@angular/core';

@Component({
  selector: 'models-help',
  template: `
  <ion-card>
    <ion-card-header>
      <ion-icon name="calculator" color="dark"></ion-icon>
      Taper
    </ion-card-header>
    
    <ion-card-content>
      Selecione um modelo de afilamento de tronco dentre os disponíveis. O modelo selecionado será utilizado pelo simulador para gerar árvores aleatórias, nas quais você poderá observar o formato e crescimento do fuste. Você pode alterar os parâmetros do modelo selecionado ou apenas utilizar os recomendados.

      <br><br>

      <b>Fontes</b>:
      <ion-list text-wrap>
          <ion-item>Thomas CE, Parresol BR (1991) Simple, flexible, trigonometric taper equations. Can. J. For. Res. 21</ion-item>
          <ion-item>Silva F, Corte APD, Sanquetta CR (2011) Equações de afilamento para descrever o volume total do fuste de <span style="font-style:italic">Pinus caribaea</span> var. hondurensis na região do Triângulo Mineiro. Sci. For. 39(91)</ion-item>
          <ion-item>Nunes MH, Görgens EB (2016) Artificial Intelligence Procedures for Tree Taper Estimation within a Complex Vegetation Mosaic in Brazil. PLoS ONE 11(5)</ion-item>
      </ion-list>
    </ion-card-content>
  </ion-card>
  `,
})
export class modelsHelp {}

@Component({
  selector: 'distribution-help',
  template: `
  <ion-card>
    <ion-card-header>
      <ion-icon name="stats" color="dark"></ion-icon>
      Distribuição
    </ion-card-header>
    
    <ion-card-content>
      Defina como se distribuem as variáveis altura total (Ht) e diâmetro a altura do peito (DAP) da floresta que você está simulando. Essas variáveis serão derivadas de distribuições Weibull, que são flexíveis e podem assumir formas de outras distribuições, como exponencial ou normal.
      <br><br>
      Você pode dar zoom em alguma região específica do gráfico arrastando o dedo sobre ele. Para retornar ao zoom inicial, dê dois cliques rápidos sobre o gráfico.
    </ion-card-content>
  </ion-card>
  `,
})
export class distributionHelp {}

@Component({
  selector: 'simulator-help',
  template: `
  <ion-card>
    <ion-card-header>
      <ion-icon name="cube" color="dark"></ion-icon>
      Simulador
    </ion-card-header>
    
    <ion-card-content>
      Sua parcela foi gerada! A forma do fuste e crescimento das árvores foram determinados pelo modelo escolhido na aba <b>Taper</b>, e suas dimensões foram determinadas por valores aleatórios gerados a partir das distribuições Weibull com os parâmetros escolhidos por você na aba <b>Distribuição</b>. Caso queira salvar ou compartilhar a nuvem de pontos da parcela (formato .xyz), clique no botão <b><ion-icon name="share"></ion-icon></b>.

      <br><br>

      Aqui você pode alterar alguns parâmetros da parcela simulada, como o espaçamento entre as árvores, percentual de falhas no plantio, intervalos de classes diamétricas para o sortimento da madeira.
      
      <br><br>

      Você pode também escolher se quer visualizar apenas uma árvore em 3D, assim é possível ver em detalhe o formato de fuste determinado pelo modelo de afilamento.
    </ion-card-content>
  </ion-card>
  `,
})
export class simulatorHelp {}