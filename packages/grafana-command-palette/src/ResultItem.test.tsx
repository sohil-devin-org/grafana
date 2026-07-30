import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import { ActionImpl } from 'kbar';
import { type ReactNode } from 'react';

import { ResultItem } from './ResultItem';
import { CommandPaletteExtensionsContext, defaultCommandPaletteExtensions } from './extensions';

function createActionImpl(props: Record<string, unknown> = {}): ActionImpl {
  const action = {
    id: 'test-action',
    name: 'Test Dashboard',
    ...props,
  };
  return ActionImpl.create(action, { store: {} });
}

function renderWithBadge(ui: ReactNode) {
  return render(
    <CommandPaletteExtensionsContext.Provider
      value={{
        ...defaultCommandPaletteExtensions,
        renderManagedBadge: (managedBy) => <span data-testid="managed-badge">{managedBy}</span>,
      }}
    >
      {ui}
    </CommandPaletteExtensionsContext.Provider>
  );
}

describe('ResultItem', () => {
  it('renders the action name', () => {
    const action = createActionImpl();
    render(<ResultItem action={action} active={false} currentRootActionId="" />);
    expect(screen.getByText('Test Dashboard')).toBeInTheDocument();
  });

  it('renders the managed badge when managedBy is set', () => {
    const action = createActionImpl({ managedBy: 'repo' });
    renderWithBadge(<ResultItem action={action} active={false} currentRootActionId="" />);
    expect(screen.getByTestId('managed-badge')).toBeInTheDocument();
  });

  it('does not render the managed badge when managedBy is undefined', () => {
    const action = createActionImpl();
    renderWithBadge(<ResultItem action={action} active={false} currentRootActionId="" />);
    expect(screen.queryByTestId('managed-badge')).not.toBeInTheDocument();
  });

  it('does not render the managed badge when the extension point does not provide one', () => {
    const action = createActionImpl({ managedBy: 'repo' });
    render(<ResultItem action={action} active={false} currentRootActionId="" />);
    expect(screen.queryByTestId('managed-badge')).not.toBeInTheDocument();
  });

  it('appends an ellipsis to a parent action that has children but no command or link', () => {
    const parent = createActionImpl({ name: 'Preferences' });
    parent.addChild(createActionImpl({ id: 'child-action', name: 'Theme' }));
    render(<ResultItem action={parent} active={false} currentRootActionId="" />);
    expect(screen.getByText('Preferences...')).toBeInTheDocument();
  });

  it('renders ancestor breadcrumbs when no root action is selected', () => {
    const parent = createActionImpl({ id: 'set-theme', name: 'Set theme' });
    const child = createActionImpl({ id: 'dark', name: 'Dark' });
    parent.addChild(child);
    render(<ResultItem action={child} active={false} currentRootActionId="" />);
    expect(screen.getByText('Set theme')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
  });

  it('drops the current root action from the breadcrumbs', () => {
    const parent = createActionImpl({ id: 'set-theme', name: 'Set theme' });
    const child = createActionImpl({ id: 'dark', name: 'Dark' });
    parent.addChild(child);
    render(<ResultItem action={child} active={false} currentRootActionId="set-theme" />);
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.queryByText('Set theme')).not.toBeInTheDocument();
  });
});
