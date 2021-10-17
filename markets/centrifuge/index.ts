import { ICentrifugeConfiguration, eEthereumNetwork } from '../../helpers/types';

import { CommonsConfig } from './commons';
import {
  strategyDAI,
  strategyNS2DRP,
  strategyFF1DRP,
  strategyCF4DRP,
  strategyBL1DRP,
  strategyHT2DRP,
  strategyBR3DRP,
} from './reservesConfigs';

// ----------------
// POOL--SPECIFIC PARAMS
// ----------------

const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const KDAI = '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD';

export const CentrifugeConfig: ICentrifugeConfiguration = {
  ...CommonsConfig,
  MarketId: 'Centrifuge genesis market',
  ProviderId: 1,
  ReservesConfig: {
    DAI: strategyDAI,
    NS2DRP: strategyNS2DRP,
    FF1DRP: strategyFF1DRP,
    CF4DRP: strategyCF4DRP,
    HT2DRP: strategyBL1DRP,
    BL1DRP: strategyHT2DRP,
    BR3DRP: strategyBR3DRP,
  },
  ReserveAssets: {
    [eEthereumNetwork.buidlerevm]: {},
    [eEthereumNetwork.hardhat]: {},
    [eEthereumNetwork.coverage]: {},
    [eEthereumNetwork.kovan]: {
      DAI: KDAI,
      NS2DRP: '0xe8fcCBf789736717b7a8d10a536147cD823e166E',
      FF1DRP: '0x0f763b4d5032f792fA39eE54BE5422592eC8329B',
      CF4DRP: '0x931C3Ff1F5aC377137d3AaFD80F601BD76cE106e',
      BL1DRP: '0x931C3Ff1F5aC377137d3AaFD80F601BD76cE106e',
      HT2DRP: '0xe99fb3ec1Ae8f3D7222CcBb83239B30928776c5b',
      BR3DRP: '0x931C3Ff1F5aC377137d3AaFD80F601BD76cE106e',
    },
    [eEthereumNetwork.ropsten]: {},
    [eEthereumNetwork.main]: {
      DAI: DAI,
      NS2DRP: '0xE4C72b4dE5b0F9ACcEA880Ad0b1F944F85A9dAA0',
      FF1DRP: '0x44718d306a8Fa89545704Ae38B2B97c06bF11FC1',
      CF4DRP: '0x5b2F0521875B188C0afc925B1598e1FF246F9306',
      BL1DRP: '0x1AEFc15dE9C2E1Ebb97146c3C2CDC4fc0aD539bC',
      HT2DRP: '0xd511397f79b112638ee3B6902F7B53A0A23386C4',
      BR3DRP: '0x8d2b8Df9Cb35B875F9726F43a013caF16aEFA472',
    },
    [eEthereumNetwork.tenderlyMain]: {},
  },
  AssessorContracts: {
    [eEthereumNetwork.buidlerevm]: {},
    [eEthereumNetwork.hardhat]: {},
    [eEthereumNetwork.coverage]: {},
    [eEthereumNetwork.kovan]: {
      NS2DRP: '0x1E5bc41316B2f696C201dE2Df1059D8d9d98EB71',
      FF1DRP: '0xac7582C83bb4730bB3F9537A20f73B380B59787C',
      CF4DRP: '0xe5B1C9DB5316350e1501ADe417cBe44d2D6A04Cd',
      BL1DRP: '0xe5B1C9DB5316350e1501ADe417cBe44d2D6A04Cd',
      HT2DRP: '0xac7582C83bb4730bB3F9537A20f73B380B59787C',
      BR3DRP: '0xe5B1C9DB5316350e1501ADe417cBe44d2D6A04Cd',
    },
    [eEthereumNetwork.ropsten]: {},
    [eEthereumNetwork.main]: {
      NS2DRP: '0xdA0bA5Dd06C8BaeC53Fa8ae25Ad4f19088D6375b',
      FF1DRP: '0x4e7D665FB7747747bd770CB35F604412249AE8bC',
      CF4DRP: '0x6aaf2EE5b2B62fb9E29E021a1bF3B381454d900a',
      BL1DRP: '0x2B8feA4eEDB43fCa58ccb063221FaE5858b47538',
      HT2DRP: '0x6e40A9d1eE2c8eF95322b879CBae35BE6Dd2D143',
      BR3DRP: '0x546F37C27483ffd6deC56076d0F8b4B636C5616B',
    },
    [eEthereumNetwork.tenderlyMain]: {},
  },
  AssetCurrencies: {
    [eEthereumNetwork.buidlerevm]: {},
    [eEthereumNetwork.hardhat]: {},
    [eEthereumNetwork.coverage]: {},
    [eEthereumNetwork.kovan]: {
      NS2DRP: KDAI,
      FF1DRP: KDAI,
      CF4DRP: KDAI,
      BL1DRP: KDAI,
      HT2DRP: KDAI,
      BR3DRP: KDAI,
    },
    [eEthereumNetwork.ropsten]: {},
    [eEthereumNetwork.main]: {
      NS2DRP: DAI,
      FF1DRP: DAI,
      CF4DRP: DAI,
      BL1DRP: DAI,
      HT2DRP: DAI,
      BR3DRP: DAI,
    },
    [eEthereumNetwork.tenderlyMain]: {},
  },
};

export default CentrifugeConfig;
