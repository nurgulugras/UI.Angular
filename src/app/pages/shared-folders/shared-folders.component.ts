import { Injector } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '../../shared/components/component-base';

@Component({
  selector: 'esa-shared-folders',
  templateUrl: './shared-folders.component.html',
  styleUrls: ['./shared-folders.component.scss']
})
export class SharedFoldersComponent extends ComponentBase implements OnInit {

  constructor(public injector: Injector) {
    super(injector);
  }

  ngOnInit() {
  }

}
