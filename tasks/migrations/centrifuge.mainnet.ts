import { task } from 'hardhat/config';
import { checkVerification } from '../../helpers/etherscan-verification';
import { ConfigNames } from '../../helpers/configuration';
import { printContracts } from '../../helpers/misc-utils';
import { usingTenderly } from '../../helpers/tenderly-utils';

task('centrifuge:mainnet', 'Deploy development enviroment')
  .addFlag('verify', 'Verify contracts at Etherscan')
  .setAction(async ({ verify }, DRE) => {
    const POOL_NAME = ConfigNames.Centrifuge;
    await DRE.run('set-DRE');

    // Prevent loss of gas verifying all the needed ENVs for Etherscan verification
    if (verify) {
      checkVerification();
    }

    console.log('Migration started\n');

    console.log('1. Deploy address provider');
    await DRE.run('full:deploy-address-provider', { pool: POOL_NAME });

    console.log('2. Deploy lending pool');
    await DRE.run('full:deploy-lending-pool', { pool: POOL_NAME });

    console.log('3. Deploy oracles');
    await DRE.run('full:deploy-oracles', { pool: POOL_NAME });

    console.log('4. Deploy Data Provider');
    await DRE.run('full:data-provider', { pool: POOL_NAME });

    console.log('5. Initialize lending pool');
    await DRE.run('full:initialize-lending-pool', { pool: POOL_NAME });

    if (verify) {
      printContracts();
      console.log('6. Verifying contracts');
      await DRE.run('verify:general', { all: true, pool: POOL_NAME });

      console.log('7. Verifying aTokens and debtTokens');
      await DRE.run('verify:tokens', { pool: POOL_NAME });
    }

    if (usingTenderly()) {
      const postDeployHead = DRE.tenderlyRPC.getHead();
      const postDeployFork = DRE.tenderlyRPC.getFork();
      console.log('Tenderly Info');
      console.log('- Head', postDeployHead);
      console.log('- Fork', postDeployFork);
    }
    console.log('\nFinished migrations');
    printContracts();

    const contractGetters = require('../../helpers/contracts-getters');
    const lendingPool = await contractGetters.getLendingPool();
    const DAI = await contractGetters.getIErc20Detailed(
      '0x6B175474E89094C44Da98b954EedeAC495271d0F'
    );
    const NS2DRP = await contractGetters.getIErc20Detailed(
      '0xE4C72b4dE5b0F9ACcEA880Ad0b1F944F85A9dAA0'
    );
    const aNS2DRP = (await lendingPool.getReserveData(NS2DRP.address)).aTokenAddress;

    // Deposit DAI from a whale
    const whale = '0xB1AdceddB2941033a090dD166a462fe1c2029484';
    console.log(`1. Depositing 1M DAI from ${whale}`);
    await DRE.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [whale],
    });
    let signer = await DRE.ethers.provider.getSigner(whale);
    await DAI.connect(signer).approve(lendingPool.address, DRE.ethers.utils.parseUnits('1000000'));
    console.log(`Old DAI balance: ${(await DAI.balanceOf(whale)).toString()}`);
    await lendingPool
      .connect(signer)
      .deposit(DAI.address, DRE.ethers.utils.parseUnits('1000000'), whale, '0');
    console.log(`New DAI balance: ${(await DAI.balanceOf(whale)).toString()}\n`);

    // Whitelist the aNS2DRP contract to receive NS2DRP tokens
    console.log(`2. Whitelisting the aNS2DRP contract for NS2DRP`);
    const memberlistAdmin = '0x71d9f8CFdcCEF71B59DD81AB387e523E2834F2b8';
    await DRE.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [memberlistAdmin],
    });
    signer = await DRE.ethers.provider.getSigner(memberlistAdmin);
    const seniorMemberlist = '0x5B5CFD6E45F1407ABCb4BFD9947aBea1EA6649dA';

    const tokenAbi = [`function hasMember(address) public view returns (bool)`];
    const tokenContract = new DRE.ethers.Contract(NS2DRP.address, tokenAbi, signer);
    console.log(`In memberlist: ${await tokenContract.hasMember(aNS2DRP)}`);

    const memberlistAbi = [`function updateMember(address usr, uint validUntil)`];
    const memberlistContract = new DRE.ethers.Contract(seniorMemberlist, memberlistAbi, signer);
    await memberlistContract.updateMember(aNS2DRP, 1717011101);

    console.log(`In memberlist: ${await tokenContract.hasMember(aNS2DRP)}\n`);

    // Deposit NS2DRP as collateral
    const dropHolder = '0xb9d64860F0064DBFB9b64065238dDA80D36FcA17';
    console.log(`3. Depositing NS2DRP from ${dropHolder}`);
    await DRE.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [dropHolder],
    });
    signer = await DRE.ethers.provider.getSigner(dropHolder);
    console.log(`Signer address is ${await signer.getAddress()}`);
    console.log(`Old NS2DRP balance: ${(await NS2DRP.balanceOf(dropHolder)).toString()}`);
    await NS2DRP.connect(signer).approve(lendingPool.address, DRE.ethers.utils.parseUnits('10000'));

    await lendingPool
      .connect(signer)
      .deposit(NS2DRP.address, DRE.ethers.utils.parseUnits('10000'), dropHolder, '0');
    console.log(`New NS2DRP balance: ${(await NS2DRP.balanceOf(dropHolder)).toString()}\n`);

    // Borrow DAI
    console.log(`4. Borrowing DAI as ${dropHolder}`);
    // await lendingPool.setUserUseReserveAsCollateral(NS2DRP.address, true);
    console.log(`Old DAI balance: ${(await DAI.balanceOf(dropHolder)).toString()}`);
    await lendingPool
      .connect(signer)
      .borrow(DAI.address, DRE.ethers.utils.parseUnits('10000'), 1, 0, await signer.getAddress());
    console.log(`New DAI balance: ${(await DAI.balanceOf(dropHolder)).toString()}`);
  });
