// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import {Ownable} from '../dependencies/openzeppelin/contracts/Ownable.sol';
import {SafeMath} from '../dependencies/openzeppelin/contracts/SafeMath.sol';
import {IPriceOracleGetter} from '../interfaces/IPriceOracleGetter.sol';

interface ICentrifugeAssessor {
  function calcSeniorTokenPrice() external view returns (uint256);
}

/**
  This acts as a fallback oracle for the DROP tokens, and uses the token price from the Tinlake Assessor contract.
 */
contract CentrifugeOracle is IPriceOracleGetter, Ownable {
  using SafeMath for uint256;

  event AssetConfigUpdated(address indexed asset, address indexed source, address indexed currency);

  // assetSources are the assessor contract addresses for each DROP token.
  mapping(address => ICentrifugeAssessor) public assetsSources;

  // assetCurrencies are the currencies in which each DROP token is denominated.
  mapping(address => address) public assetsCurrencies;

  // aaveOracle is the address of the deployed AaveOracle contract.
  address private aaveOracle;

  /// @notice External function called by the Aave governance to set or replace the Aave oracle address
  /// @param _aaveOracle The address of the aave oracle
  function setAaveOracle(address _aaveOracle) external onlyOwner {
    aaveOracle = _aaveOracle;
  }

  /// @notice External function called by the Aave governance to set or replace sources of assets
  /// @param assets The addresses of the assets
  /// @param sources The address of the source of each asset
  function setAssetConfig(
    address[] memory assets,
    address[] memory sources,
    address[] memory currencies
  ) external onlyOwner {
    require(
      assets.length == sources.length && assets.length == currencies.length,
      'INCONSISTENT_PARAMS_LENGTH'
    );

    for (uint256 i = 0; i < assets.length; i++) {
      assetsSources[assets[i]] = ICentrifugeAssessor(sources[i]);
      assetsCurrencies[assets[i]] = currencies[i];
      emit AssetConfigUpdated(assets[i], sources[i], currencies[i]);
    }
  }

  /// @notice Gets an asset price by address
  /// @param asset The asset address
  function getAssetPrice(address asset) public view override returns (uint256) {
    ICentrifugeAssessor source = assetsSources[asset];
    address currency = assetsCurrencies[asset];

    uint256 daiPrice = IPriceOracleGetter(aaveOracle).getAssetPrice(currency);

    if (address(source) == address(0)) {
      return 1 ether;
    } else {
      return source.calcSeniorTokenPrice().mul(daiPrice).div(10**27);
    }
  }
}
