export default interface AIConfiguration {
    id: number;
    userId: number;
    interactionStyle: string;
    maxInteractionsPerDay?: number;
    preferredTopics: string[];
    tone?: string;
    responseLength?: string;
}