import React from 'react';

export type Lang = 'en' | 'pt' | 'es';
export const LANGS: Lang[] = ['en', 'pt', 'es'];
export const LangCtx = React.createContext<Lang>('en');
export const useLang = () => React.useContext(LangCtx);
