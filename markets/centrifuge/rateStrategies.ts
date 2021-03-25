import BigNumber from 'bignumber.js';
import { oneRay } from '../../helpers/constants';
import { IInterestRateStrategyParams } from '../../helpers/types';

// DAI
export const rateStrategyDAI: IInterestRateStrategyParams = {
  name: 'rateStrategyDAI',
  optimalUtilizationRate: new BigNumber(0.8).multipliedBy(oneRay).toFixed(),
  baseVariableBorrowRate: new BigNumber(0).multipliedBy(oneRay).toFixed(),
  variableRateSlope1: new BigNumber(0.04).multipliedBy(oneRay).toFixed(),
  variableRateSlope2: new BigNumber(0.75).multipliedBy(oneRay).toFixed(),
  stableRateSlope1: new BigNumber(0.02).multipliedBy(oneRay).toFixed(),
  stableRateSlope2: new BigNumber(0.75).multipliedBy(oneRay).toFixed(),
};

// DROP
export const rateStrategyDROP: IInterestRateStrategyParams = {
  name: 'rateStrategyDROP',
  optimalUtilizationRate: new BigNumber(0.45).multipliedBy(oneRay).toFixed(),
  baseVariableBorrowRate: '0',
  variableRateSlope1: '0',
  variableRateSlope2: '0',
  stableRateSlope1: '0',
  stableRateSlope2: '0',
};
