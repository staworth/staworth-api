export interface Contract {
    chain: string;
    type: string;
    defi_protocol: string | null;
    price_symbol: string | null;
    price_source: 'beefy api' | 'beefy databarn' | 'coingecko' | null;
    address: string;
    abi: any[];
    decimals: number;
}

export interface Contracts {
    [key: string]: Contract;
}