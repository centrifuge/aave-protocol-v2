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
    },
    [eEthereumNetwork.ropsten]: {
      DAI: '0xf80A32A835F79D7787E8a8ee5721D0fEaFd78108',
    },
    [eEthereumNetwork.main]: {
      DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    },
    [eEthereumNetwork.tenderlyMain]: {
      DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    },
  },
};

export default CentrifugeConfig;
