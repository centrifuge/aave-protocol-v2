import { task } from 'hardhat/config';
import { checkVerification } from '../../helpers/etherscan-verification';
import { ConfigNames } from '../../helpers/configuration';
import { printContracts } from '../../helpers/misc-utils';
import { usingTenderly } from '../../helpers/tenderly-utils';
import * as contractGetters from '../../helpers/contracts-getters';

task('rwa:mainnet', 'Deploy development enviroment')
  .addFlag('verify', 'Verify contracts at Etherscan')
  .addFlag('skipRegistry', 'Skip addresses provider registration at Addresses Provider Registry')
  .setAction(async ({ verify, skipRegistry }, DRE) => {
    const POOL_NAME = ConfigNames.Rwa;
    await DRE.run('set-DRE');

    // Prevent loss of gas verifying all the needed ENVs for Etherscan verification
    if (verify) {
      checkVerification();
    }

    console.log('Migration started\n');

    console.log('1. Deploy address provider');
    await DRE.run('full:deploy-address-provider', { verify, pool: POOL_NAME, skipRegistry });

    console.log('2. Deploy permissions manager');
    await DRE.run('deploy-permission-manager', { verify, pool: POOL_NAME });

    console.log('3. Deploy lending pool');
    await DRE.run('full:deploy-lending-pool', { verify, pool: POOL_NAME, permissioned: true });

    console.log('4. Deploy oracles');
    await DRE.run('full:deploy-oracles', { verify, pool: POOL_NAME });

    console.log('5. Deploy Data Provider');
    await DRE.run('full:data-provider', { verify, pool: POOL_NAME });

    console.log('6. Initialize lending pool');
    await DRE.run('full:initialize-lending-pool', { verify, pool: POOL_NAME });

    const oracle = await contractGetters.getAaveOracle();
    await oracle.setAssetSources(
      ['0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD', '0x10F7Fc1F91Ba351f9C629c5947AD69bD03C05b96'],
      ['0x777A68032a88E5A84678A77Af2CD65A7b3c0775a', '0x777A68032a88E5A84678A77Af2CD65A7b3c0775a']
    );

    const permissionManager = await contractGetters.getPermissionManager();
    await permissionManager.addPermissionAdmins(['0x0A735602a357802f553113F5831FE2fbf2F0E2e0']);
    await permissionManager.addPermissions(
      [0, 1, 2],
      [
        '0x0A735602a357802f553113F5831FE2fbf2F0E2e0',
        '0x0A735602a357802f553113F5831FE2fbf2F0E2e0',
        '0x0A735602a357802f553113F5831FE2fbf2F0E2e0',
      ]
    );

    if (verify) {
      printContracts();
      console.log('7. Verifying contracts');
      await DRE.run('verify:general', { all: true, pool: POOL_NAME });

      console.log('8. Verifying aTokens and debtTokens');
      await DRE.run('verify:tokens', { pool: POOL_NAME });
    }

    if (usingTenderly()) {
      const postDeployHead = DRE.tenderlyNetwork.getHead();
      const postDeployFork = DRE.tenderlyNetwork.getFork();
      console.log('Tenderly Info');
      console.log('- Head', postDeployHead);
      console.log('- Fork', postDeployFork);
    }
    console.log('\nFinished migrations');
    printContracts();
  });
