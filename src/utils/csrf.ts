const KEY = "csrfToken";

export function setCsrfToken(token: string): void {
  sessionStorage.setItem(KEY, token);
}

export function getCsrfToken(): string {
  return sessionStorage.getItem(KEY) ?? "";
}

export function clearCsrfToken(): void {
  sessionStorage.removeItem(KEY);
}
