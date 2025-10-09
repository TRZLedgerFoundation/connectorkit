'use client';

import { useConnector } from '@connector-kit/connector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Info, Code2, Zap } from 'lucide-react';
import { LegacySolTransfer } from './legacy-sol-transfer';
import { ModernSolTransfer } from './modern-sol-transfer';

/**
 * Transaction Demo Container
 * 
 * Displays both legacy and modern transaction approaches side-by-side,
 * demonstrating how connector-kit's compat layer seamlessly bridges
 * the gap between old and new Solana development patterns.
 */
export function TransactionDemo() {
    const { connected } = useConnector();

    if (!connected) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <Alert>
                        <Info className="h-4 w-4" />
                        <div className="ml-2">
                            <p className="font-medium">Wallet Connection Required</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Please connect your wallet to test transactions. This demo works on devnet and mainnet.
                            </p>
                        </div>
                    </Alert>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Overview Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Code2 className="h-6 w-6" />
                        Transaction Testing Lab
                    </CardTitle>
                    <CardDescription className="text-base">
                        Test real SOL transfers using both legacy (@solana/web3.js) and modern (@solana/kit) approaches.
                        This demonstrates how connector-kit provides seamless compatibility across different Solana development patterns.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="p-4 bg-white rounded-lg border">
                            <div className="flex items-center gap-2 mb-2">
                                <Code2 className="h-4 w-4 text-blue-600" />
                                <h4 className="font-medium">Legacy Approach</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Uses wallet adapter compat layer with @solana/web3.js v1. Perfect for migrating existing apps.
                            </p>
                        </div>
                        <div className="p-4 bg-white rounded-lg border">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="h-4 w-4 text-purple-600" />
                                <h4 className="font-medium">Modern Approach</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Uses TransactionSigner directly without compat layer. Shows native connector-kit usage.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Transaction Forms Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                <LegacySolTransfer />
                <ModernSolTransfer />
            </div>

            {/* Safety Notice */}
            <Alert>
                <Info className="h-4 w-4" />
                <div className="ml-2">
                    <p className="text-sm">
                        <span className="font-medium">Demo Tip:</span> Use a devnet wallet or test with small amounts.
                        Default recipient is a demo address that will work on any network.
                    </p>
                </div>
            </Alert>
        </div>
    );
}

