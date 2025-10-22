import { Dialogz } from '@/components/core';
import React from 'react';

export const Account = (props) => {
  const { open, setOpen } = props;

  return (
    <Dialogz className="w-[1200px]" header="Thông tin cá nhân" open={open} setOpen={setOpen}>
      
    </Dialogz>
  );
};
