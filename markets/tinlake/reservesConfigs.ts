import { eContractid, IReserveParams } from '../../helpers/types';

import { rateStrategyStableTwo } from './rateStrategies';

export const strategyDAI: IReserveParams = {
  strategy: rateStrategyStableTwo,
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
  strategy: rateStrategyStableTwo,
  baseLTVAsCollateral: '10000', // 100% loan to value
  liquidationThreshold: '8000', // 80% liquidation threshold
  liquidationBonus: '10500', // 5% liquidation bonus
  borrowingEnabled: false, // whether borrowing is enabled on the reserve
  stableBorrowRateEnabled: true, // whether stable borrowing is enabled
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  reserveFactor: '1000', // 10% reserve factor
};
