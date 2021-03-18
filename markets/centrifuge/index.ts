import { ICentrifugeConfiguration, eEthereumNetwork } from '../../helpers/types';

import { CommonsConfig } from './commons';
import { strategyDAI, strategyDROP } from './reservesConfigs';

// ----------------
// POOL--SPECIFIC PARAMS
// ----------------

export const CentrifugeConfig: ICentrifugeConfiguration = {
  ...CommonsConfig,
  MarketId: 'Centrifuge genesis market',
  ProviderId: 1,
  ReservesConfig: {
    DAI: strategyDAI,
    NS2DRP: strategyDROP,
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
      DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      NS2DRP: '0xE4C72b4dE5b0F9ACcEA880Ad0b1F944F85A9dAA0',
    },
    [eEthereumNetwork.tenderlyMain]: {},
  },
};

export default CentrifugeConfig;
