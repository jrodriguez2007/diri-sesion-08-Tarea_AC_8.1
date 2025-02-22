
import { getDatabase, ref, get, set } from 'firebase/database';
import { app } from '../Config';
import { Role } from '../../auth/services/IAuthService';
import { IFirebaseDataBaseService } from './IFirebaseDataBaseService';

export class FirebaseDatabaseService implements
IFirebaseDataBaseService {

    async getUserRole(uid: string): Promise<Role> {
        const db = getDatabase(app);
        const userRef = ref(db, `users/${uid}`);
        const snapshot = await get(userRef);
    
        if (snapshot.exists()) {
          const userData = snapshot.val();
          // Se asume que userData.role es un string "ADMIN" o "USER"
          if (userData && userData.role === Role.ADMIN) {
            return Role.ADMIN;
          }
        }
        return Role.USER;
      }

    
    async getUserRoles(uid: string): Promise<Role[]> {
        const db = getDatabase(app);
        const rolesRef = ref(db, `users/${uid}/roles`);
        const snapshot = await get(rolesRef);

        if (snapshot.exists()) {
            const rolesData = snapshot.val();
            const roles: Role[] = [];
            if (rolesData.admin === true) {
                roles.push(Role.ADMIN);
            }
            // Aquí se pueden agregar otros roles según se requiera.
            if (roles.length === 0) {
                // Si no se ha asignado ningún rol, se asume el rol de usuario.
                roles.push(Role.USER);
            }
            return roles;
        }
        return [Role.USER];
    }
        

    async createUserRoles(uid: string, data: { email: string; role: Role }): Promise<void> {
        const db = getDatabase(app);
        const userRoleRef = ref(db, `users/${uid}`);
        await set(userRoleRef, data);
    }
}



    
    

