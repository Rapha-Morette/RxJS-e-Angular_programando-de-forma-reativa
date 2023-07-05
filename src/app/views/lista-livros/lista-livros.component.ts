import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  EMPTY,
  catchError,
  debounceTime,
  filter,
  map,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Item } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

const PAUSA = 300;
@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
})
export class ListaLivrosComponent {
  campoBusca = new FormControl();
  mensagemErro = '';

  constructor(private service: LivroService) {}

  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
    filter((valorDigitado) => valorDigitado.length >= 3),
    tap(() => console.log('Fluxo inicial')),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    tap((retornoApi) => console.log(retornoApi)),
    map((items) => this.livrosResultadoParaLivros(items)),
    catchError((erro) => {
      this.mensagemErro = 'Ops... Ocorreu um erro, recarregue a aplicação!';
      console.log(erro);
      return EMPTY;
      // return throwError(() => new Error(this.mensagemErro = "Ops... Ocorreu um erro, recarregue a aplicação!"))
    })
  );

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map((item) => {
      return new LivroVolumeInfo(item);
    });
  }
}
