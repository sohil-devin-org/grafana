import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { type NavModelItem } from '@grafana/data';

import { BookmarksPageContent } from './BookmarksPageContent';

const navTree: NavModelItem[] = [
  { id: 'dashboards', text: 'Dashboards', url: '/dashboards', subTitle: 'Browse dashboards' },
  { id: 'explore', text: 'Explore', url: '/explore' },
];

describe('BookmarksPageContent', () => {
  it('shows the empty state when there are no pinned items', () => {
    render(<BookmarksPageContent pinnedItems={[]} navTree={navTree} />);

    expect(screen.getByText('It looks like you haven’t created any bookmarks yet')).toBeInTheDocument();
  });

  it('renders a card for each pinned nav item', () => {
    render(<BookmarksPageContent pinnedItems={['/dashboards', '/explore']} navTree={navTree} />);

    expect(screen.getByRole('link', { name: /Dashboards/ })).toHaveAttribute('href', '/dashboards');
    expect(screen.getByRole('link', { name: /Explore/ })).toHaveAttribute('href', '/explore');
  });

  it('filters out pinned items that no longer resolve to a nav item', () => {
    render(<BookmarksPageContent pinnedItems={['/dashboards', '/plugin-no-longer-installed']} navTree={navTree} />);

    expect(screen.getAllByRole('link')).toHaveLength(1);
  });

  it('shows the empty state when no pinned items resolve to a nav item', () => {
    render(<BookmarksPageContent pinnedItems={['/plugin-no-longer-installed']} navTree={navTree} />);

    expect(screen.getByText('It looks like you haven’t created any bookmarks yet')).toBeInTheDocument();
  });
});
