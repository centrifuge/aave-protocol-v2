// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import {Ownable} from '../dependencies/openzeppelin/contracts/Ownable.sol';
import {IERC20} from '../dependencies/openzeppelin/contracts/IERC20.sol';

import {IPriceOracleGetter} from '../interfaces/IPriceOracleGetter.sol';
import {SafeERC20} from '../dependencies/openzeppelin/contracts/SafeERC20.sol';

interface ICentrifugeAssessor {
  function calcSeniorTokenPrice() external view returns (uint256);
}

/**
  This acts as a fallback oracle for the DROP tokens, and uses the token price from the Tinlake ASSESSOR contract.
 */
contract CentrifugeOracle is IPriceOracleGetter, Ownable {
  using SafeERC20 for IERC20;

  event AssetSourceUpdated(address indexed asset, address indexed source);

  // assetsSources are the ASSESSOR contract addresses for each DROP token.
  mapping(address => address) private assetsSources;

  /// @notice External function called by the Aave governance to set or replace sources of assets
  /// @param assets The addresses of the assets
  /// @param sources The address of the source of each asset
  function setAssetSources(address[] calldata assets, address[] calldata sources)
    external
    onlyOwner
  {
    _setAssetsSources(assets, sources);
  }

  /// @notice Internal function to set the sources for each asset
  /// @param assets The addresses of the assets
  /// @param sources The address of the source of each asset
  function _setAssetsSources(address[] memory assets, address[] memory sources) internal {
    require(assets.length == sources.length, 'INCONSISTENT_PARAMS_LENGTH');
    for (uint256 i = 0; i < assets.length; i++) {
      assetsSources[assets[i]] = sources[i];
      emit AssetSourceUpdated(assets[i], sources[i]);
    }
  }

  /// @notice Gets an asset price by address
  /// @param asset The asset address
  function getAssetPrice(address asset) public view override returns (uint256) {
    ICentrifugeAssessor source = ICentrifugeAssessor(assetsSources[asset]);

    if (address(source) == address(0)) {
      return 1 ether;
    } else {
      return source.calcSeniorTokenPrice();
    }
  }
}
