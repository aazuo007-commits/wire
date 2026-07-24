/**
 * Converts any string into a URL-friendly slug.
 * "Web Design & Development!" -> "web-design-development"
 */
export function slugify(text = "") {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // strip anything that isn't a letter, number, space, or hyphen
    .replace(/\s+/g, "-") // spaces -> hyphens
    .replace(/-+/g, "-") // collapse multiple hyphens
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
}

/**
 * Given a Mongoose model and a desired base slug, returns a slug guaranteed to be
 * unique for that model — appending -2, -3, -4... if the base (or a previous
 * suffixed attempt) is already taken. Pass `excludeId` when updating an existing
 * document so it doesn't collide with itself.
 */
export async function ensureUniqueSlug(Model, baseSlug, excludeId = null) {
  let slug = baseSlug || "item";
  let counter = 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Model.findOne(query).select("_id");
    if (!existing) return slug;
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}
