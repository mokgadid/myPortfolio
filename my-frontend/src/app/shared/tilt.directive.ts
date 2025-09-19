import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTilt]',
  standalone: true
})
export class TiltDirective {
  @Input('appTilt') strength = 10; // default tilt strength in degrees
  @Input() glare = false;

  private rect?: DOMRect;

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {
    this.renderer.setStyle(this.el.nativeElement, 'transformStyle', 'preserve-3d');
    this.renderer.setStyle(this.el.nativeElement, 'willChange', 'transform');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform .15s ease');
  }

  @HostListener('mouseenter') onEnter() {
    this.rect = this.el.nativeElement.getBoundingClientRect();
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
  }

  @HostListener('mouseleave') onLeave() {
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'perspective(800px) rotateX(0deg) rotateY(0deg)');
  }
}
