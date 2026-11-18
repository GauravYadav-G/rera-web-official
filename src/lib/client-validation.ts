let schemaPromise: Promise<typeof import("./validation")> | undefined;

/** Validation is requested on form interaction, not on the initial page load. */
export async function getContactSchema() {
  schemaPromise ??= import("./validation").catch((error: unknown) => {
    schemaPromise = undefined;
    throw error;
  });
  return (await schemaPromise).contactSchema;
}
