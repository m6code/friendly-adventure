import { useMemo, useState, ReactNode } from 'react';

import { customizableTableContext } from '@/hooks/useCustomizableContext';

export default function CustomizableTableProvider({ children }:{ children:ReactNode }) {
  const [excludedFields, setExcludedFields] = useState<string[]>([]);

  const contextValue = useMemo(() => ({
    excludedFields,
    setExcludedFields,
  }), [excludedFields, setExcludedFields]);

  return (
    <customizableTableContext.Provider value={contextValue}>
      {children}
    </customizableTableContext.Provider>
  );
}
