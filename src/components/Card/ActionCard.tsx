import React from 'react';
import classNames from 'classnames';

import './ActionCard.less';
import { IonIcon } from '../IonIcon';
import { Hoverable } from '../Hoverable';

export interface ActionCardProps extends StyledProps {
  // 若传入子节点，则直接渲染子节点
  // 否则渲染 title、desc 和 icon
  title?: string;
  desc?: string;
  icon?: string | React.ReactNode;
  direction?: 'row' | 'column';
  onClick?: () => void,
  disabled?: boolean;
  children?: React.ReactNode;
}

export function ActionCard({
  title,
  desc,
  icon,
  direction = 'row',
  onClick,
  disabled,
  className,
  style,
  children,
}: ActionCardProps) {
  const clickable = !!onClick;

  let directionClass = '';
  switch (children ? '' : direction) {
    case 'row':
      directionClass = 'card_row';
      break;
    case 'column':
      directionClass = 'card_column';
      break;
  }


  if (!children) {
    children = (
      <>
        <div className="card__title">{title}</div>
        {/* <div className="card__desc">{desc}</div> */}
      </>
    );
  }

  return (
    <Hoverable
      parent="div"
      className={classNames(
        'card',
        'need-hover',
        directionClass,
        className,
        {
          'card_disabled': disabled,
        }
      )}
      hoverClass="hover"
      style={style}
      onClick={disabled ? undefined : onClick}
      disabled={disabled || !clickable}
    >
      {children}
    </Hoverable>
  );
}
