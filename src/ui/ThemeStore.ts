import { signal } from "@preact/signals";

export type Theme = "light" | "dark";

const GLASS_STORAGE_KEY = "liquidGlass";

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getInitialLiquidGlass(): boolean {
  try {
    return localStorage.getItem(GLASS_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export const theme = signal<Theme>(getSystemTheme());
export const liquidGlass = signal<boolean>(getInitialLiquidGlass());

function applyTheme(value: Theme) {
  document.documentElement.dataset.theme = value;
}

function applyLiquidGlass(enabled: boolean) {
  document.documentElement.toggleAttribute("data-glass", enabled);
}

theme.subscribe((value) => {
  applyTheme(value);
});

liquidGlass.subscribe((enabled) => {
  try {
    localStorage.setItem(GLASS_STORAGE_KEY, String(enabled));
  } catch {}
  applyLiquidGlass(enabled);
});

export function toggleLiquidGlass() {
  liquidGlass.value = !liquidGlass.value;
}

export function initTheme() {
  applyTheme(theme.value);
  applyLiquidGlass(liquidGlass.value);

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    theme.value = e.matches ? "dark" : "light";
  });
}
