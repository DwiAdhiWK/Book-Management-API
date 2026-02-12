import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// import { PrismaClient } from 'generated/prisma/client';
import { PrismaClient } from '@prisma/client';
// Adjust the relative path based on where your generated/prisma folder is
// Examples:
//   - if generated is at project root → '../../generated/prisma'
//   - if in src/generated/prisma → '../generated/prisma'
//   - check your folder structure and use correct relative import

// import { Pool } from 'pg'; // or import Pool from 'pg' if using ESM
// import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Create PostgreSQL pool + adapter (required in Prisma 7+)
    // const connectionString = process.env.DATABASE_URL;
    // const pool = new Pool({ connectionString });
    // const adapter = new PrismaPg(pool);

    super({
      // adapter,                        // ← required now
      log: ['query', 'info', 'warn', 'error'], // optional
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}