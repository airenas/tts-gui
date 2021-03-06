export interface SynthesisResult {
    synthesisStatus?: string;
    audioAsString?: string;
    error?: string;
    message?: string;
    validationFailItems?: ValidateFailItem[];
    requestID?: string;
    text?: string;
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
