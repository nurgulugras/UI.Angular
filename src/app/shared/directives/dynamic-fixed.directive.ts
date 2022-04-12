import { AfterContentChecked, AfterContentInit, Directive, ElementRef, Renderer2 } from '@angular/core';
import { GlobalFields } from '../GlobalFields';

@Directive({
    selector: '[dynamicFixedFullHeight]'
})
export class DynamicFixedDirective implements AfterContentInit {
    constructor(private host: ElementRef, private renderer: Renderer2) { }
    ngAfterContentInit(): void {
        // this.modifyDivHeight();
        // GlobalFields.IsCallBack = true;
    }
    ngAfterContentChecked(): void {
        this.modifyDivHeight();
        // GlobalFields.IsCallBack = true;
    }
    ngAfterViewInit() {
        // this.listenResize();
    }

    listenResize() {
        window.onresize = this.onResizeWindowChange.bind(this);
    }
    onResizeWindowChange() {
        this.modifyDivHeight();
    }
    setInitDivHeight(element: any) {
        var bodyHeight = this.getBodyHeight();
        var headerHeight = this.getHeaderHeight();
        var breadcrumbHeight = this.getBreadcrumbHeight();
        var footerDivHeight = this.getFooterHeight();

        var divNewHeight = bodyHeight - (headerHeight + breadcrumbHeight + footerDivHeight + 80);
        
        this.setDivNewHeight(element, `${divNewHeight}px`);
    }
    modifyDivHeight() {
        var destinationElement = this.getDestinationElement();
        this.setInitDivHeight(destinationElement);
    }
    getDivCurrentHeight(element: any): number {
        return element.offsetHeight;
    }
    // getBaseDivHeight(): number {
    //     var baseDiv: any = document.getElementsByClassName("full-height-container");
    //     return baseDiv ? baseDiv[0].offsetHeight : 0;
    // }
    getFooterHeight(): number {
        var footerDiv: any = document.getElementsByTagName("app-footer");
        return footerDiv[0].offsetHeight;
    }
    getHeaderHeight(): number {
        var footerDiv: any = document.getElementsByTagName("app-header");
        return footerDiv[0].offsetHeight;
    }

    getBreadcrumbHeight(): number {
        var footerDiv: any = document.getElementsByTagName("cui-breadcrumb");
        return footerDiv[0].offsetHeight;
    }
    getBodyHeight(): number {
        return window.innerHeight;;
    }

    getDestinationElement() {
        return this.host.nativeElement;
    }
    setDivNewHeight(element, newHeight: string) {
        this.renderer.setStyle(element, 'height', newHeight);
    }
}