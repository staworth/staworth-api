export const getPrice = async (
  priceSymbol: string,
  priceSource: 'beefy api' | 'beefy databarn' | 'coingecko'
): Promise<number> => {
  let price: number;

  if (priceSource === 'beefy api') {
    const response = await fetch('https://api.beefy.finance/prices');
    if (!response.ok) {
      throw new Error(
        `Error fetching price from Beefy: ${response.status} ${response.statusText}`
      );
    }
    const data = (await response.json()) as Record<string, number>;
    price = data[priceSymbol]!;
    if (price === undefined) {
      const sampleKeys = Object.keys(data).slice(0, 20).join(', ');
      throw new Error(
        `Price not found for symbol '${priceSymbol}' in Beefy response. Sample keys: ${sampleKeys}`
      );
    }

  } else if (priceSource === 'coingecko') {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${priceSymbol}&vs_currencies=usd`
    );
    if (!response.ok) {
      throw new Error(
        `Error fetching price from CoinGecko: ${response.status} ${response.statusText}`
      );
    }
    const data = (await response.json()) as Record<string, { usd: number }>;
    const cgEntry = data[priceSymbol];
    if (!cgEntry) {
      const sampleKeys = Object.keys(data).slice(0, 20).join(', ');
      throw new Error(
        `Price not found for id '${priceSymbol}' in CoinGecko response. Sample keys: ${sampleKeys}`
      );
    }
    price = cgEntry.usd;
  
  } else if (priceSource === 'beefy databarn') {
    const utcDatetime = new Date().toISOString();
    const getUrl = `https://db-core.beefy.com/api/v1/price/around-a-date?price_type=token_usd&oracle_id=${priceSymbol}&utc_datetime=${utcDatetime}&look_around=1day&half_limit=1`;
    const response = await fetch(getUrl);
    if (!response.ok) {
      throw new Error(
        `Error fetching price from Beefy Databarn: ${response.status} ${response.statusText}`
      );
    }
    const data = (await response.json()) as {
      priceRows: { price: number }[];
    };
    const firstRow = data.priceRows[0];
    if (!firstRow) {
      throw new Error(
        `Error: Databarn API failed to return a price value for symbol '${priceSymbol}'`
      );
    }
    price = firstRow.price;
  
  } else {
    throw new Error(`Invalid price source: ${priceSource}`);
  }
  return price;
};
