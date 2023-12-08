import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit {
  animationToLeft = false;
  animationToRight = false;
  animationToTop = false;


  ngOnInit(): void {
    setTimeout(() => {
      this.animationToLeft = true;
    }, 1000);

    setTimeout(() => {
      this.animationToRight = true;
    }, 1500);

    setTimeout(() => {
      this.animationToTop = true;
    }, 3000);
  }


}
