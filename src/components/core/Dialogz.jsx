"use client"

import { Dialog } from 'primereact/dialog';

export const Dialogz = (props) => {
  const { header = '', children, open, setOpen = () => {}, position = 'top', width = '1400px' } = props;

  return (
    <Dialog
      headerClassName="font-bold uppercase leading-normal text-primary"
      position={position}
      style={{ width }}
      header={header}
      visible={open}
      appendTo="self"
      onHide={() => {
        if (!open) return;
        setOpen(false);
      }}
    >
      {children}
    </Dialog>
  );
};
