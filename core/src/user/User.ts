import Profile from "../profile/Profile";
import Permission from "../permission/Permission";
import ExternalConnection from "../externalconnection/ExternalConnection";
import AIConfiguration from "../aiconfiguration/AIConfiguration";
import DataSource from "../datasource/DataSource";
import UserPermission from "../userpermission/UserPermission";

export default interface User {
    id: number;
    email: string;
    password: string; // Hash da senha
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    profile?: Profile; // Relação 1:1, opcional
    permissions: Permission[]; // Relação 1:N
    externalConnections: ExternalConnection[]; // Relação 1:N
    aiConfiguration?: AIConfiguration; // Relação 1:1, opcional
    dataSources: DataSource[]; // Relação 1:N
    userPermissions: UserPermission[]; // Relação 1:N
}
    
    