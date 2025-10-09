import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cvs'

  async up() {
    // Step 1: Add the order column
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('order').nullable()
    })

    // Step 2: Backfill existing rows per user (ordered by created_at)
    this.defer(async (db) => {
      await db.rawQuery(`
        WITH ordered AS (
          SELECT id, user_id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) AS new_order
          FROM ${this.tableName}
        )
        UPDATE ${this.tableName} AS c
        SET "order" = o.new_order
        FROM ordered o
        WHERE c.id = o.id;
      `)
    })

    // Step 3: Create a trigger function for per-user order auto-increment
    this.defer(async (db) => {
      await db.rawQuery(`
        CREATE OR REPLACE FUNCTION set_order_per_user()
        RETURNS trigger AS $$
        BEGIN
          IF NEW."order" IS NULL THEN
            SELECT COALESCE(MAX("order"), 0) + 1 INTO NEW."order"
            FROM ${this.tableName}
            WHERE user_id = NEW.user_id;
          END IF;
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `)

      // Step 4: Attach trigger to cvs table
      await db.rawQuery(`
        CREATE TRIGGER cvs_set_order_before_insert
        BEFORE INSERT ON ${this.tableName}
        FOR EACH ROW
        EXECUTE FUNCTION set_order_per_user();
      `)
    })
  }

  async down() {
    // Step 5: Drop trigger, function, and column on rollback
    this.defer(async (db) => {
      await db.rawQuery(`DROP TRIGGER IF EXISTS cvs_set_order_before_insert ON ${this.tableName};`)
      await db.rawQuery(`DROP FUNCTION IF EXISTS set_order_per_user();`)
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('order')
    })
  }
}
