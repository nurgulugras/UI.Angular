import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[readonly]'
})
export class ReadonlyDirective {
  constructor(private hostElement: ElementRef, private renderer: Renderer2) {

  }
  ngAfterViewInit() {
    // this.renderer.addClass(this.hostElement.nativeElement, 'noclick');
  }

  ngAfterContentInit(): void {
  }
}
