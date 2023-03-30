import React from 'react';

import classNames from 'classnames';

import classes from './Wrapper.module.scss';

type WrapperProps = React.PropsWithChildren<{
  growing?: boolean;
  centered?: boolean;
  main?: boolean;
  outer?: boolean;
}>;

const Wrapper = ({
  growing,
  centered,
  main,
  outer,
  children,
}: WrapperProps): JSX.Element => {
  const wrapperClassName = classNames({
    [classes.growing]: main || growing,
    [classes.centered]: centered,
    [classes.outer]: outer,
  });
  const TagName = main ? 'main' : 'div';

  return <TagName className={wrapperClassName}>{children}</TagName>;
};

export default Wrapper;
