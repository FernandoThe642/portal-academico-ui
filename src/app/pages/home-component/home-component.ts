import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ApiService } from '../../services/api-service';

interface Resource {
  id: number;
  original_name: string;
  stored_name: string;
  mime_type: string;
  size_bytes: string | number;
  created_at: string;
  category_id: number | null;
  category_name: string | null;
}

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent implements OnInit {
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  resources: Resource[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadResources();
  }

  loadResources(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.cdr.detectChanges();

    this.apiService.getResources().subscribe({
      next: (data: any) => {
        console.log('Recursos recibidos:', data);

        this.resources = data as Resource[];
        this.isLoading = false;         
        this.errorMessage = null;

        this.cdr.detectChanges();        
      },
      error: (err) => {
        console.error('Error al cargar recursos:', err);

        this.errorMessage = 'No se pudieron cargar los recursos.';
        this.isLoading = false;          

        this.cdr.detectChanges();
      },
    });
  }

getResourceUrl(storedName: string): string {
  const STATIC_ROUTE = '/temp_uploads_local';
  return `${this.apiService.apiUrl}${STATIC_ROUTE}/${storedName}`;
}


  getFileIcon(mimeType: string): string {
    if (mimeType?.startsWith('image/')) return '🖼️';
    if (mimeType?.startsWith('video/')) return '🎬';
    if (mimeType?.includes('pdf')) return '📄';
    if (mimeType?.startsWith('text/')) return '📝';
    return '📦';
  }

  formatSize(bytes: string | number): string {
    const n = typeof bytes === 'string' ? Number(bytes) : bytes;
    if (!Number.isFinite(n)) return '-';
    if (n < 1024) return `${n} B`;
    const kb = n / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(2)} MB`;
    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
  }
}
