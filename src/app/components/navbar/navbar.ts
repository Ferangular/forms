import {Component, computed, inject, OnDestroy, Renderer2, signal} from '@angular/core';
import {NgClass, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'nav[cs-navbar]', //especie directiva
  imports: [
    NgClass
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnDestroy {

  private renderer = inject(Renderer2);

  menuOpen = signal(false);
  screenWidth = signal(window.innerWidth);

  isMobile = computed(() => this.screenWidth() < 768);
  isTablet = computed(() => this.screenWidth() >= 768 && this.screenWidth() <= 1024);

  private resizeListener: () => void;

  constructor() {
    this.resizeListener = this.renderer.listen('window', 'resize', () => {
      this.screenWidth.set(window.innerWidth);
    });
  }

  toggleMenu = () => this.menuOpen.update(open => !open);

  ngOnDestroy(): void {
    this.resizeListener();
  }
}
