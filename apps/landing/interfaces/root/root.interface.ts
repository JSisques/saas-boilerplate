/**
 * Base interface that serves as a global template to extend in other components.
 * Provides a common structure with support for nested content and translations.
 *
 * @interface RootProps
 * @property {React.ReactNode} [children] - Optional child content that can be rendered inside the component
 * @property {any} dictionary - Dictionary object containing translations for the component
 */
export interface RootProps {
  dictionary: Record<string, any>;
  children?: React.ReactNode;
  className?: string;
}
