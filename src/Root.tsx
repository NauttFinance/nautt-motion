import React from 'react';
import {CreditCardFlow} from '../productions/credit-card-flow';
import {Web3AuthMaintenance} from '../productions/web3auth-maintenance';

// Register every production here (one <Folder> each in Remotion Studio).
export const Root: React.FC = () => (
  <>
    <Web3AuthMaintenance />
    <CreditCardFlow />
  </>
);
