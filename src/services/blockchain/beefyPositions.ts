interface TimelineEntry {
    datetime: string;
    product_key: string;
    display_name: string;
    chain: string;
    is_eol: boolean;
    is_dashboard_eol: boolean;
    transaction_hash: string;
    share_to_underlying_price: number;
    underlying_to_usd_price: number;
    share_balance: number;
    underlying_balance: number;
    usd_balance: number;
    share_diff: number;
    underlying_diff: number;
    usd_diff: number;
}

interface BeefyPosition {
    product: string;
    chain: string;
    balance: number;
    value: number;
}

interface BeefyPositions {
    [display_name: string]: BeefyPosition;
}

async function getBeefyTimeline(walletAddress: string): Promise<TimelineEntry[]> {
    const response = await fetch(`https://databarn.beefy.com/api/v1/beefy/timeline?address=${walletAddress}`);
    if (response.status === 404) {
        // No timeline for this address; treat as no positions instead of failing the portfolio run
        return [];
    }
    if (!response.ok) {
        throw new Error(`Error fetching Beefy timeline: ${response.status} ${response.statusText}`);
    }
    const data = await response.json() as TimelineEntry[];
    return data;
}

async function getBeefyPositions(walletAddress: string ): Promise<BeefyPositions> {
    const timeline: TimelineEntry[] = await getBeefyTimeline(walletAddress);
    if (!timeline.length) {
        return {};
    }
    
    // Map display names to product names
    const productNameMap: Record<string, string> = {
        'velodrome-v2-frax-usdc': 'Beefy Velodrome V2 Frax Usdc Vault',
        'curve-op-crvusd-usdt': 'Beefy Curve Op Crvusd Usdt Vault'
    };
    
    const latestEntries = new Map<string, TimelineEntry>();
    
    for (const entry of timeline) {
        const existing = latestEntries.get(entry.display_name);
        
        if (!existing || new Date(entry.datetime) > new Date(existing.datetime)) {
            latestEntries.set(entry.display_name, entry);
        }
    }
    
    const positions: BeefyPositions = {};
    
    for (const [displayName, entry] of latestEntries) {
        if (entry.underlying_balance === 0 || entry.usd_balance === 0) {
            continue;
        }
        if (displayName === 'optimism-bridged-bifi-vault') {
            continue;
        }
        
        positions[displayName] = {
            product: productNameMap[displayName] || entry.display_name,
            chain: entry.chain,
            balance: entry.underlying_balance,
            value: entry.usd_balance
        };
    }
    
    return positions;
}

export {
    getBeefyPositions
};
export type {
    TimelineEntry,
    BeefyPosition,
    BeefyPositions
};
