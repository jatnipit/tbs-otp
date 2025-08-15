export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const query = getQuery(event);

  const logLine = `${new Date().toISOString()} Data: ${JSON.stringify(body)}\n`;

  const transactionId = body.Transaction;
  const status = body.Status;
  const time = body.Time;

  if (body) {
    console.log(
      `Transaction ID: ${transactionId}, Status: ${status}, Time: ${time}`
    );
  } else if (query) {
    console.log(`Query parameters: ${JSON.stringify(query)}`);
  }

  // return `${transactionId} ${status} ${time}`;
});
