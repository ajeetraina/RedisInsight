import React, { useContext } from 'react'
import cx from 'classnames'
import { EuiIcon, EuiText } from '@elastic/eui'

import { Theme } from 'uiSrc/constants'
import QueryCard from 'uiSrc/components/query-card'
import { WBQueryType } from 'uiSrc/pages/workbench/constants'
import { CommandExecutionUI } from 'uiSrc/slices/interfaces'
import { ThemeContext } from 'uiSrc/contexts/themeContext'
import MultiPlayIconDark from 'uiSrc/assets/img/multi_play_icon_dark.svg'
import MultiPlayIconLight from 'uiSrc/assets/img/multi_play_icon_light.svg'
import styles from './styles.module.scss'

export interface Props {
  items: CommandExecutionUI[];
  scrollDivRef: React.Ref<HTMLDivElement>;
  onQueryReRun: (query: string, commandId?: string, type?: WBQueryType) => void;
  onQueryDelete: (commandId: string) => void
  onQueryOpen: (commandId: string) => void
}
const WBResults = ({ items = [], onQueryReRun, onQueryDelete, onQueryOpen, scrollDivRef }: Props) => {
  const { theme } = useContext(ThemeContext)

  const NoResults = (
    <div className={styles.noResults} data-testid="wb_no-results">
      <EuiIcon
        type={theme === Theme.Dark ? MultiPlayIconDark : MultiPlayIconLight}
        className={styles.playIcon}
        data-testid="wb_no-results__icon"
      />
      <EuiText className={styles.noResultsTitle} color="subdued" data-testid="wb_no-results__title">No results to display</EuiText>
      <EuiText className={styles.noResultsText} color="subdued" data-testid="wb_no-results__summary">
        Run Redis commands to get results or see the left menu to learn more
      </EuiText>
    </div>
  )

  return (
    <div className={cx(styles.container)}>
      <div ref={scrollDivRef} />
      {items.map(({ command = '', isOpen = false, result = undefined, id = '', loading, createdAt }) => (
        <QueryCard
          id={id}
          key={id}
          isOpen={isOpen}
          result={result}
          loading={loading}
          command={command}
          createdAt={createdAt}
          onQueryOpen={() => onQueryOpen(id)}
          onQueryReRun={() => onQueryReRun(command)}
          onQueryDelete={() => onQueryDelete(id)}
        />
      ))}
      {!items.length && NoResults}
    </div>
  )
}

export default React.memo(WBResults)
