"use client"

import { Buttonz, Inputz } from '@/components/core';
import { usePostData } from '@/hooks/useMutationData';
import { useToastState } from '@/store';
import React from 'react';

export const InputOtp = (props) => {
  const { isSend, setIsSend, SendOtpRoute, username, ...prop } = props;
  const { mutateAsync, isPending } = usePostData(SendOtpRoute);
  const { showToast } = useToastState();

  const onSendOtp = async () => {
    if (!username) return showToast({ title: `Vui lòng nhập tài khoản!`, severity: 'error' });
    const response = await mutateAsync({ username });
    if (response) {
      showToast({ title: `Đã gửi mã OTP đến email ${response}`, severity: 'success' });
      setIsSend(true);
    }
  };

  return (
    <div className="flex gap-4 items-center justify-between w-full">
      <Inputz label="Mã OTP (*)" {...prop} />
      <Buttonz onClick={onSendOtp} loading={isPending} className="mt-1 text-center w-[120px]" label="Gửi OTP" />
    </div>
  );
};
