/**
 * Creates a new Promise that records how long it ran to completion
 * @async
 * @param {Promise.<T>} prom - promise to be wrapped
 * @returns {Promise.<{runtime: number, result: T}>} - promise that records performance data
 * @throws {{runtime: number, error: Error}}
 */
export async function timed(prom) {
  const startTimestamp = Date.now();
  try {
    const result = await prom;
    return {
      runtime: Date.now() - startTimestamp,
      result
    }
  } catch (error) {
    throw {
      runtime: Date.now() - startTimestamp,
      error
    }
  }
}
