import { ICentrifugeConfiguration, eEthereumNetwork } from '../../helpers/types';

import { CommonsConfig } from './commons';
import { strategyDAI, strategyDROP } from './reservesConfigs';

// ----------------
// POOL--SPECIFIC PARAMS
// ----------------

const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F';

export const CentrifugeConfig: ICentrifugeConfiguration = {
  ...CommonsConfig,
  MarketId: 'Centrifuge genesis market',
  ProviderId: 1,
  ReservesConfig: {
    DAI: strategyDAI,
    NS2DRP: strategyDROP,
    CF4DRP: strategyDROP,
    FF1DRP: strategyDROP,
  },
  ReserveAssets: {
    [eEthereumNetwork.buidlerevm]: {},
    [eEthereumNetwork.hardhat]: {},
    [eEthereumNetwork.coverage]: {},
    [eEthereumNetwork.kovan]: {
      DAI: '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD',
      NS2DRP: '0x352Fee834a14800739DC72B219572d18618D9846',
    },
    [eEthereumNetwork.ropsten]: {},
    [eEthereumNetwork.main]: {
      DAI: DAI,
      NS2DRP: '0xE4C72b4dE5b0F9ACcEA880Ad0b1F944F85A9dAA0',
      CF4DRP: '0x5b2F0521875B188C0afc925B1598e1FF246F9306',
      FF1DRP: '0x44718d306a8Fa89545704Ae38B2B97c06bF11FC1',
    },
    [eEthereumNetwork.tenderlyMain]: {},
  },
  AssessorContracts: {
    NS2DRP: '0xdA0bA5Dd06C8BaeC53Fa8ae25Ad4f19088D6375b',
    CF4DRP: '0x6aaf2EE5b2B62fb9E29E021a1bF3B381454d900a',
    FF1DRP: '0x4e7D665FB7747747bd770CB35F604412249AE8bC',
  },
  AssetCurrencies: {
    NS2DRP: DAI,
    CF4DRP: DAI,
    FF1DRP: DAI,
  },
};

export default CentrifugeConfig;
