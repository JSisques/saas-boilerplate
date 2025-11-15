import * as React from 'react';

import { SidebarData } from '@repo/shared/domain/interfaces/sidebar-data.interface';
import { TenantSwitcher } from '@repo/shared/presentation/components/molecules/tenant-switcher';
import { SearchForm } from '@repo/shared/presentation/components/organisms/search-form';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@repo/shared/presentation/components/ui/sidebar';

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  /**
   * The sidebar data structure containing versions and navigation items
   */
  data: SidebarData;
  /**
   * Optional tenants for tenant switching. If not provided, shows default tenant view.
   */
  tenants?: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
  /**
   * Default tenant name when no tenants are provided (default: "Admin Panel")
   */
  defaultTenantName?: string;
  /**
   * Default tenant subtitle when no tenants are provided (default: "Management")
   */
  defaultTenantSubtitle?: string;
}

export function AppSidebar({
  data,
  tenants,
  defaultTenantName,
  defaultTenantSubtitle,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <TenantSwitcher
          tenants={tenants}
          defaultTenantName={defaultTenantName}
          defaultTenantSubtitle={defaultTenantSubtitle}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
