import { css } from '@emotion/css';
import * as React from 'react';

import { type GrafanaTheme2 } from '@grafana/data';
import { Card, useStyles2 } from '@grafana/ui';

interface Props {
  description?: string;
  text: string;
  url: string;
  onClick?: (event?: React.MouseEvent) => void;
}

export function BookmarkCard({ description, text, url, onClick }: Props) {
  const styles = useStyles2(getStyles);

  return (
    <Card noMargin className={styles.card} href={url} onClick={onClick}>
      <Card.Heading>{text}</Card.Heading>
      <Card.Description className={styles.description}>{description}</Card.Description>
    </Card>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  card: css({
    gridTemplateRows: '1fr 0 2fr',
  }),
  // Limit descriptions to 3 lines max before ellipsing
  description: css({
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    display: '-webkit-box',
    overflow: 'hidden',
  }),
});
