
type SourceType = "website" | "docs" | "text" | "upload"
type SourceStatus = "active" | "training" | "error" | "excluded"

export interface KnowlegdeSource {
    id: string;
    user_email: string;
    type: string
    name: string
    status: string
    source_url?: string;
    content: string | null;
    meta_data: string | null;
    created_at: string | null;
    last_updated: string | null;
}

export type SourceTypes  = "website" | "docs" | "text" | "upload"


export interface SectionFormData {
    name: string
    description: string
    tone: Tone
    allowedTopics: string
    blockedTopics: string
    fallbackBehaviour: string
}

export interface Section {
    id: string
    name: string
    description: string
    sourceCount: number
    source_ids?: string[]
    scopeLabel: string
    tone: Tone
    allowedTopics?: string
    blockedTopics?: string
    status: SectionStatus
}
