export default class Id {
    static generate(): string {
        return crypto.randomUUID();
    }
    
    static isValid(id: string): boolean {
        return typeof id === 'string' && id.length === 36;
    }
}

