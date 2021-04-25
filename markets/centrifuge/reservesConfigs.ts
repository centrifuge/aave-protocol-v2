import { eContractid, IReserveParams } from '../../helpers/types';

import { rateStrategyDROP, rateStrategyDAI } from './rateStrategies';

export const strategyDAI: IReserveParams = {
  strategy: rateStrategyDAI,
  baseLTVAsCollateral: '0', // cannot be used as collateral
  liquidationThreshold: '0', // cannot be used as collateral
  liquidationBonus: '0', // cannot be used as collateral
  borrowingEnabled: true,
  stableBorrowRateEnabled: false,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  stableDebtTokenImpl: eContractid.PermissionedStableDebtToken,
  variableDebtTokenImpl: eContractid.PermissionedVariableDebtToken,
  reserveFactor: '1000',
};

export const strategyDROP: IReserveParams = {
  strategy: rateStrategyDROP,
  baseLTVAsCollateral: '9500', // 95% loan to value
  liquidationThreshold: '9700', // 97% liquidation threshold
  liquidationBonus: '10200', // 2% liquidation bonus
  borrowingEnabled: false, // cannot be borrowed
  stableBorrowRateEnabled: false,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  stableDebtTokenImpl: eContractid.PermissionedStableDebtToken,
  variableDebtTokenImpl: eContractid.PermissionedVariableDebtToken,
  reserveFactor: '1000', // 10% reserve factor
};
