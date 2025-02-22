import { Role } from "../../auth/services/IAuthService";

export interface IFirebaseDataBaseService {
  //getUserRoles(uid: string): Promise<Role[]>;
  getUserRole(uid: string): Promise<Role>;
  createUserRoles(uid: string, data: { email: string; role: Role }): Promise<void>;
}