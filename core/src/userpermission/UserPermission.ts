export default interface UserPermission {
    id: number;
    userId: number;
    permissionType: string;
    status: string;
    expirationDate?: Date;
}