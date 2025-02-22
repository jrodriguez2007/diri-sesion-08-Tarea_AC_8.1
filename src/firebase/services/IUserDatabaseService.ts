import { Role } from "../../auth/services/IAuthService";

export interface IUserDatabaseService {
    getUserRoles(uid: string): Promise<Role[]>;
}