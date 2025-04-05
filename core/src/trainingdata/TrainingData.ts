import DataSource from "../datasource/DataSource";

export default interface TrainingData {
    id: number;
    dataSourceId: number;
    content: string; // Conteúdo do treinamento
    createdAt: Date; // Data de criação
    dataSource?: DataSource; // Relação 1:N, opcional
}