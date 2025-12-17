import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ApiService } from '../../services/api-service';

@Component({
  selector: 'app-upload-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-component.html',
  styleUrl: './upload-component.css',
})
export class UploadComponent {
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  selectedFile: File | null = null;

  //  Categoría (1..5) o null
  category_id: number | null = null;

  message = '';
  isSuccess = false;
  isUploading = false;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile =
      input.files && input.files.length > 0 ? input.files[0] : null;

    this.message = '';
    this.isSuccess = false;
    this.cdr.detectChanges();
  }

  onUpload(): void {
    if (!this.selectedFile) {
      this.message = 'Debe seleccionar un archivo.';
      this.isSuccess = false;
      this.cdr.detectChanges();
      return;
    }

    this.isUploading = true;
    this.message = 'Subiendo...';
    this.isSuccess = false;
    this.cdr.detectChanges();

    const formData = new FormData();
    formData.append('file', this.selectedFile); // field "file"

    // Enviar category_id solo si se seleccionó
    if (this.category_id !== null) {
      formData.append('category_id', String(this.category_id));
    }

    this.apiService
      .uploadResource(formData)
      .pipe(
        finalize(() => {
          this.isUploading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Respuesta del Backend:', response);

          this.message = '¡Archivo subido con éxito!';
          this.isSuccess = true;

          this.selectedFile = null;
          this.category_id = null;

          // Limpia el input para poder re-subir el mismo archivo
          const input = document.getElementById('fileInput') as HTMLInputElement | null;
          if (input) input.value = '';

          setTimeout(() => {
            this.message = '';
            this.isSuccess = false;
            this.cdr.detectChanges();
          }, 2500);

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error en la subida:', err);
          const msg =
            err?.error?.error || err?.statusText || err?.message || 'Error desconocido';
          this.message = `Error al subir: ${msg}`;
          this.isSuccess = false;
          this.cdr.detectChanges();
        },
      });
  }
}
