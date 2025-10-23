import { create } from 'zustand';

export const INITIAL_ACCOUNT = {
};

const useAccountState = create((set, get) => ({
  account: INITIAL_ACCOUNT,
  isAuthenticated: false,
  role: false,
  tools: [],
  loadingz: false,
  setAccount: (data) => set({ ...data, isAuthenticated: true, role: data.userInfo?.role }),
  clearAccount: () => set({ userInfo: INITIAL_ACCOUNT, isAuthenticated: false, role: false, tools: [] }),
  setLoadingz: () => {
    const loading = get().loadingz;
    set({ loadingz: !loading });
  }
}));

const getAccountState = () => useAccountState.getState();
export { useAccountState, getAccountState };
