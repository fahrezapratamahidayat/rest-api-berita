"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_js_1 = require("drizzle-orm/postgres-js");
const migrator_1 = require("drizzle-orm/postgres-js/migrator");
const postgres_1 = __importDefault(require("postgres"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
}
const runMigrations = async () => {
    const connectionString = process.env.DATABASE_URL;
    const migrationClient = (0, postgres_1.default)(connectionString, { max: 1 });
    const db = (0, postgres_js_1.drizzle)(migrationClient);
    console.log('🔄 Running migrations...');
    try {
        await (0, migrator_1.migrate)(db, { migrationsFolder: './src/db/migrations' });
        console.log('✅ Migrations completed successfully');
    }
    catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
    await migrationClient.end();
    process.exit(0);
};
runMigrations();
//# sourceMappingURL=migrate.js.map