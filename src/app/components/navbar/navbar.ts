import {Component, computed, DestroyRef, DOCUMENT, effect, inject, OnDestroy, Renderer2, signal} from '@angular/core';
import {NgClass} from '@angular/common';
import {NavigationEnd, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {filter} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'nav[cs-navbar]', //especie directiva
  imports: [
    NgClass,
    RouterLink, RouterLinkActive
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  animations:[  ]
})
export class Navbar implements OnDestroy {

  private renderer = inject(Renderer2);
  private router   = inject(Router);
  private destroy  = inject(DestroyRef);
  private document = inject(DOCUMENT);

  menuOpen = signal(false);
  screenWidth = signal(window.innerWidth);

  isMobile = computed(() => this.screenWidth() < 768);
  isTablet = computed(() => this.screenWidth() >= 768 && this.screenWidth() <= 1024);

  private resizeListener: () => void;

  constructor() {
    // actualizar ancho
    this.resizeListener = this.renderer.listen('window', 'resize', () => {
      this.screenWidth.set(window.innerWidth);
    });

    // Bloquear/permitir scroll cuando el menú está abierto en móvil/tablet
    effect(() => {
      const open = this.menuOpen();
      const shouldLock = (this.isMobile() || this.isTablet()) && open;
      this.setScrollLock(shouldLock);
    });

    // 2) cerrar al terminar la navegación en responsive
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroy)
      )
      .subscribe(() => {
        if ((this.isMobile() || this.isTablet()) && this.menuOpen()) {
          this.menuOpen.set(false);
        }
      });
  }

  // 1) cerrar inmediatamente al tocar un link del menú móvil/tablet
  onNavigate(): void {
    if (this.isMobile() || this.isTablet()) {
      this.menuOpen.set(false);
    }
  }



  toggleMenu = () => this.menuOpen.update(open => !open);

  ngOnDestroy(): void {
    this.resizeListener();
    this.setScrollLock(false); // asegúrate de restaurar
  }


  /** Añade/quita html.no-scroll y compensa el ancho del scrollbar */
  private setScrollLock(lock: boolean): void {
    const html = this.document.documentElement;

    if (lock) {
      // calcular ancho del scrollbar para evitar “layout shift”
      const sbw = window.innerWidth - html.clientWidth;
      if (sbw > 0) {
        this.renderer.setStyle(html, '--sbw', `${sbw}px`);
      }
      this.renderer.addClass(html, 'no-scroll');
    } else {
      this.renderer.removeClass(html, 'no-scroll');
      this.renderer.removeStyle(html, '--sbw');
    }
  }
}
