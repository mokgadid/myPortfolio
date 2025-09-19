import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTilt]',
  standalone: true
})
export class TiltDirective {
  @Input('appTilt') strength = 10; // default tilt strength in degrees
  @Input() glare = false;

  private rect?: DOMRect;
  private glareEl?: HTMLDivElement;

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {
    this.renderer.setStyle(this.el.nativeElement, 'transformStyle', 'preserve-3d');
    this.renderer.setStyle(this.el.nativeElement, 'willChange', 'transform');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform .15s ease');
    this.renderer.setStyle(this.el.nativeElement, 'position', this.el.nativeElement.style.position || 'relative');
  }

  @HostListener('mouseenter') onEnter() {
    this.rect = this.el.nativeElement.getBoundingClientRect();
    if (this.glare && !this.glareEl) {
      this.glareEl = this.renderer.createElement('div');
      this.renderer.setStyle(this.glareEl, 'position', 'absolute');
      this.renderer.setStyle(this.glareEl, 'inset', '0');
      this.renderer.setStyle(this.glareEl, 'pointerEvents', 'none');
      this.renderer.setStyle(this.glareEl, 'borderRadius', getComputedStyle(this.el.nativeElement).borderRadius || '12px');
      this.renderer.setStyle(this.glareEl, 'mixBlendMode', 'screen');
      this.renderer.setStyle(this.glareEl, 'opacity', '0.6');
      this.renderer.setStyle(this.glareEl, 'background', 'radial-gradient(260px 260px at 50% 50%, rgba(255,255,255,.75), rgba(255,255,255,0))');
      this.renderer.appendChild(this.el.nativeElement, this.glareEl);
    }
  }

  @HostListener('mousemove', ['$event']) onMove(e: MouseEvent) {
    if (!this.rect) this.rect = this.el.nativeElement.getBoundingClientRect();
    const x = (e.clientX - this.rect.left) / this.rect.width; // 0..1
    const y = (e.clientY - this.rect.top) / this.rect.height; // 0..1

    const rotateX = (0.5 - y) * this.strength; // invert for natural tilt
    const rotateY = (x - 0.5) * this.strength;

    this.renderer.setStyle(
      this.el.nativeElement,
      'transform',
      `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    );

    if (this.glare && this.glareEl) {
      const gx = Math.round(x * 100);
      const gy = Math.round(y * 100);
      this.renderer.setStyle(this.glareEl, 'background', `radial-gradient(280px 280px at ${gx}% ${gy}%, rgba(255,255,255,.8), rgba(255,255,255,0))`);
    }
  }

  @HostListener('mouseleave') onLeave() {
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'perspective(800px) rotateX(0deg) rotateY(0deg)');
    if (this.glareEl) {
      this.renderer.setStyle(this.glareEl, 'background', 'radial-gradient(240px 240px at 50% 50%, rgba(255,255,255,.55), rgba(255,255,255,0))');
    }
  }
}
