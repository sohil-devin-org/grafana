import { type Action, type ActionImpl } from 'kbar';

type NotNullable<T> = Exclude<T, null | undefined>;

// Create our own action type to make priority mandatory.
// Parent actions require a section, but not child actions
export type CommandPaletteAction = RootCommandPaletteAction | ChildCommandPaletteAction;

export type URLCallback = (searchQuery: string) => string;

type RootCommandPaletteAction = Omit<Action, 'parent'> & {
  section: NotNullable<Action['section']>;
  priority: NotNullable<Action['priority']>;
  target?: React.HTMLAttributeAnchorTarget;
  url?: string | URLCallback;
  /** Identifier of the external system managing this resource, rendered as a badge. */
  managedBy?: string;
  /** Stable, language-agnostic section id for analytics (see SECTION_* in values.ts). */
  sectionId?: string;
};

type ChildCommandPaletteAction = Action & {
  parent: NotNullable<Action['parent']>;
  priority: NotNullable<Action['priority']>;
  target?: React.HTMLAttributeAnchorTarget;
  url?: string | URLCallback;
  /** Stable, language-agnostic section id for analytics (see SECTION_* in values.ts). */
  sectionId?: string;
};

/**
 * Reads the custom `sectionId` off a kbar ActionImpl. kbar copies custom action
 * properties onto ActionImpl at runtime but doesn't surface them on its type, so
 * we narrow with `in` + a typeof check rather than asserting.
 */
export function getActionSectionId(action: ActionImpl): string | undefined {
  if ('sectionId' in action && typeof action.sectionId === 'string') {
    return action.sectionId;
  }
  return undefined;
}

/** A single matched panel shown under a dashboard card in the deep search column. */
export interface DeepSearchSnippet {
  text: string;
  /** Cosine distance for this panel match (lower = closer). */
  score: number;
}

/** One dashboard in the deep search column, aggregated from its panel-level matches. */
export interface DeepSearchDashboardResult {
  dashboardUid: string;
  title: string;
  url: string;
  folderTitle?: string;
  /** Dashboard tags, parsed from the matched panel snippet. */
  tags: string[];
  /** Matched panel snippets, best match first. */
  snippets: DeepSearchSnippet[];
  /** Total panel-level matches for this dashboard (can exceed snippets shown). */
  matchedPanelCount: number;
  /** Lowest cosine distance among this dashboard's matches (lower = closer). */
  bestScore: number;
}
