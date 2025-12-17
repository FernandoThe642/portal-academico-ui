import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, RegisterRequest, RegisterResponse } from '../../services/api-service';

@Component({
  selector: 'app-register-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  userData: RegisterRequest = {
    name: '',
    email: '',
    password: '',
    role: 'estudiante',
  };

  message = '';
  isSuccess = false;

  private setMessage(text: string, success: boolean, autoHideMs = 3000) {
    this.message = text;
    this.isSuccess = success;
    this.cdr.detectChanges(); 

    if (autoHideMs > 0) {
      setTimeout(() => {
        this.message = '';
        this.isSuccess = false;
        this.cdr.detectChanges(); 
      }, autoHideMs);
    }
  }

  onRegister(): void {
    const { name, email, password, role } = this.userData;

    if (!name || !email || !password) {
      this.setMessage('Debe completar Nombre, Email y Contraseña.', false);
      return;
    }

    // Mensaje inmediato
    this.message = 'Registrando usuario...';
    this.isSuccess = false;
    this.cdr.detectChanges(); // 

    this.apiService.registerUser(this.userData).subscribe({
      next: (response: RegisterResponse) => {
        console.log('Respuesta backend /users:', response);

        const shownName = response?.name ?? name;
        const shownRole = response?.role ?? role ?? 'estudiante';
        const shownId = response?.id ? ` (ID: ${response.id})` : '';

        this.setMessage(`Registro exitoso: ${shownName} (${shownRole})${shownId}`, true);

        // Reset del formulario
        this.userData = { name: '', email: '', password: '', role: 'estudiante' };
        this.cdr.detectChanges(); // 
      },
      error: (err) => {
        console.error(' Error en /users:', err);

        const msg =
          err?.error?.error ||
          err?.error?.message ||
          err?.message ||
          err?.statusText ||
          'Error desconocido';

        this.setMessage(`Error al registrar: ${msg}`, false, 5000);
      },
    });
  }
}
