import { task } from 'hardhat/config';
import { checkVerification } from '../../helpers/etherscan-verification';
import { ConfigNames } from '../../helpers/configuration';
import { printContracts } from '../../helpers/misc-utils';
import { usingTenderly } from '../../helpers/tenderly-utils';
import * as contractGetters from '../../helpers/contracts-getters';

task('centrifuge:mainnet', 'Deploy development enviroment')
  .addFlag('verify', 'Verify contracts at Etherscan')
  .addFlag('skipRegistry', 'Skip addresses provider registration at Addresses Provider Registry')
  .setAction(async ({ verify, skipRegistry }, DRE) => {
    const POOL_NAME = ConfigNames.Centrifuge;
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

    console.log('block', DRE.ethers.provider.blockNumber);

    const lendingPool = await contractGetters.getLendingPool();
    const permissionManager = await contractGetters.getPermissionsManager();
    const owner = await contractGetters.getFirstSigner();
    const DAI = await contractGetters.getIErc20Detailed(
      '0x6B175474E89094C44Da98b954EedeAC495271d0F'
    );
    const NS2DRP = await contractGetters.getIErc20Detailed(
      '0xE4C72b4dE5b0F9ACcEA880Ad0b1F944F85A9dAA0'
    );
    const aNS2DRP = (await lendingPool.getReserveData(NS2DRP.address)).aTokenAddress;

    // Give permissions
    const network = (await DRE.ethers.provider.getNetwork()).name;
    console.log(`Network: ${network}`);
    const whale =
      network === 'kovan'
        ? '0xf92afb6aa0b35a664b4844728bede737a78b89bc'
        : '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503';
    const dropHolder =
      network === 'kovan'
        ? '0x0A735602a357802f553113F5831FE2fbf2F0E2e0'
        : '0x648d7638C9D2f8aA5a08B551295a92E4Bc02d973';
    const kovanAdmin =
      network === 'kovan'
        ? '0x0A735602a357802f553113F5831FE2fbf2F0E2e0'
        : '0x0A735602a357802f553113F5831FE2fbf2F0E2e0';
    await permissionManager
      .connect(owner)
      .addPermissionAdmins([await owner.getAddress(), kovanAdmin]);
    await permissionManager
      .connect(owner)
      .addPermissions([DEPOSITOR, DEPOSITOR, BORROWER], [whale, dropHolder, dropHolder]);

    // Deposit DAI from a whale
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
    const oracle = await contractGetters.getAaveOracle();
    const daiPrice = await oracle.getAssetPrice(DAI.address);
    console.log(`DAI price: ${daiPrice}`);
    const dropPrice = await oracle.getAssetPrice(NS2DRP.address);
    console.log(`NS2DRP price: ${dropPrice}`);

    console.log(`Old DAI balance: ${(await DAI.balanceOf(dropHolder)).toString()}`);
    await lendingPool
      .connect(signer)
      .borrow(DAI.address, DRE.ethers.utils.parseUnits('9500'), 2, 0, await signer.getAddress());
    console.log(`New DAI balance: ${(await DAI.balanceOf(dropHolder)).toString()}`);
  });

const DEPOSITOR = 0,
  BORROWER = 1,
  LIQUIDATOR = 2;
