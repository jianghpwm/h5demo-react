import React from 'react';
import classNames from 'classnames';
import './BoolBtnPanel.less';
import { noop } from '../../../utils';

export interface BoolBtnPanelProps {
  templateConfig: TemplatePropertyConfig;
  value: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

export function BoolBtnPanel({
  templateConfig,
  onChange = noop,
  value,
  disabled: outerDisabled,
}: BoolBtnPanelProps) {
  const {
    id,
    name,
    mode = '',
    define: {
      mapping = {} as any,
    } = {},
  } = templateConfig || {};

  const disabled = Boolean(outerDisabled) || mode.indexOf('w') === -1;

  return (
    <div
      className={classNames("head-bool-panel", {
        disabled,
      })}
    >
      <div
        className={classNames("power-switch", {
          off: !value,
        })}
      >
        <div
          className="power-switch-body"
          onClick={() => {
            if (disabled) return;
            onChange(value ? 0 : 1);
          }}
        >
          <div className="power-switch-icon" />
        </div>
      </div>

      <div className="bool-panel-content">
        {name}：{mapping[value || 0]}
      </div>
    </div>
  );
}

