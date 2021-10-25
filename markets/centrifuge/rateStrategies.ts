import BigNumber from 'bignumber.js';
import { oneRay } from '../../helpers/constants';
import { IInterestRateStrategyParams } from '../../helpers/types';

// DAI
export const rateStrategyDAI: IInterestRateStrategyParams = {
  name: 'rateStrategyDAI',
  optimalUtilizationRate: new BigNumber(0.9).multipliedBy(oneRay).toFixed(),
  baseVariableBorrowRate: new BigNumber(0.01).multipliedBy(oneRay).toFixed(),
  variableRateSlope1: new BigNumber(0.035).multipliedBy(oneRay).toFixed(),
  variableRateSlope2: new BigNumber(0.9).multipliedBy(oneRay).toFixed(),
  stableRateSlope1: new BigNumber(0.02).multipliedBy(oneRay).toFixed(),
  stableRateSlope2: new BigNumber(0.02).multipliedBy(oneRay).toFixed(),
};

// DROP
export const rateStrategyDROP: IInterestRateStrategyParams = {
  name: 'rateStrategyDROP',
  optimalUtilizationRate: new BigNumber(1.0).multipliedBy(oneRay).toFixed(),
  baseVariableBorrowRate: '0',
  variableRateSlope1: '0',
  variableRateSlope2: '0',
  stableRateSlope1: '0',
  stableRateSlope2: '0',
};
