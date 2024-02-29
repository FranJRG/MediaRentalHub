import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.css'
})
export class SearchBoxComponent {

  //Emitimos un evento
  @Output() onSearch : EventEmitter<string> = new EventEmitter();

  //Creamos un título
  title : string = "";

  //Pasamos este titulo a través de el evento
  search(){
    this.onSearch.emit(this.title);
  }

}
