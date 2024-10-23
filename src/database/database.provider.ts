// src/database.provider.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseProvider implements OnModuleInit, OnModuleDestroy {
    private pool: Pool;

    onModuleInit() {
        this.pool = new Pool({
            user: "postgres",
            host: 'localhost',
            database: 'DB_QLTTDT',
            password: "password",
            port: 5432,
        });
    }

    onModuleDestroy() {
        this.pool.end();
    }

    getPool() {
        return this.pool;
    }
}
