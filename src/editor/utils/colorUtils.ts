export interface RgbColor {
	red: number;
	green: number;
	blue: number;
	alpha?: number;
}

function clamp01(value: number): number {
	return Math.min(1, Math.max(0, value));
}

export function parseColorToRgb(input: string): RgbColor | null {
	if (!input) return null;
	const color = input.trim().toLowerCase();

	// Hex formats: #rgb, #rgba, #rrggbb, #rrggbbaa
	const hexMatch = color.match(/^#([0-9a-f]{3,8})$/i);
	if (hexMatch) {
		const hex = hexMatch[1];
		if (hex.length === 3 || hex.length === 4) {
			const r = parseInt(hex[0] + hex[0], 16);
			const g = parseInt(hex[1] + hex[1], 16);
			const b = parseInt(hex[2] + hex[2], 16);
			const a = hex.length === 4 ? parseInt(hex[3] + hex[3], 16) / 255 : 1;
			return { red: r, green: g, blue: b, alpha: a };
		}
		if (hex.length === 6 || hex.length === 8) {
			const r = parseInt(hex.slice(0, 2), 16);
			const g = parseInt(hex.slice(2, 4), 16);
			const b = parseInt(hex.slice(4, 6), 16);
			const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
			return { red: r, green: g, blue: b, alpha: a };
		}
	}

	// rgb/rgba
	const rgbMatch = color.match(/^rgba?\(([^)]+)\)$/);
	if (rgbMatch) {
		const parts = rgbMatch[1].split(',').map(p => p.trim());
		if (parts.length >= 3) {
			const r = parseInt(parts[0], 10);
			const g = parseInt(parts[1], 10);
			const b = parseInt(parts[2], 10);
			const a = parts[3] !== undefined ? parseFloat(parts[3]) : 1;
			return { red: r, green: g, blue: b, alpha: a };
		}
	}

	// hsl/hsla
	const hslMatch = color.match(/^hsla?\(([^)]+)\)$/);
	if (hslMatch) {
		const parts = hslMatch[1].split(',').map(p => p.trim());
		if (parts.length >= 3) {
			const h = parseFloat(parts[0]);
			const s = parseFloat(parts[1]) / 100;
			const l = parseFloat(parts[2]) / 100;
			const a = parts[3] !== undefined ? parseFloat(parts[3]) : 1;
			const { red, green, blue } = hslToRgb(h, s, l);
			return { red, green, blue, alpha: a };
		}
	}

	return null;
}

export function rgbToHex({ red, green, blue }: RgbColor): string {
	const r = red.toString(16).padStart(2, '0');
	const g = green.toString(16).padStart(2, '0');
	const b = blue.toString(16).padStart(2, '0');
	return `#${r}${g}${b}`.toLowerCase();
}

export function ensureHex(input: string): string | null {
	const rgb = parseColorToRgb(input);
	if (!rgb) return null;
	return rgbToHex(rgb);
}

export function getRelativeLuminance({ red, green, blue }: RgbColor): number {
	// Convert sRGB to linear
	const srgb = [red, green, blue].map(v => v / 255).map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
	return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

export function contrastRatio(fg: string, bg: string): number | null {
	const fgRgb = parseColorToRgb(fg);
	const bgRgb = parseColorToRgb(bg);
	if (!fgRgb || !bgRgb) return null;
	const L1 = getRelativeLuminance(fgRgb);
	const L2 = getRelativeLuminance(bgRgb);
	const lighter = Math.max(L1, L2);
	const darker = Math.min(L1, L2);
	return (lighter + 0.05) / (darker + 0.05);
}

export function bestTextColor(bg: string): '#000000' | '#ffffff' {
	const bgRgb = parseColorToRgb(bg) || { red: 255, green: 255, blue: 255 };
	const whiteContrast = (getRelativeLuminance({ red: 255, green: 255, blue: 255 }) + 0.05) / (getRelativeLuminance(bgRgb) + 0.05);
	const blackContrast = (getRelativeLuminance(bgRgb) + 0.05) / (getRelativeLuminance({ red: 0, green: 0, blue: 0 }) + 0.05);
	return whiteContrast >= blackContrast ? '#ffffff' : '#000000';
}

export function lighten(color: string, amount = 0.1): string {
	const rgb = parseColorToRgb(color);
	if (!rgb) return color;
	const r = Math.round(rgb.red + (255 - rgb.red) * clamp01(amount));
	const g = Math.round(rgb.green + (255 - rgb.green) * clamp01(amount));
	const b = Math.round(rgb.blue + (255 - rgb.blue) * clamp01(amount));
	return rgbToHex({ red: r, green: g, blue: b });
}

export function darken(color: string, amount = 0.1): string {
	const rgb = parseColorToRgb(color);
	if (!rgb) return color;
	const r = Math.round(rgb.red * (1 - clamp01(amount)));
	const g = Math.round(rgb.green * (1 - clamp01(amount)));
	const b = Math.round(rgb.blue * (1 - clamp01(amount)));
	return rgbToHex({ red: r, green: g, blue: b });
}

function hslToRgb(h: number, s: number, l: number): { red: number; green: number; blue: number } {
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - c / 2;
	let r = 0, g = 0, b = 0;
	if (h >= 0 && h < 60) {
		r = c; g = x; b = 0;
	} else if (h >= 60 && h < 120) {
		r = x; g = c; b = 0;
	} else if (h >= 120 && h < 180) {
		r = 0; g = c; b = x;
	} else if (h >= 180 && h < 240) {
		r = 0; g = x; b = c;
	} else if (h >= 240 && h < 300) {
		r = x; g = 0; b = c;
	} else {
		r = c; g = 0; b = x;
	}
	return {
		red: Math.round((r + m) * 255),
		green: Math.round((g + m) * 255),
		blue: Math.round((b + m) * 255),
	};
}