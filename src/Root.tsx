import React from 'react';
import {CreditCardFlow} from '../productions/credit-card-flow';
import {Onboarding} from '../productions/onboarding';
import {Web3AuthMaintenance} from '../productions/web3auth-maintenance';

// Register every production here (one <Folder> each in Remotion Studio).
export const Root: React.FC = () => (
  <>
    <Onboarding />
    <Web3AuthMaintenance />
    <CreditCardFlow />
  </>
);
