import type { Element, ElementContent } from 'hast'
import type { Plugin } from 'unified'
import type { VFile } from 'vfile'

/**
 * Infographic initialization options passed to SSR renderer
 * This is a subset of @antv/infographic's InfographicOptions
 */
export interface InfographicInitOptions {
  width?: string | number
  height?: string | number
  [key: string]: unknown
}

/**
 * Configuration options for the rehype-infographic plugin
 */
export interface RehypeInfographicOptions {
  /**
   * Width of rendered SVG
   * @default '100%'
   */
  width?: string | number

  /**
   * Height of rendered SVG
   * @default 'auto'
   */
  height?: string | number

  /**
   * Custom Infographic initialization options passed to SSR renderer
   */
  infographicOptions?: Partial<InfographicInitOptions>

  /**
   * Error fallback handler
   * @param element - The hast element that failed to render
   * @param spec - The infographic specification text
   * @param error - The error that occurred
   * @param file - The vfile being processed
   * @returns Replacement node, or null/undefined to remove the element
   */
  errorFallback?: (
    element: Element,
    spec: string,
    error: unknown,
    file: VFile
  ) => ElementContent | null | undefined
}

/**
 * Represents a single infographic code block instance found in the AST
 */
export interface CodeInstance {
  /**
   * The infographic specification text extracted from the code block
   */
  spec: string

  /**
   * The inclusive ancestors of the element to process
   * The last element is the code block itself
   */
  ancestors: Element[]
}

/**
 * Type for the unified plugin
 */
export type RehypePlugin = Plugin<[RehypeInfographicOptions?], import('hast').Root>
