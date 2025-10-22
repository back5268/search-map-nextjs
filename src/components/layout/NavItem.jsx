import { ChevronRightIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import React from 'react';

export const NavItem = (props) => {
  const { item = {}, pathname = '', Icon } = props;
  const isSelected =
    '/timekeeping-config' === pathname || '/' === pathname || '/approved-payslip' === pathname || '/salary-calculation' === pathname
      ? pathname === item.route
      : item.route !== '/' && pathname.includes(item.route);

  const Fragment = ({ children }) => {
    const route = item.route;
    return <Link href={route}>{children}</Link>;
  };

  return (
    <Fragment>
      <div className={`p-3 my-1 rounded-sm ${isSelected ? 'bg-primary text-white font-semibold' : 'hover:bg-hoverSidebar'}`}>
        <div className="flex items-center gap-2 pl-2 text-[0.8rem]">
          {Icon ? <Icon className="h-4 w-4" /> : <ChevronRightIcon strokeWidth={4} className="h-3 w-3" />}
          <span>{item.name}</span>
        </div>
      </div>
    </Fragment>
  );
};
