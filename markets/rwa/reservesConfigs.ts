import { eContractid, IReserveParams } from '../../helpers/types';

import { rateStrategyDROP, rateStrategyUSDC } from './rateStrategies';

export const strategyUSDC: IReserveParams = {
  strategy: rateStrategyUSDC,
  baseLTVAsCollateral: '0', // cannot be used as collateral
  liquidationThreshold: '0', // cannot be used as collateral
  liquidationBonus: '0', // cannot be used as collateral
  borrowingEnabled: true,
  stableBorrowRateEnabled: false,
  reserveDecimals: '6',
  aTokenImpl: eContractid.AToken,
  stableDebtTokenImpl: eContractid.PermissionedStableDebtToken,
  variableDebtTokenImpl: eContractid.PermissionedVariableDebtToken,
  reserveFactor: '1000',
};

const baseStrategyDROP: IReserveParams = {
  strategy: rateStrategyDROP,
  baseLTVAsCollateral: '0',
  liquidationThreshold: '0',
  liquidationBonus: '0',
  borrowingEnabled: false, // cannot be borrowed
  stableBorrowRateEnabled: false,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  stableDebtTokenImpl: eContractid.PermissionedStableDebtToken,
  variableDebtTokenImpl: eContractid.PermissionedVariableDebtToken,
  reserveFactor: '1000', // 10% reserve factor
};

export const strategyNS2DRP: IReserveParams = {
  ...baseStrategyDROP,
  ...{
    baseLTVAsCollateral: '9410', // 94.1% loan to value
    liquidationThreshold: '9700', // 97% liquidation threshold
    liquidationBonus: '10300', // 3% liquidation bonus
  },
};

export const strategyFF1DRP: IReserveParams = {
  ...baseStrategyDROP,
  ...{
    baseLTVAsCollateral: '9410', // 94.1% loan to value
    liquidationThreshold: '9700', // 97% liquidation threshold
    liquidationBonus: '10300', // 3% liquidation bonus
  },
};

export const strategyCF4DRP: IReserveParams = {
  ...baseStrategyDROP,
  ...{
    baseLTVAsCollateral: '9220', // 92.2% loan to value
    liquidationThreshold: '9600', // 96% liquidation threshold
    liquidationBonus: '10400', // 4% liquidation bonus
  },
};

export const strategyBL1DRP: IReserveParams = {
  ...baseStrategyDROP,
  ...{
    baseLTVAsCollateral: '9030', // 90.3% loan to value
    liquidationThreshold: '9370', // 93.7% liquidation threshold
    liquidationBonus: '10490', // 4.9% liquidation bonus
  },
};

export const strategyHT2DRP: IReserveParams = {
  ...baseStrategyDROP,
  ...{
    baseLTVAsCollateral: '9030', // 90.3% loan to value
    liquidationThreshold: '9370', // 93.7% liquidation threshold
    liquidationBonus: '10490', // 4.9% liquidation bonus
  },
};

export const strategyBR3DRP: IReserveParams = {
  ...baseStrategyDROP,
  ...{
    baseLTVAsCollateral: '8450', // 84.5% loan to value
    liquidationThreshold: '8750', // 87.5% liquidation threshold
    liquidationBonus: '10680', // 6.8% liquidation bonus
  },
};
