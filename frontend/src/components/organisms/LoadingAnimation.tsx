import type { FC } from 'react';

export const LoadingAnimation: FC = () => (
    <div className="loading-state" role="status"><span className="spinner" aria-hidden="true" /><span>正在整理你的账本…</span></div>
);
