import * as tf from "@tensorflow/tfjs";
import { KOBIData } from "../scoring-engine";

/**
 * TensorFlow.js Credit Scoring Model
 * Browser-side ML model for credit risk prediction
 */
export class CreditScoringModel {
    private model: tf.LayersModel | null = null;
    private isInitialized = false;

    /**
     * Initialize the ML model
     */
    async initialize() {
        if (this.isInitialized) return;

        try {
            // Try to load cached model first
            try {
                this.model = await tf.loadLayersModel("indexeddb://credit-model");
                console.log("✅ ML Model loaded from cache");
                this.isInitialized = true;
                return;
            } catch {
                console.log("📦 Creating new ML model...");
            }

            // Create new model architecture
            this.model = tf.sequential({
                layers: [
                    // Input layer: 8 features
                    tf.layers.dense({
                        inputShape: [8],
                        units: 16,
                        activation: "relu",
                        kernelInitializer: "glorotUniform",
                        name: "dense_1",
                    }),
                    // Dropout for regularization
                    tf.layers.dropout({ rate: 0.2, name: "dropout_1" }),
                    // Hidden layer
                    tf.layers.dense({
                        units: 8,
                        activation: "relu",
                        name: "dense_2",
                    }),
                    // Output layer: sigmoid for 0-1 output
                    tf.layers.dense({
                        units: 1,
                        activation: "sigmoid",
                        name: "output",
                    }),
                ],
            });

            // Compile model
            this.model.compile({
                optimizer: tf.train.adam(0.001),
                loss: "binaryCrossentropy",
                metrics: ["accuracy"],
            });

            console.log("✅ ML Model created successfully");
            this.isInitialized = true;

            // Pre-train with synthetic data (for demo purposes)
            await this.preTrainWithSyntheticData();
        } catch (error) {
            console.error("❌ ML Model initialization error:", error);
            this.isInitialized = false;
        }
    }

    /**
     * Normalize KOBİ data to 0-1 range for ML model
     */
    normalizeInput(kobi: KOBIData): number[] {
        return [
            // 1. Company age (normalized to 0-1, max 10 years)
            Math.min(kobi.company_age / 10, 1),

            // 2. Monthly revenue (normalized, max 100K AZN)
            Math.min(kobi.monthly_revenue / 100000, 1),

            // 3. Net profit (normalized, cap at 50K)
            Math.max(0, Math.min(kobi.net_profit / 50000, 1)),

            // 4. Tax debt (binary: 0=has debt, 1=no debt)
            kobi.tax_debt > 0 ? 0 : 1,

            // 5. Sector risk (0=high risk, 1=low risk)
            this.getSectorRisk(kobi.sector),

            // 6. Employee count (normalized, max 50)
            Math.min(kobi.employee_count / 50, 1),

            // 7. Cashflow (binary)
            kobi.cashflow_positive ? 1 : 0,

            // 8. Loan-to-revenue ratio (ideal ~30%)
            this.getLoanToRevenueScore(kobi),
        ];
    }

    /**
     * Get sector risk score (0=high risk, 1=low risk)
     */
    getSectorRisk(sector: string): number {
        const risks: Record<string, number> = {
            IT: 0.8, // Low risk
            Ticarət: 0.6,
            İstehsalat: 0.5,
            Restoran: 0.3,
            Tikinti: 0.2, // High risk
        };
        return risks[sector] || 0.5;
    }

    /**
     * Calculate loan-to-revenue score
     */
    getLoanToRevenueScore(kobi: KOBIData): number {
        // Ideal loan capacity: 30% of monthly revenue
        const idealCapacity = kobi.monthly_revenue * 0.3;
        // Normalize to 0-1 (max 100K loan capacity)
        return Math.min(idealCapacity / 100000, 1);
    }

    /**
     * Predict credit score using ML model
     */
    async predict(kobi: KOBIData): Promise<number> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        if (!this.model) {
            // Fallback to simple rule-based scoring
            return this.fallbackScore(kobi);
        }

        try {
            const input = tf.tensor2d([this.normalizeInput(kobi)]);
            const prediction = this.model.predict(input) as tf.Tensor;
            const score = (await prediction.data())[0];

            // Cleanup tensors to prevent memory leak
            input.dispose();
            prediction.dispose();

            // Convert 0-1 output to 0-5 scale
            return score * 5;
        } catch (error) {
            console.error("ML prediction error:", error);
            return this.fallbackScore(kobi);
        }
    }

    /**
     * Fallback scoring when ML is not available
     */
    private fallbackScore(kobi: KOBIData): number {
        let score = 0;

        // Simple weighted average
        score += Math.min(kobi.company_age / 5, 1) * 0.75;
        score += (kobi.monthly_revenue >= 50000 ? 1 : 0.5) * 1.0;
        score += (kobi.net_profit > 0 ? 0.75 : 0.25);
        score += (kobi.tax_debt === 0 ? 0.75 : 0);
        score += this.getSectorRisk(kobi.sector) * 0.5;
        score += (kobi.employee_count >= 5 ? 0.25 : 0.1);
        score += (kobi.cashflow_positive ? 0.25 : 0);
        score += this.getLoanToRevenueScore(kobi) * 0.75;

        return Math.min(5, score);
    }

    /**
     * Pre-train model with synthetic data (for demo)
     */
    private async preTrainWithSyntheticData() {
        if (!this.model) return;

        // Generate synthetic training data
        const trainingData = this.generateSyntheticData(100);

        const inputs = trainingData.map((d) => this.normalizeInput(d.kobi));
        const labels = trainingData.map((d) => (d.approved ? 1 : 0));

        const xs = tf.tensor2d(inputs);
        const ys = tf.tensor2d(labels, [labels.length, 1]);

        try {
            await this.model.fit(xs, ys, {
                epochs: 20,
                batchSize: 16,
                validationSplit: 0.2,
                verbose: 0,
                callbacks: {
                    onEpochEnd: (epoch, logs) => {
                        if (epoch % 5 === 0) {
                            console.log(
                                `Epoch ${epoch}: loss = ${logs?.loss.toFixed(4)}, acc = ${logs?.acc.toFixed(4)}`
                            );
                        }
                    },
                },
            });

            // Save model to IndexedDB
            await this.model.save("indexeddb://credit-model");
            console.log("✅ ML Model trained and cached");
        } catch (error) {
            console.error("Training error:", error);
        } finally {
            xs.dispose();
            ys.dispose();
        }
    }

    /**
     * Generate synthetic training data
     */
    private generateSyntheticData(
        count: number
    ): Array<{ kobi: KOBIData; approved: boolean }> {
        const data: Array<{ kobi: KOBIData; approved: boolean }> = [];
        const sectors = ["IT", "Ticarət", "İstehsalat", "Restoran", "Tikinti"];

        for (let i = 0; i < count; i++) {
            const revenue = Math.random() * 150000;
            const age = Math.floor(Math.random() * 10);
            const taxDebt = Math.random() > 0.7 ? Math.random() * 5000 : 0;
            const profit = revenue * (0.1 + Math.random() * 0.3) - taxDebt;

            const kobi: KOBIData = {
                id: `synth-${i}`,
                voen: `${1000000000 + i}`,
                company_name: `Company ${i}`,
                company_age: age,
                monthly_revenue: revenue,
                net_profit: profit,
                tax_debt: taxDebt,
                sector: sectors[Math.floor(Math.random() * sectors.length)],
                employee_count: Math.floor(Math.random() * 50),
                cashflow_positive: profit > 0 && Math.random() > 0.3,
                owner_name: `Owner ${i}`,
                email: `owner${i}@example.com`,
            };

            // Determine approval (simplified logic)
            const approved =
                revenue > 30000 &&
                taxDebt === 0 &&
                profit > 0 &&
                age >= 1;

            data.push({ kobi, approved });
        }

        return data;
    }

    /**
     * Get model summary
     */
    getSummary(): string {
        if (!this.model) return "Model not initialized";

        let summary = "";
        this.model.summary(undefined, undefined, (line) => {
            summary += line + "\n";
        });
        return summary;
    }
}

// Singleton instance
export const scoringModel = new CreditScoringModel();
