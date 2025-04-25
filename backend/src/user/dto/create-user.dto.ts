export class CreateUserDto {
    readonly email: string;
    readonly password: string;
    readonly isActive: boolean;
    readonly profile: {
        readonly name: string;
        readonly bio: string;
        readonly language: string;
        readonly timezone: string;
    }
}