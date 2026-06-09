export async function fetchGAS(action: string, method: 'GET' | 'POST' = 'GET', params: Record<string, any> = {}) {
  try {
    if (method === 'GET') {
      const queryParams = new URLSearchParams({ action, ...params }).toString();
      const res = await fetch(`/api/gas?${queryParams}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const responseData = await res.json();
      return responseData;
    } else {
      const res = await fetch('/api/gas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ action, ...params }),
      });

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const responseData = await res.json();
      return responseData;
    }
  } catch (error) {
    console.error(`Error in fetchGAS (${action}):`, error);
    throw error;
  }
}
