import { Component } from '@angular/core';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-create-channel',
  templateUrl: './create-channel.component.html',
  styleUrls: ['./create-channel.component.scss']
})
export class CreateChannelComponent {
  err_hash:boolean = false

  constructor(private navbarService: NavbarService){}

  checkInputChannel(){
    const input:any = document.getElementById('create-channel');
    let inputValue = input.value;
    let sliceFirst = inputValue.slice(0,1);
    if(inputValue === ''){
      this.err_hash = false;
    }else if(sliceFirst != '#'){
      this.errorInput();
    }else{
      this.err_hash = false;
      let sliceSecond = inputValue.slice(1);
      console.log('sliceFirst: ', sliceSecond);
    }
  }

  /*
  get nameForm() {
    return this.signUpForm.get('nameForm');
  }
  oder 
  @ViewChild
*/

  errorInput(){
    this.err_hash = true;
    return console.error('Error forgot hashtag "#"');
  }

  openMenu(){
    this.navbarService.menuSlideUp('menuCreateChannel');
  }

}
