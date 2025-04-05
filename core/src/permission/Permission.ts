export default interface Permission {
    id: number;
    userId: number;
    permissionType: string;
    expirationDate?: Date;
  }