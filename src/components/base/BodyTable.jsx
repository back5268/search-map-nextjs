"use client"

import { Tagz } from '@/components/core';
import { formatNumber } from '@/lib/helper';
import moment from 'moment';

export const TimeBody = (value, type = 'datetime') => {
  let format = type === 'time' ? 'HH:mm:ss' : type === 'date' ? 'DD/MM/YYYY' : 'DD/MM/YYYY HH:mm:ss';
  if (value) return <p className="text-center">{moment(value).format(format)}</p>;
};

export const NumberBody = (value) => {
  if (value) return <p className="text-center">{formatNumber(value)}</p>;
  else return <p className="text-center">0</p>;
};

export const Body = (data = [], value, key = '_id', label = 'name') => {
  const item = data.find((d) => d[key] === value) || {};
  if (item.severity)
    return (
      <div className="flex justify-center w-full">
        <Tagz severity={item.severity} value={item[label]} className="text-center text-nowrap w-full" />
      </div>
    );
  else return item[label];
};

