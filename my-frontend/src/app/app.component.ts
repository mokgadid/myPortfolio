import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'my-frontend';
  year = new Date().getFullYear();

  isShrunk = false;

  @HostListener('window:scroll')
  onScroll() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop || 0;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight || 1;
    const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
    document.documentElement.style.setProperty('--scroll-progress', progress + '%');
    this.isShrunk = scrollTop > 24;
  }
}
