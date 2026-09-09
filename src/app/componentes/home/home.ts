import { AfterViewInit, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit {
  private toggleBtn: HTMLButtonElement | null = null;
  private sidebar: HTMLElement | null = null;
  private overlay: HTMLElement | null = null;

  ngAfterViewInit(): void {
    this.toggleBtn = document.getElementById('menuToggleBtn') as HTMLButtonElement;
    this.sidebar = document.getElementById('sidebarNav');
    this.overlay = document.getElementById('menuOverlay');

    if (!this.toggleBtn || !this.sidebar) {
      return;
    }

    this.toggleBtn.addEventListener('click', () => this.toggleMenu());
    this.overlay?.addEventListener('click', () => this.closeMenu());
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        this.closeMenu();
      }
    });
  }

  private toggleMenu(): void {
    if (this.sidebar?.classList.contains('ativo')) {
      this.closeMenu();
      return;
    }

    this.sidebar?.classList.add('ativo');
    this.overlay?.classList.add('ativo');
  }

  private closeMenu(): void {
    this.sidebar?.classList.remove('ativo');
    this.overlay?.classList.remove('ativo');
  }

  fecharMenu(): void {
    this.closeMenu();
  }
}
