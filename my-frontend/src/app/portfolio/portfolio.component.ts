import { AfterViewInit, Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TiltDirective } from '../shared/tilt.directive';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, TiltDirective],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent implements AfterViewInit {
  year = new Date().getFullYear();

  // Lightbox state
  lightboxSrc: string | null = null;
  lightboxAlt: string = '';

  openLightbox(src: string, alt: string = '') {
    this.lightboxSrc = src;
    this.lightboxAlt = alt;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.lightboxSrc = null;
    this.lightboxAlt = '';
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEsc() { if (this.lightboxSrc) this.closeLightbox(); }

  ngAfterViewInit(): void {
    // Reveal-on-scroll using IntersectionObserver
    const elements = document.querySelectorAll<HTMLElement>('.reveal');
    if (!('IntersectionObserver' in window) || elements.length === 0) {
      elements.forEach(el => el.classList.add('in-view'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target as HTMLElement;
        const ratio = entry.intersectionRatio;
        if (ratio >= 0.35) {
          el.classList.add('in-view');
        } else if (ratio === 0) {
          // Only remove once the element is fully out of view
          el.classList.remove('in-view');
        }
      });
    }, { root: null, rootMargin: '0px', threshold: [0, 0.35] });

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

    // Click-to-flip for interest cards
    const flips = document.querySelectorAll<HTMLElement>('.flip');
    flips.forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });
    });
  }
}
