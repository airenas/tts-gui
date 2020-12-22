export interface SynthesisResult {
    synthesisStatus?: string;
    audioAsString?: string;
    error?: string;
    validationFailItems?: ValidateFailItem[];
}

export interface ValidateFailItem {
    check: Check;
    failingText?: string;
    failingPosition?: number;
}

export interface Check {
    id: string;
    value?: number;
}
