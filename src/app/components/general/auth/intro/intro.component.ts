import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
})
export class IntroComponent implements OnInit {
  animationToLeft = false;
  animationToRight = false;
  animationToTop = false;
  playedIntroAmount = [0];
  introIsDone!: boolean;

  ngOnInit(): void {
    this.runAnimation();

    this.loadLoadingAmounts();
    if (this.playedIntroAmount[0] == 0) {
      this.introIsDone = false;
    } else {
      this.introIsDone = true;
    }

    // if (this.loaded[0] == 0 && this.loading) {
    //   this.showLoadingAnimation();
    //   this.loadWebsite();
    // }
    this.countLoading();
  }

  /**
   * This function count the loading acts of the user and save the amount in the session storage (loading animation should showd just once)
   *
   */
  countLoading() {
    this.playedIntroAmount[0]++;
    let loadingsAsText = JSON.stringify(this.playedIntroAmount);
    sessionStorage.setItem('loadingActs', loadingsAsText);
  }

  /**
   * This function loads the amount of the loading acts from the session storage
   *
   */
  loadLoadingAmounts() {
    let loadingsAsText = sessionStorage.getItem('loadingActs');
    if (loadingsAsText) {
      this.playedIntroAmount = JSON.parse(loadingsAsText);
    }
  }

  runAnimation() {
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
