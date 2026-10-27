const retryable = new Set([429,500,502,503,504]);
export async function requestModel(url, options, {
  fetchImpl = (...args) => fetch(...args), now = Date.now,
  sleep = ms => new Promise(resolve => setTimeout(resolve,ms)), random = Math.random,
  timeoutSignal = ms => AbortSignal.timeout(ms), onRetry = () => {}
} = {}) {
  const deadline = now() + 28000;
  for (let attempt=1; attempt<=3; attempt++) {
    const remaining = deadline-now();
    if (remaining<=0) throw new DOMException('Model deadline exceeded','TimeoutError');
    let response, failure;
    try {
      response = await fetchImpl(url,{...options,signal:timeoutSignal(Math.min(12000,remaining))});
      if (response.ok) return await response.json();
      if (!retryable.has(response.status)) throw Object.assign(new Error('Provider rejected request'),{status:response.status,permanent:true});
      failure = Object.assign(new Error('Provider temporarily unavailable'),{status:response.status});
    } catch(error) {
      if (error.permanent || !['TimeoutError','AbortError','TypeError'].includes(error.name)) throw error;
      failure=error;
    }
    if (attempt===3) throw failure;
    const header = response?.headers?.get('retry-after');
    const seconds = header == null || header.trim()==='' ? NaN : Number(header);
    const retryAfter = Number.isFinite(seconds) ? Math.max(0,seconds*1000) : Date.parse(header)-now();
    const delay = Number.isFinite(retryAfter) ? Math.max(0,retryAfter) : 500*2**(attempt-1)+Math.floor(random()*250);
    // Never retry before Retry-After, and leave time for a useful attempt.
    if (delay+1000>=deadline-now()) throw failure;
    await response?.body?.cancel();
    onRetry({attempt,status:response?.status || failure.name});
    await sleep(delay);
  }
}
