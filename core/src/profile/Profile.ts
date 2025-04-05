export default interface Profile {
  id: number;
  userId: number;
  name: string;
  bio?: string;
  avatarUrl?: string;
  timezone?: string;
  language?: string;
}