'use client';

import { TransactionDemo } from '@/components/transactions';
import { ConnectButton, ClusterSelector, AccountSwitcher } from '@/components/connector';
import { useConnector } from '@connector-kit/connector';
import { ConnectorDebugPanel } from '@connector-kit/debugger/react';
import { ArrowLeft, TestTube2 } from 'lucide-react';
import Link from 'next/link';

export default function TransactionsPage() {
    const { connected } = useConnector();

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>
                        <div className="flex items-center gap-2">
                            <TestTube2 className="h-5 w-5" />
                            <h1 className="text-lg font-bold">Transaction Testing</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {connected && (
                            <>
                                <ClusterSelector />
                                <AccountSwitcher />
                            </>
                        )}
                        <ConnectButton />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Hero Section */}
                    <div className="text-center space-y-3 py-8">
                        <h2 className="text-3xl font-bold tracking-tight">Transaction Testing Lab</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Test real SOL transfers using both legacy and modern Solana development approaches.
                            This demonstrates connector-kit&apos;s compatibility layer and debugger capabilities.
                        </p>
                    </div>

                    {/* Transaction Demo */}
                    <TransactionDemo />
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t mt-12 py-6 text-center text-sm text-muted-foreground">
                <p>Built with ConnectorKit • Testing compat layer and debugger integration</p>
            </footer>

            {/* Debugger Panel - Only shows in development */}
            <ConnectorDebugPanel defaultOpen={false} position="bottom-right" defaultTab="transactions" />
        </div>
    );
}

