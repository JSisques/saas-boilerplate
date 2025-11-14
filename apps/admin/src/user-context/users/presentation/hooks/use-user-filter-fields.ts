import { FilterField } from "@/shared/presentation/components/organisms/dynamic-filters/dynamic-filters";
import { UserFiltersEnum } from "@/user-context/users/domain/enums/user-filters/user-filters.enum";
import { UserRoleEnum } from "@/user-context/users/domain/enums/user-role/user-role.enum";
import { UserStatusEnum } from "@/user-context/users/domain/enums/user-status/user-status.enum";

export const useUserFilterFields = (): FilterField[] => {
  return [
    {
      key: UserFiltersEnum.ROLE,
      label: "Role",
      type: "enum",
      enumOptions: Object.values(UserRoleEnum).map((role) => ({
        label: role,
        value: role,
      })),
    },
    {
      key: UserFiltersEnum.STATUS,
      label: "Status",
      type: "enum",
      enumOptions: Object.values(UserStatusEnum).map((status) => ({
        label: status,
        value: status,
      })),
    },
    {
      key: UserFiltersEnum.NAME,
      label: "Name",
      type: "text",
    },
    {
      key: UserFiltersEnum.USERNAME,
      label: "Username",
      type: "text",
    },
    {
      key: UserFiltersEnum.LAST_NAME,
      label: "Last Name",
      type: "text",
    },
    {
      key: UserFiltersEnum.BIO,
      label: "Bio",
      type: "text",
    },
    {
      key: UserFiltersEnum.AVATAR_URL,
      label: "Avatar URL",
      type: "text",
    },
  ];
};
