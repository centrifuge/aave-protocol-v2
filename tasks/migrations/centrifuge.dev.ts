import { task } from 'hardhat/config';
import { checkVerification } from '../../helpers/etherscan-verification';
import { ConfigNames } from '../../helpers/configuration';
import { printContracts } from '../../helpers/misc-utils';
import CentrifugeConfig from '../../markets/centrifuge';
import { deployMockTokens } from '../../helpers/contracts-deployments';

task('centrifuge:dev', 'Deploy development enviroment')
  .addOptionalParam('verify', 'Verify contracts at Etherscan')
  .setAction(async ({ verify }, localBRE) => {
    const POOL_NAME = ConfigNames.Centrifuge;

    await localBRE.run('set-DRE');

    // Prevent loss of gas verifying all the needed ENVs for Etherscan verification
    if (verify) {
      checkVerification();
    }

    console.log('Migration started\n');

    console.log('1. Deploy mock tokens');
    await deployMockTokens(CentrifugeConfig, verify);

    console.log('2. Deploy address provider');
    await localBRE.run('dev:deploy-address-provider', { verify });

    console.log('3. Deploy lending pool');
    await localBRE.run('dev:deploy-lending-pool', { verify });

    console.log('4. Deploy oracles');
    await localBRE.run('dev:deploy-oracles', { verify, pool: POOL_NAME });

    console.log('5. Initialize lending pool');
    await localBRE.run('dev:initialize-lending-pool', { verify, pool: POOL_NAME });

    console.log('\nFinished migration');
    printContracts();
  });
