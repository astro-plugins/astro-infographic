import { renderToString } from '@antv/infographic/ssr'
import type { InfographicInitOptions } from './types.js'

/**
 * Render an infographic specification to SVG using SSR
 * @param spec - The infographic specification text
 * @param options - Optional initialization options
 * @returns Promise resolving to SVG string
 * @throws Error if rendering fails or times out
 */
export async function renderInfographic(
  spec: string,
  options?: Partial<InfographicInitOptions>
): Promise<string> {
  try {
    const svg = await renderToString(spec, options)
    return svg
  } catch (error) {
    // Enhance error message with context
    if (error instanceof Error) {
      throw new Error(`Failed to render infographic: ${error.message}`)
    }
    throw error
  }
}
