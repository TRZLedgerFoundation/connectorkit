/**
 * Basic instruction decoder
 * Decodes common instruction types for display
 */

import { ParsedInstruction, PartiallyDecodedInstruction } from '@solana/web3.js';
import { getShortProgramName } from './program-names';

export interface DecodedInstruction {
    index: number;
    programId: string;
    programName: string;
    instructionName: string;
    data?: string;
}

/**
 * Decode instruction to readable format
 */
export function decodeInstruction(
    instruction: ParsedInstruction | PartiallyDecodedInstruction,
    index: number
): DecodedInstruction {
    const programId = instruction.programId.toBase58();
    const programName = getShortProgramName(programId);

    // Handle parsed instructions (Token, System, etc.)
    if ('parsed' in instruction && typeof instruction.parsed === 'object') {
        const parsed = instruction.parsed as any;
        const instructionType = parsed.type || 'Unknown';
        
        return {
            index: index + 1,
            programId,
            programName,
            instructionName: formatInstructionType(instructionType),
        };
    }

    // Handle partially decoded instructions
    if ('data' in instruction) {
        return {
            index: index + 1,
            programId,
            programName,
            instructionName: 'Unknown Instruction',
            data: typeof instruction.data === 'string' ? instruction.data : undefined,
        };
    }

    return {
        index: index + 1,
        programId,
        programName,
        instructionName: 'Unknown',
    };
}

/**
 * Format instruction type for display
 * Converts camelCase to Title Case
 */
function formatInstructionType(type: string): string {
    // Handle common patterns
    const formatted = type
        // Insert space before capital letters
        .replace(/([A-Z])/g, ' $1')
        // Capitalize first letter
        .replace(/^./, str => str.toUpperCase())
        // Clean up multiple spaces
        .replace(/\s+/g, ' ')
        .trim();

    return formatted;
}

/**
 * Get instruction display name for UI
 */
export function getInstructionDisplayName(instruction: DecodedInstruction): string {
    return `${instruction.instructionName} (${instruction.programName})`;
}

