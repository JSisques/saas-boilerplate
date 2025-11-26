/**
 * Interface for a single navigation item in the sidebar
 */
export interface SidebarNavItem {
  /**
   * The title of the navigation item
   */
  title: string;
  /**
   * The URL to navigate to
   */
  url: string;
  /**
   * Whether this item is currently active
   */
  isActive?: boolean;
}

/**
 * Interface for a navigation group in the sidebar
 */
export interface SidebarNavGroup {
  /**
   * The title of the navigation group
   */
  title: string;
  /**
   * The URL for the group (optional, can be used for group-level navigation)
   */
  url: string;
  /**
   * The list of navigation items within this group
   */
  items: SidebarNavItem[];
}

/**
 * Interface for the complete sidebar data structure
 */
export interface SidebarData {
  navMain: SidebarNavGroup[];
}
