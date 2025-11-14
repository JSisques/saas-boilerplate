import { FilterOperator } from "@/shared/domain/enums/filter-operator.enum";

export const useFilterOperators = (): {
  label: string;
  value: FilterOperator;
}[] => {
  return [
    { label: "Equals", value: FilterOperator.EQUALS },
    { label: "Not Equals", value: FilterOperator.NOT_EQUALS },
    { label: "Contains", value: FilterOperator.LIKE },
    { label: "In", value: FilterOperator.IN },
    { label: "Greater Than", value: FilterOperator.GREATER_THAN },
    { label: "Less Than", value: FilterOperator.LESS_THAN },
  ];
};
