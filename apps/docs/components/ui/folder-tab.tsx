"use client";

import React from 'react';
import { IconKeyFill, IconEye, IconEyeSlash } from 'symbols-react';
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface FolderTabProps {
  iconName: string;
  apiKeyPreview?: string;
  hasApiKey?: boolean;
  isRegenerating?: boolean;
  onRegenerate?: () => void;
  icon?: React.ReactNode;
  copyTooltip?: string;
  regenerateTooltip?: string;
  isRevealed?: boolean;
  onToggleReveal?: () => void;
  actions?: {
    icon: React.ReactNode;
    onClick: () => void;
    tooltip: string;
    variant?: 'default' | 'destructive';
  }[];
}

export function FolderTab({ 
  iconName, 
  apiKeyPreview,
  hasApiKey = false,
  isRegenerating = false,
  onRegenerate,
  icon,
  copyTooltip,
  regenerateTooltip,
  isRevealed = false,
  onToggleReveal,
  actions = [],
}: FolderTabProps) {
  const defaultIcon = <IconKeyFill className="h-4 w-4 fill-zinc-500/80 rotate-[-30deg]" />;
  const displayIcon = icon || defaultIcon;
  const defaultCopyTooltip = hasApiKey ? "Copy content" : "Content not ready";
  const defaultRegenerateTooltip = isRegenerating ? "Regenerating..." : "Regenerate";

  return (
    <TooltipProvider>
      <div className="relative">
        <div className="flex items-center justify-between p-3 py-0 relative">
          {/* Folder tab effect - masked container */}
          <div className="bottom-0 left-[-12px] relative">
            <div className="relative" style={{ width: 'calc(100% + 10px)' }}>
              {/* Main tab content */}
              <div className="flex items-center gap-2 bg-zinc-800 dark:bg-zinc-900 px-4 py-2 rounded-t-xl border-t border-zinc-700 dark:border-zinc-800 relative z-20">
                {displayIcon}
                <span className="text-sm text-zinc-300 font-mono">
                  {iconName.length > 16 ? `${iconName.slice(0, 16)}...` : iconName}
                </span>
              </div>
              
              {/* Right diagonal side */}
              <div 
                className="absolute top-0 -right-[8.7px] w-8 h-full bg-zinc-800 dark:bg-zinc-900 border-t border-zinc-700 dark:border-zinc-800 z-10"
                style={{
                  transform: 'skew(25deg)',
                  borderRadius: '0 10px 0 0'
                }}
              />
              
              {/* Right curved corner - now properly clipped */}
              <div 
                className="absolute bottom-0 -right-[30px] h-[9px] w-[16px] rounded-bl-[30px] z-0"
                style={{
                  boxShadow: '-7px 7px 0 7px rgb(39 39 42)', // zinc-800 color
                  clipPath: 'inset(0 0 0 0)'
                }}
              />
            </div>
          </div>
          
          {/* Action buttons positioned in the tab area */}
          <div className="ml-auto flex items-center gap-1 mb-2">
            {actions.map((action, index) => (
              <Tooltip key={index} delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button
                    variant={action.variant || "ghost"}
                    size="icon"
                    onClick={action.onClick}
                    className="h-7 w-7 hover:bg-primary/10 rounded-sm transition-all duration-150"
                  >
                    {action.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-zinc-800 dark:bg-zinc-900 rounded-sm py-1 px-2">
                  <p className="text-xs text-white">{action.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ))}

            {apiKeyPreview !== undefined && (
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <div>
                    <CopyButton
                      textToCopy={apiKeyPreview}
                      showText={false}
                      disabled={!hasApiKey}
                      iconClassName="text-muted-foreground"
                      iconClassNameCheck="text-green-900"
                      className="h-7 w-7 flex items-center justify-center rounded-sm hover:bg-primary/10 transition-all duration-150"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-zinc-800 dark:bg-zinc-900 rounded-sm py-1 px-2">
                  <p className="text-xs text-white">
                    {copyTooltip || defaultCopyTooltip}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}

            {onToggleReveal && (
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleReveal}
                    disabled={!hasApiKey}
                    className="h-7 w-7 hover:bg-primary/10 rounded-sm transition-all duration-150"
                  >
                    {isRevealed ? (
                      <IconEyeSlash className="h-3.5 w-3.5 fill-current" />
                    ) : (
                      <IconEye className="h-3.5 w-3.5 fill-current" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-zinc-800 dark:bg-zinc-900 rounded-sm py-1 px-2">
                  <p className="text-xs text-white">
                    {isRevealed ? "Hide key" : "Show key"}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
            
            {onRegenerate && (
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onRegenerate}
                    disabled={!hasApiKey || isRegenerating}
                    className="h-7 w-7 hover:bg-red-500/10 hover:text-red-400 rounded-sm transition-all duration-150"
                  >
                    <RefreshCw className={`h-3 w-3 ${isRegenerating ? 'animate-spin' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-zinc-800 dark:bg-zinc-900 rounded-sm py-1 px-2">
                  <p className="text-xs text-white">
                    {regenerateTooltip || defaultRegenerateTooltip}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}