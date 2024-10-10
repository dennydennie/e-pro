export function withNullSelectOption(
    options?: unknown[],
    nullTitle: string = "..."
  ) {
    const emptyOption = { const: null, title: nullTitle };
  
    if (!options) {
      return [emptyOption];
    }
  
    return [emptyOption, ...options];
  }