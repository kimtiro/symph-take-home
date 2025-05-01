/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.table("shortened_urls", (table) => {
      table.integer("access_count").defaultTo(0); // Add access_count column with a default value of 0
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = async function (knex) {
    await knex.schema.table("shortened_urls", (table) => {
      table.dropColumn("access_count"); // Remove access_count column
    });
  };