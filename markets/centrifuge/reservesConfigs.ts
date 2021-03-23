import { eContractid, IReserveParams } from '../../helpers/types';

import { rateStrategyDROP, rateStrategyDAI } from './rateStrategies';

export const strategyDAI: IReserveParams = {
  strategy: rateStrategyDAI,
  baseLTVAsCollateral: '0', // cannot be used as collateral
  liquidationThreshold: '0', // cannot be used as collateral
  liquidationBonus: '0', // cannot be used as collateral
  borrowingEnabled: true,
  stableBorrowRateEnabled: true,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  reserveFactor: '1000',
};

export const strategyDROP: IReserveParams = {
  strategy: rateStrategyDROP,
  baseLTVAsCollateral: '10000', // 100% loan to value
  liquidationThreshold: '8000', // 80% liquidation threshold
  liquidationBonus: '10500', // 5% liquidation bonus
  borrowingEnabled: false, // cannot be borrowed
  stableBorrowRateEnabled: true, // stable borrowing is enabled
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  reserveFactor: '1000', // 10% reserve factor
};
