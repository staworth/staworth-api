/**
 * Portfolio position metadata including display names, URLs, and image paths
 */

interface PositionMetadata {
  name: string;
  url: string;
  img: string;
}

const AAVE_METADATA: Record<string, PositionMetadata> = {
  aOptWstEth: {
    name: 'Aave OP wstETH',
    url: 'https://app.aave.com/reserve-overview/?underlyingAsset=0x1f32b1c2345538c0c6f582fcb022739c4a194ebb&marketName=proto_optimism_v3',
    img: '/images/portfolio/wsteth-token.webp',
  },
  aGnowstEth: {
    name: 'Aave Gnosis wstETH',
    url: 'https://app.aave.com/reserve-overview/?underlyingAsset=0x6c76971f98945ae98dd7d4dfca8711ebea946ea6&marketName=proto_gnosis_v3',
    img: '/images/portfolio/wsteth-token.webp',
  },
  aBaseCbEth: {
    name: 'Aave Base cbETH',
    url: 'https://app.aave.com/reserve-overview/?underlyingAsset=0x2ae3f1ec7f1f5012cfeab0185bfc7aa3cf0dec22&marketName=proto_base_v3',
    img: '/images/portfolio/cbeth-token.webp',
  },
  aBaseCbBtc: {
    name: 'Aave Base cbBTC',
    url: 'https://app.aave.com/reserve-overview/?underlyingAsset=0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf&marketName=proto_base_v3',
    img: '/images/portfolio/cbbtc-token.webp',
  },
  aOptWbtc: {
    name: 'Aave OP wBTC',
    url: 'https://app.aave.com/reserve-overview/?underlyingAsset=0x68f180fcce6836688e9084f035309e29bf0a2095&marketName=proto_optimism_v3',
    img: '/images/portfolio/wbtc-token.webp',
  },
};

const BEEFY_METADATA: Record<string, PositionMetadata> = {
  'velodrome-v2-frax-usdc': {
    name: 'Beefy OP Velodrome FRAX-USDC',
    url: 'https://app.beefy.com/vault/velodrome-v2-frax-usdc',
    img: '/images/portfolio/bifi-token.webp',
  },
  'curve-op-crvusd-usdt': {
    name: 'Beefy OP Curve crvUSD-USDT',
    url: 'https://app.beefy.com/vault/curve-op-crvusd-usdt',
    img: '/images/portfolio/bifi-token.webp',
  },
};

export function getAaveMetadata(tokenName: string): PositionMetadata {
  return AAVE_METADATA[tokenName] || {
    name: `Aave ${tokenName}`,
    url: 'https://app.aave.com/',
    img: '/images/portfolio/aave-token.webp',
  };
}

export function getBeefyMetadata(vaultName: string): PositionMetadata {
  return BEEFY_METADATA[vaultName] || {
    name: `Beefy ${vaultName}`,
    url: `https://app.beefy.com/vault/${vaultName}`,
    img: '/images/portfolio/bifi-token.webp',
  };
}
