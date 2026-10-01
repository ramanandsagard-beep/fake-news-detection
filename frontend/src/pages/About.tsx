import React from 'react';
import { BookOpen, GraduationCap, CheckCircle, HelpCircle, Layers } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Hero */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">
            Academic Viva Reference
          </span>
          <span className="text-xs text-slate-500">Comprehensive Engineering Guide</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Academic Viva & Platform Architecture Guide
        </h1>
        <p className="text-slate-400 text-sm mt-1 leading-relaxed">
          Detailed academic theory, preprocessing methodology, empirical metrics, and viva answers for both House Price Prediction and Fake News Detection.
        </p>
      </div>

      {/* General ML Theory */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <GraduationCap className="w-5 h-5 text-pink-400" />
          Part 1: Core Machine Learning Concepts
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
          <div className="space-y-2 bg-slate-800/40 p-4 rounded-lg border border-slate-800">
            <h3 className="font-semibold text-white">1. Supervised Learning</h3>
            <p className="text-slate-400 leading-relaxed">
              A paradigm where the algorithm learns a mapping function from input features <code className="text-pink-400">X</code> to ground-truth labels <code className="text-pink-400">y</code> using labeled training data.
            </p>
          </div>

          <div className="space-y-2 bg-slate-800/40 p-4 rounded-lg border border-slate-800">
            <h3 className="font-semibold text-white">2. Regression vs. Classification</h3>
            <p className="text-slate-400 leading-relaxed">
              <strong>Regression:</strong> Predicts a continuous quantity (e.g. SalePrice in Rupees).<br />
              <strong>Classification:</strong> Predicts a discrete category (e.g. 0=Fake, 1=Real).
            </p>
          </div>

          <div className="space-y-2 bg-slate-800/40 p-4 rounded-lg border border-slate-800">
            <h3 className="font-semibold text-white">3. Train/Test Split</h3>
            <p className="text-slate-400 leading-relaxed">
              Splits data into disjoint subsets. The model trains exclusively on the train set (80% or 75%) and is evaluated on held-out test data (20% or 25%) to measure out-of-sample generalization.
            </p>
          </div>

          <div className="space-y-2 bg-slate-800/40 p-4 rounded-lg border border-slate-800">
            <h3 className="font-semibold text-white">4. Data Leakage Prevention</h3>
            <p className="text-slate-400 leading-relaxed">
              Information from outside the training dataset must never influence the model. Transformers (imputers, scalers, vectorizers) are strictly <em>fitted</em> only on training data and used solely to <em>transform</em> test data.
            </p>
          </div>
        </div>
      </section>

      {/* House Price Viva Details */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <BookOpen className="w-5 h-5 text-pink-400" />
          Part 2: House Price Prediction Viva Guide
        </h2>

        <div className="space-y-4 text-xs text-slate-300">
          <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-800 space-y-2">
            <h3 className="font-semibold text-pink-400">Problem Formulation & Features</h3>
            <p className="text-slate-400 leading-relaxed">
              Predicting the continuous property target <code className="text-slate-200">SalePrice</code>. Key features include numerical dimensions (<code className="text-slate-200">LotArea</code>, <code className="text-slate-200">TotalBsmtSF</code>, <code className="text-slate-200">GrLivArea</code>, <code className="text-slate-200">YearBuilt</code>) and categorical configurations (<code className="text-slate-200">MSZoning</code>, <code className="text-slate-200">LotConfig</code>, <code className="text-slate-200">BldgType</code>, <code className="text-slate-200">Exterior1st</code>). Arbitrary identifiers like <code className="text-slate-200">Id</code> are dropped.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-800">
              <h4 className="font-semibold text-white">Linear Regression</h4>
              <p className="text-slate-400 mt-1">
                Models linear relationship via Ordinary Least Squares minimizing residual sum of squares: <code className="text-pink-400">y = Xw + b</code>.
              </p>
            </div>
            <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-800">
              <h4 className="font-semibold text-white">Support Vector Regression (SVR)</h4>
              <p className="text-slate-400 mt-1">
                Finds a hyperplane within an ε-insensitive tube using non-linear Radial Basis Function (RBF) kernel mapping.
              </p>
            </div>
            <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-800">
              <h4 className="font-semibold text-white">Random Forest Regressor</h4>
              <p className="text-slate-400 mt-1">
                Ensemble of 200 bootstrapped decision trees averaging variance across uncorrelated feature subsets.
              </p>
            </div>
          </div>

          <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-800 space-y-2">
            <h3 className="font-semibold text-pink-400">Evaluation Metrics Formulas</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li><strong>MAE:</strong> (1/n) &Sigma; |y_i - y&#770;_i| &mdash; Average absolute monetary deviation.</li>
              <li><strong>RMSE:</strong> &radic;((1/n) &Sigma; (y_i - y&#770;_i)&sup2;) &mdash; Penalizes large outlier errors more heavily.</li>
              <li><strong>R&sup2; Score:</strong> 1 - (&Sigma; (y_i - y&#770;_i)&sup2; / &Sigma; (y_i - y&#772;)&sup2;) &mdash; Proportion of variance explained by model.</li>
              <li><strong>MAPE:</strong> (100%/n) &Sigma; |(y_i - y&#770;_i) / y_i| &mdash; Safe relative percentage deviation.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Fake News Viva Details */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <BookOpen className="w-5 h-5 text-purple-400" />
          Part 3: Fake News Detection Viva Guide
        </h2>

        <div className="space-y-4 text-xs text-slate-300">
          <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-800 space-y-2">
            <h3 className="font-semibold text-purple-400">NLP Cleaning & Vectorization</h3>
            <p className="text-slate-400 leading-relaxed">
              Raw text undergoes lowercasing, bracket stripping, URL and HTML tag deletion, and punctuation removal. Text is converted into sparse n-gram frequencies using sublinear <strong>TF-IDF</strong>:
              <br />
              <code className="text-slate-200">TF-IDF(t, d) = TF(t, d) × log(N / DF(t))</code>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-800">
              <h4 className="font-semibold text-white">Logistic Regression</h4>
              <p className="text-slate-400 mt-1">
                Models probability of truth using the sigmoid function: <code className="text-purple-400">P(y=1|x) = 1 / (1 + e^-(w^T x + b))</code>. Highly effective for high-dimensional sparse text.
              </p>
            </div>
            <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-800">
              <h4 className="font-semibold text-white">Decision Tree Classifier</h4>
              <p className="text-slate-400 mt-1">
                Recursively partitions the TF-IDF feature space using Gini impurity or Information Gain up to max depth 50.
              </p>
            </div>
          </div>

          <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-800 space-y-2">
            <h3 className="font-semibold text-purple-400">Classification Metrics & Confusion Matrix</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li><strong>Accuracy:</strong> \((TP + TN) / (TP + TN + FP + FN)\)</li>
              <li><strong>Precision:</strong> \(TP / (TP + FP)\) — Fraction of flagged articles that were genuinely real.</li>
              <li><strong>Recall:</strong> \(TP / (TP + FN)\) — Fraction of actual real articles correctly identified.</li>
              <li><strong>F1 Score:</strong> \(2 × (Precision × Recall) / (Precision + Recall)\) — Harmonic mean.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
