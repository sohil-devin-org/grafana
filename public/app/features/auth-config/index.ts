import { setAuthConfigDeps } from '@grafana/auth-config';
import { GrafanaEdition } from '@grafana/data/internal';
import { config } from '@grafana/runtime';
import { CloudEnterpriseBadge } from 'app/core/components/Branding/CloudEnterpriseBadge';
import { FormPrompt } from 'app/core/components/FormPrompt/FormPrompt';
import { Page } from 'app/core/components/Page/Page';
import { PageNotFound } from 'app/core/components/PageNotFound/PageNotFound';
import { useAppNotification } from 'app/core/copy/appNotification';
import { contextSrv } from 'app/core/services/context_srv';
import { isOpenSourceBuildOrUnlicenced } from 'app/features/admin/EnterpriseAuthFeaturesCard';

// Wires app-specific services into the extracted @grafana/auth-config package.
// This module is imported at boot (via the root reducer), so the dependencies
// are registered before any auth-config component renders.
setAuthConfigDeps({
  Page,
  PageNotFound,
  FormPrompt,
  CloudEnterpriseBadge,
  useAppNotification,
  contextSrv,
  isOpenSourceEdition: () => config.buildInfo.edition === GrafanaEdition.OpenSource,
  isOpenSourceBuildOrUnlicenced,
});
