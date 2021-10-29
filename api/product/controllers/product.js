const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Retrieve a record.
   *
   * @return {Object}
   */

  async findOne(ctx) {
    const { slug } = ctx.params;

    const entity = await strapi.services.product.findOne({ slug });

    return sanitizeEntity(entity, { model: strapi.models.product });
  },
  async find(ctx) {
    if (ctx.query) {
      const { status = 'published', ...restQuery } = ctx.query;

      const isPublished = status === 'published' || status.includes('published');
      const isDraft = status === 'draft' || status.includes('draft');

      const ifBoth = isPublished && isDraft ? {} : null;

      const isOnlyDraft = !ifBoth && isDraft ? { published_at_null: "t" } : {};

      const isOnlyPublished = !ifBoth && isPublished ? { published_at_null: "f" } : {};

      const queryParams = {
        ...restQuery,
        ...(ifBoth || {
          ...isOnlyDraft,
          ...isOnlyPublished
        })
      };


      const entity = await strapi.query('product').find(queryParams);

      return sanitizeEntity(entity, { model: strapi.models.product });
    }

    return [];
  },
};
