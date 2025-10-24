"use client"

import { Buttonz, Inputz } from '@/components/core';
import { useMutationData } from '@/hooks/useMutationData';
import { useToastState } from '@/store/toastState';
import React from 'react';

export const InputOtp = (props) => {
  const { isSend, setIsSend, sendOtpRoute, username, ...prop } = props;
  const { mutateAsync, isPending } = useMutationData(sendOtpRoute);
  const { showToast } = useToastState();

  const onSendOtp = async () => {
    if (!username) return showToast({ title: `Vui lòng nhập tài khoản!`, severity: 'error' });
    const response = await mutateAsync({ username });
    if (response?.status) {
      showToast({ title: `Đã gửi mã OTP đến email ${response?.data}`, severity: 'success' });
      setIsSend(true);
    } else showToast({ title: response.mess, severity: 'error' });
  };

  return (
    <div className="flex gap-4 items-center justify-between w-full">
      <Inputz label="Mã OTP (*)" {...prop} />
      <Buttonz onClick={onSendOtp} loading={isPending} className="mt-1 text-center w-[120px]" label="Gửi OTP" />
    </div>
  );
};
