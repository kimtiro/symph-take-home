/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable("shortened_urls", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()")); // Unique ID
      table.string("original_url").notNullable(); // Original long URL
      table.string("short_slug").unique().notNullable(); // Shortened slug
      table.timestamp("expiration_date").nullable(); // Optional expiration date
      table.timestamps(true, true); // created_at and updated_at
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTable("shortened_urls");
};
