export function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}