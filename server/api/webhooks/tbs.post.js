export default defineEventHandler(async (event) => {
  const service = getRouterParam(event, "service");
  const body = await readBody(event);
  const headers = getHeaders(event);

  console.log(`Webhook received from ${service}:`, {
    headers,
    body,
  });

  try {
    const signature = headers["stripe-signature"];
    return { success: true };
  } catch (error) {
    console.error(`Error processing webhook from ${service}:`, error);
    throw createError({
      statusCode: 500,
      statusMessage: `Error processing webhook: ${error.message}`,
    });
  }
});
