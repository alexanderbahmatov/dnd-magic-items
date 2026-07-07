import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuyModeService } from '../../services/buy-mode.service';

@Component({
  selector: 'app-mode-switch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mode-switch.component.html',
  styleUrls: ['./mode-switch.component.scss'],
})
export class ModeSwitchComponent {
  protected buy = inject(BuyModeService);
}
