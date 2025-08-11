import { Component, DestroyRef, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type Zone = { id: string; label: string; tz: string; flag?: string };

@Component({
  selector: 'app-world-clocks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './world-clocks.component.html',
  styleUrl: './world-clocks.component.css'
})
export class WorldClocksComponent {
  // Puedes editar el orden/ciudades aquí
  readonly ZONES: Zone[] = [
    { id: 'madrid', label: 'Madrid', tz: 'Europe/Madrid', flag: '🇪🇸' },
    { id: 'london', label: 'Londres', tz: 'Europe/London', flag: '🇬🇧' },
    { id: 'newyork', label: 'New York', tz: 'America/New_York', flag: '🇺🇸' },
    { id: 'mexico', label: 'CDMX', tz: 'America/Mexico_City', flag: '🇲🇽' },
    { id: 'buenosaires', label: 'Buenos Aires', tz: 'America/Argentina/Buenos_Aires', flag: '🇦🇷' },
    { id: 'tokyo', label: 'Tokio', tz: 'Asia/Tokyo', flag: '🇯🇵' },
  ];

  private readonly now = signal(new Date());
  readonly clocks = computed(() => this.ZONES.map(z => this.buildClock(z, this.now())));

  constructor(destroyRef: DestroyRef) {
    const id = setInterval(() => this.now.set(new Date()), 1000);
    destroyRef.onDestroy(() => clearInterval(id));
  }

  private buildClock(z: Zone, now: Date) {
    // Partes horarias
    const parts = new Intl.DateTimeFormat('es-ES', {
      timeZone: z.tz, hour12: false,
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      weekday: 'short', day: '2-digit', month: 'short',
      timeZoneName: 'shortOffset' // p.ej. UTC+2 (si el navegador lo soporta)
    }).formatToParts(now);

    const get = (type: any) => parts.find(p => p.type === type)?.value ?? '';
    const h = Number(get('hour'));
    const m = Number(get('minute'));
    const s = Number(get('second'));

    // Ángulos analógicos
    const hAngle = (h % 12) * 30 + m * 0.5;
    const mAngle = m * 6 + s * 0.1;
    const sAngle = s * 6;

    const time = `${get('hour')}:${get('minute')}:${get('second')}`;
    const date = `${get('weekday')}. ${get('day')} ${get('month')}`.replace('.', '');
    const offset = get('timeZoneName'); // "UTC+2" si está disponible

    return { ...z, time, date, offset, hAngle, mAngle, sAngle };
  }
}
