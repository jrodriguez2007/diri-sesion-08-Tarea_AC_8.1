
import { IAuthService, Role } from '../../auth/services/IAuthService';
import { getAuth, signInWithEmailAndPassword,
 createUserWithEmailAndPassword,signOut,onAuthStateChanged, updateProfile
} from 'firebase/auth';
import { app } from '../Config';
import { FirebaseDatabaseService } from './FirebaseDatabaseService';
const auth = getAuth(app);

export class FirebaseAuthService implements IAuthService {
    private databaseService: FirebaseDatabaseService;

    constructor() {
        this.databaseService = new FirebaseDatabaseService();
    }

    signIn(email: string, password: string): Promise<any> {
        return signInWithEmailAndPassword(auth, email, password);
    }
       
    // Para crear un nuevo usuario
    signUp(email: string, password: string): Promise<any> {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    updateProfile(displayName: string): Promise<any>{
        return updateProfile(auth.currentUser!, { displayName });
    }

    signOut(): Promise<void> {
        return signOut(auth);
    }

    onAuthStateChanged(callback: (user: any) => void): () => void {
        return onAuthStateChanged(auth, callback);
    }
               
    getCurrentUser(): any | null {
        return auth.currentUser;
    }

    async getUserRole(user: any): Promise<Role> {
        // Para el usuario por defecto, se devuelve siempre el rol ADMIN.
        if (user.email === 'jrodriguez@acme.com') {
            return Role.ADMIN;
        }
        
        // Delegamos la obtención de roles al servicio de base de datos.
        return this.databaseService.getUserRole(user.uid);
      }

    async getUserRoles(user: any): Promise<Role[]> {
        // Para el usuario por defecto, se devuelve siempre el rol ADMIN.
        if (user.email === 'jrodriguez@acme.com') {
            return [Role.ADMIN];
        }
        
        // Delegamos la obtención de roles al servicio de base de datos.
        return this.databaseService.getUserRoles(user.uid);
    }
}