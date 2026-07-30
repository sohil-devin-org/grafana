import { css } from '@emotion/css';

import { type GrafanaTheme2, type NavModelItem } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { EmptyState, useStyles2 } from '@grafana/ui';

import { BookmarkCard } from './BookmarkCard';
import { findByUrl } from './findByUrl';

export interface BookmarksPageContentProps {
  pinnedItems: string[];
  navTree: NavModelItem[];
}

export function BookmarksPageContent({ pinnedItems, navTree }: BookmarksPageContentProps) {
  const styles = useStyles2(getStyles);

  const validItems = pinnedItems.reduce((acc: NavModelItem[], url) => {
    const item = findByUrl(navTree, url);
    if (item) {
      acc.push(item);
    }
    return acc;
  }, []);

  if (validItems.length === 0) {
    return (
      <EmptyState
        variant="call-to-action"
        message={t('bookmarks-page.empty.message', 'It looks like you haven’t created any bookmarks yet')}
      >
        <Trans i18nKey="bookmarks-page.empty.tip">
          Hover over any item in the nav menu and click on the bookmark icon to add it here.
        </Trans>
      </EmptyState>
    );
  }

  return (
    <section className={styles.grid}>
      {validItems.map((item) => {
        return (
          <BookmarkCard key={item.id || item.url} description={item.subTitle} text={item.text} url={item.url ?? ''} />
        );
      })}
    </section>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  grid: css({
    display: 'grid',
    gap: theme.spacing(3),
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gridAutoRows: '138px',
    padding: theme.spacing(2, 0),
  }),
});
