import { type ReactNode } from 'react';

import { type AuthConfigDeps, type PageComponent, setAuthConfigDeps } from './deps';

const PageStub: PageComponent = Object.assign(({ children }: { children?: ReactNode }) => <div>{children}</div>, {
  Contents: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
});

/**
 * Registers stub implementations of the app-provided dependencies, for use in tests.
 */
export function registerTestAuthConfigDeps(overrides: Partial<AuthConfigDeps> = {}) {
  setAuthConfigDeps({
    Page: PageStub,
    PageNotFound: () => <div>Page not found</div>,
    FormPrompt: () => null,
    CloudEnterpriseBadge: () => null,
    useAppNotification: () => ({ success: () => {}, warning: () => {}, error: () => {} }),
    contextSrv: { isGrafanaAdmin: true, hasPermission: () => true },
    isOpenSourceEdition: () => true,
    isOpenSourceBuildOrUnlicenced: () => true,
    ...overrides,
  });
}
