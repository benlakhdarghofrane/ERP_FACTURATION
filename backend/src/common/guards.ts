import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Simulation d'extraction de l'utilisateur depuis le JWT
    // En production, cela serait fait par une stratégie Passport/Supabase
    if (!request.user) {
      // Pour le test/démo, on injecte un utilisateur fictif si absent
      request.user = {
        id: 'user-uuid',
        entreprise_id: 'entreprise-uuid',
        role: 'admin'
      };
    }
    
    const user = request.user;
    return user && (user.role === 'admin' || user.role === 'commercial');
  }
}
