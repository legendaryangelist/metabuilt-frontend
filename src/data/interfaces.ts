export interface HomepageMeta {
    title: string;
    description: string;
}

export interface ICommunityInfo {
    community_id: number;
    community_owner: string;
    community_name: string;
    community_description: string;
    community_source_image: any;
    badge_event_id?: string;
    badge_name?: string;
    badge_description?: string;
    badge_source_image?: string;
    members: string[];
    public_members: Map<string, string>[];
}