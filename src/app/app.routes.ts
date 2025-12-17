import { Routes } from '@angular/router';
import { UploadComponent } from './pages/upload-component/upload-component';
import { HomeComponent } from './pages/home-component/home-component';
import { RegisterComponent } from './pages/register-component/register-component';

export const routes: Routes = [
  // Ruta principal
  { path: '', component: HomeComponent, title: 'Portal Académico - Inicio' },
  // Ruta para subir archivos
  { path: 'upload', component: UploadComponent, title: 'Portal Académico - Subir Recurso' },
  // Ruta para registro de usuarios
  { path: 'register', component: RegisterComponent, title: 'Portal Académico - Registro' },
  // Redirigiendo a la princippal
  { path: '**', redirectTo: '' }
];
