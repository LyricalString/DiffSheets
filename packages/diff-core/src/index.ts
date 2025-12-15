// Types
export type {
  Cell,
  CellValue,
  Row,
  MatchingStrategy,
  ComparisonOptions,
  RowAlignment,
  ColumnProfile,
} from "./types.js";

export { defaultComparisonOptions } from "./types.js";

// Hungarian Algorithm
export { hungarian, hungarianAsync } from "./hungarian.js";

// Column Profiler
export {
  normalizeValue,
  isColumnIgnored,
  profileColumns,
  weightedRowSimilarity,
  calculateDynamicThreshold,
} from "./column-profiler.js";

// Row Matcher
export { alignRowsSync, alignRowsAsync, alignRows } from "./row-matcher.js";
