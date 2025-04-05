export default interface ExternalConnection {
    id: number;
    userId: number;
    serviceName: string;
    accessToken: string;
    refreshToken?: string;
    connectedAt: Date;
    status: string;
}