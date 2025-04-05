import TrainingData from "../trainingdata/TrainingData";

export default interface DataSource {
  id: number;
  userId: number;
  sourceType: string;
  sourceName?: string;
  status: string;
  lastUpdated: Date;
  trainingData: TrainingData[];
}