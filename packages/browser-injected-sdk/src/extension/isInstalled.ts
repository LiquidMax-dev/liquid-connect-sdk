export function isInstalled(): boolean {
  try {
    // Attempt to access the Liquid extension's global object
    const liquid = (window as any)?.phantom;
    return !!liquid;
  } catch (error) {
    // If accessing the global object fails, the extension is likely not installed
    return false;
  }
}
