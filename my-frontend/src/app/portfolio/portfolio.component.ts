import { AfterViewInit, Component } from '@angular/core';
import { TiltDirective } from '../shared/tilt.directive';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [TiltDirective],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent implements AfterViewInit {
  year = new Date().getFullYear();

  ngAfterViewInit(): void {
    // Reveal-on-scroll using IntersectionObserver
    const elements = document.querySelectorAll<HTMLElement>('.reveal');
    if (!('IntersectionObserver' in window) || elements.length === 0) {
      elements.forEach(el => el.classList.add('in-view'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    elements.forEach(el => observer.observe(el));

    // Mouse-driven parallax for hero blobs using CSS vars --mx and --my
    const hero = document.querySelector<HTMLElement>('.hero');
    if (hero) {
      let raf = 0;
      let targetX = 0, targetY = 0;
      let curX = 0, curY = 0;

      const update = () => {
        curX += (targetX - curX) * 0.1;
        curY += (targetY - curY) * 0.1;
        hero.style.setProperty('--mx', `${curX.toFixed(2)}px`);
        hero.style.setProperty('--my', `${curY.toFixed(2)}px`);
        raf = requestAnimationFrame(update);
      };

      const onMove = (e: MouseEvent) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5..0.5
        targetX = x * 20; // px offset
        targetY = y * 20;
        if (!raf) raf = requestAnimationFrame(update);
      };

      const onLeave = () => {
        targetX = 0; targetY = 0;
        if (!raf) raf = requestAnimationFrame(update);
      };

      hero.addEventListener('mousemove', onMove);
      hero.addEventListener('mouseleave', onLeave);
    }
  }
}
