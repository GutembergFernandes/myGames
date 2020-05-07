import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as $ from 'jquery';

// Importa a classe GameForm
import { GameForm } from '../classes/game-form';

///// 2) Importa componente de roteamento do Angular vvvv 3 construtor vvvv
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})

export class FormComponent implements OnInit {

  // Declara objeto de formulário
  gameForm: GameForm = new GameForm();

  // Armazena os nomes das plataformas
  platforms: Observable<any[]> = this.db.collection('platforms', (ref) => ref.orderBy('name')).valueChanges();

  ///// 1) Variável com ID do documento ^^^^ 2 import ^^^^
  id: string = this.route.snapshot.paramMap.get('id');

  constructor(

    private db: AngularFirestore,

    ///// 3) Routamentos  vvvv 4 ngOnInit vvvv
    private route: ActivatedRoute,
    private router: Router

  ) { }

  ngOnInit(): void {

    // jQuery 01) Responsividade da ajuda (aside)
    jQuery(() => {

      // jQuery 03) Se houver redimensionamento
      $(window).on('resize', () => {
        if (window.innerWidth > 539) {
          $('aside').show(0);
        }
        else {
          $('aside').hide(0);
        }
      });
    });

    ///// 4) Se tem Id, obtém dados do Db
    if (this.id !== null) {

      ///// 5) Escreve o Id no form
      this.gameForm.id = this.id;

      ///// 6) Acesso ao Db
      this.db.collection<any>('games').doc(this.id).ref.get().then(
        (doc) => {
          if (doc.exists) {

            ///// 7) Atribui dados recebidos aos campos do form
            this.gameForm.id = doc.id;
            this.gameForm.cover = doc.data().cover;
            this.gameForm.date = doc.data().date;
            this.gameForm.description = doc.data().description;
            this.gameForm.media = doc.data().media;
            this.gameForm.platform = doc.data().platform;
            this.gameForm.title = doc.data().title;

            ///// 8) Se não encontrou o documento...
          } else {

            ///// 9) Feedback ao usuário
            alert('Documento não encontrado!\nClique em [Ok] para continuar...');

            ///// 10) Retorna para a listagem
            this.router.navigate(['/list']);
          }
        }

        ///// 11) Se houve falha na busca do documento
      ).catch(
        (error) => {

          ///// 12) Mensagem de erro no console
          console.error('Falha ao obter documento:', error);
        }
      );
    }
  }

  // Método que processa o formulário
  onSubmit() {
    // console.log(this.gameForm);

    // Se não identificou um documento pelo id, cria documento
    if (this.gameForm.id === undefined) {

      // Gravar dados no banco
      this.db.collection<any>('games').add({ ...this.gameForm })

        // Se conseguiu criar...
        .then(() => {

          // Feedback que salvou novo documento
          alert(`Jogo "${this.gameForm.title}" adicionado com sucesso!\n\nClique em [Ok] para continuar.`);

          // Limpa os campos para novos dados
          this.gameForm = new GameForm();

          // Sai sem fazer nada
          return false;
        })

        // Em caso de erro ao gravar...
        .catch((err) => {

          // Exibe erro no console
          console.error(err);
        });

      // Se tem um id, está editando documento existente
    } else {

      // console.log('Editando', this.gameForm);

      ///// 13) Atualizando Db com dados do form usando método set()
      this.db.collection<any>('games').doc(this.id).set(

        // 13) Obtendo dados do form e atribuindo ao DB
        {
          cover: this.gameForm.cover,
          date: this.gameForm.date,
          description: this.gameForm.description,
          media: this.gameForm.media,
          platform: this.gameForm.platform,
          title: this.gameForm.title
        }

        ///// 14) Se atualizou o documento
      ).then(
        () => {

          ///// 15) Feedback para o usuário
          alert(`"${this.gameForm.title}" atualizado com sucesso!\n\nClique em [Ok] para continuar.`);

          ///// 16) Retorna para a listagem de jogos
          this.router.navigate(['/list']);
        }

        ///// 17) Se não conseguiu, retorna erro
      ).catch(
        (err) => {

          ///// 18) Exibe erro no console
          console.error(err);
        }
      );

    }
  }

  // Oculta / exibe ajuda
  helpToggle() {

    // jQuery 02) toggle da ajuda
    jQuery(() => {
      if ($('aside').is(':visible')) {
        this.helpHide();
      } else {
        this.helpShow();
      }
    });
    return false;
  }

  // Oculta ajuda
  helpHide() {
    $('aside').slideUp('fast');
  }

  // Mostra ajuda
  helpShow() {
    $('aside').slideDown('fast');
  }

  // Oculta ajuda em resoluções menores
  hideAside() {
    if (window.innerWidth < 540) {
      this.helpHide();
    }
  }

}
