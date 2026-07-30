import { BookmarksPageContent } from '@grafana/bookmarks';
import { usePinnedItems } from 'app/core/components/AppChrome/MegaMenu/hooks';
import { Page } from 'app/core/components/Page/Page';
import { useSelector } from 'app/types/store';

// Thin shim wiring app state (redux nav tree, user preferences) into @grafana/bookmarks.
export function BookmarksPage() {
  const { pinnedItems } = usePinnedItems();
  const navTree = useSelector((state) => state.navBarTree);

  return (
    <Page navId="bookmarks">
      <Page.Contents>
        <BookmarksPageContent pinnedItems={pinnedItems} navTree={navTree} />
      </Page.Contents>
    </Page>
  );
}

export default BookmarksPage;
