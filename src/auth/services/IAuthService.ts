export enum Role {
    ADMIN = "ADMIN",
    USER = "USER"
}


export interface IAuthService {
    signIn(email: string, password: string): Promise<any>;
    signUp(email: string, password: string): Promise<any>;
    updateProfile(displayName: string): Promise<any>;
    signOut(): Promise<void>;
    onAuthStateChanged(callback: (user: any) => void): () => void;
    getCurrentUser(): any | null;
    getUserRole(user: any): Promise<Role>;
    getUserRoles(user: any): Promise<Role[]>;
}