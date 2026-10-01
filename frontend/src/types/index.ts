export interface Dataset {
  id: string;
  name: string;
  file_name: string;
  project_type: 'HOUSE_PRICE' | 'FAKE_NEWS';
  row_count: number;
  column_count: number;
  target_column: string;
  text_column?: string | null;
  created_at: string;
  status: string;
}

export interface DatasetDetail extends Dataset {
  columns: string[];
  numerical_columns: string[];
  categorical_columns: string[];
  missing_values: Record<string, number>;
  target_distribution?: Record<string, any>;
  sample_rows: Record<string, any>[];
}

export interface HousePriceMetrics {
  name: string;
  mape: number;
  mse: number;
  rmse: number;
  mae: number;
  r2: number;
}

export interface FakeNewsMetrics {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
}

export interface HousePricePrediction {
  prediction_id?: string;
  id?: string;
  created_at: string;
  model?: string;
  model_name?: string;
  model_version?: string;
  prediction?: number;
  predicted_price?: number;
  currency?: string;
  input_features?: Record<string, any>;
}

export interface FakeNewsPrediction {
  prediction_id?: string;
  id?: string;
  article_text: string;
  prediction?: string;
  prediction_label?: string;
  predicted_class?: number;
  probability_fake?: number;
  probability_real?: number;
  confidence?: number;
  model?: string;
  model_name?: string;
  model_version?: string;
  created_at: string;
}

export interface TrainingRun {
  id: string;
  project_type: string;
  model_name: string;
  model_version: string;
  training_rows: number;
  testing_rows: number;
  metrics: Record<string, any>;
  configuration?: Record<string, any>;
  created_at: string;
}

export interface DashboardSummary {
  total_predictions: number;
  house_price_predictions: number;
  fake_news_analyses: number;
  total_training_runs: number;
  active_models: number;
  total_datasets: number;
  recent_activity: {
    id: string;
    project: string;
    type: string;
    summary: string;
    created_at: string;
  }[];
}
