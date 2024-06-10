import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api-service';
import { IonSearchbar, IonInfiniteScroll } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; // Importa o FormsModule

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  mostrarConteudo!: string;
  dadosApi!: ApiService;
  artes: any[] = [];
  busca: string = '';
  currentPage: number = 1; // Variável para armazenar a página atual

  @ViewChild(IonSearchbar, { static: false }) searchbar!: IonSearchbar;
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {
    this.route.queryParams.subscribe(params => {
      this.mostrarConteudo = params['mostrar'] || '1';
      this.busca = params['busca'] || ''; // Obtenha o valor de busca dos parâmetros da rota
      this.carregarDados(true); // Carregar dados automaticamente ao iniciar
    });
  }

  ngOnInit() {
    this.artes = [];
  }

  onSearch(event: any) {
    this.busca = event.target.value.trim();
    this.currentPage = 1; // Reseta para a primeira página na nova busca
    this.carregarDados(true); // Passe true para resetar os dados
  }

  carregarDados(reset: boolean = false) {
    let endpoint = '';
    const searchQuery = this.busca.trim() === '' ? 'Yan Gay' : this.busca;

    switch (this.mostrarConteudo) {
      case '2':
        endpoint = `object?person==${searchQuery}&`;
        break;
      case '3':
        endpoint = `object?q=culture:${searchQuery}&`;
        break;
      case '4':
        endpoint = `Object?q=title:${searchQuery}&`;
        break;
      case '5':
        endpoint = `object?q=classification:${searchQuery}&`;
        break;
      default:
        endpoint = `object?person==${searchQuery}&`;
        break;
    }

    this.apiService.getData(endpoint, this.currentPage).subscribe(data => {
      if (reset) {
        this.artes = data.records; // Reseta a lista de artes
      } else {
        this.artes = this.artes.concat(data.records); // Adiciona novos registros à lista existente
      }
      console.log(this.artes);
      console.log(endpoint);
      if (data.records.length === 0) {
        this.infiniteScroll.disabled = true; // Desativa o scroll infinito se não houver mais dados
      } else {
        this.infiniteScroll.complete(); // Completa a ação de scroll infinito
      }
    });
  }

  loadMoreData(event: any) {
    this.currentPage++;
    console.log(this.currentPage);
    this.carregarDados();
  }

  atualizarMostrarConteudo(valor: string) {
    this.mostrarConteudo = valor;
    if (valor === '1') {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {}
      });
    } else {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { mostrar: valor },
        queryParamsHandling: 'merge'
      });
      this.carregarDados(true); // Recarregar dados ao mudar o conteúdo
    }
  }
}